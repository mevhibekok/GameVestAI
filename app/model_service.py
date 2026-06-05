from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from catboost import CatBoostClassifier


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

# Load model metadata (model configuration)
with open(MODEL_DIR / "model_metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

# Load dataset options (for validation and fallback)
with open(MODEL_DIR / "dataset_options.json", "r", encoding="utf-8") as f:
    dataset_options = json.load(f)

investment_model = CatBoostClassifier()
investment_model.load_model(str(MODEL_DIR / "catboost_investment_model.cbm"))

preprocessor = joblib.load(MODEL_DIR / "knn_preprocessor.joblib")
nn_model = joblib.load(MODEL_DIR / "knn_model.joblib")
recommend_df = joblib.load(MODEL_DIR / "recommend_df.joblib")


def normalize_publisher(publisher: str) -> str:
    """Normalize publisher to known publishers or 'Other'"""
    top_publishers = metadata["top_publishers"]

    if publisher in top_publishers:
        return publisher

    return "Other"


def normalize_genre(genre: str) -> str:
    """Normalize genre to known genres or default"""
    valid_genres = dataset_options.get("genres", [])
    
    if genre in valid_genres:
        return genre
    
    # Fallback: return first valid genre or 'Misc' if available
    if valid_genres:
        return "Misc" if "Misc" in valid_genres else valid_genres[0]
    return genre


def normalize_platform(platform: str) -> str:
    """Normalize platform to known platforms or default"""
    valid_platforms = dataset_options.get("platforms", [])
    
    if platform in valid_platforms:
        return platform
    
    # Fallback: return first valid platform if available
    if valid_platforms:
        return valid_platforms[0]
    return platform


def normalize_year(year: int) -> int:
    """Ensure year is within valid range"""
    valid_years = dataset_options.get("years", [])
    
    if not valid_years:
        return year
    
    min_year = min(valid_years)
    max_year = max(valid_years)
    
    # Clamp year to valid range
    return max(min_year, min(year, max_year))


def predict_investment(platform: str, genre: str, publisher: str, year: int):
    """Predict investment opportunity with automatic normalization and fallback"""
    
    # Normalize inputs to safe values
    platform_normalized = normalize_platform(platform)
    genre_normalized = normalize_genre(genre)
    publisher_normalized = normalize_publisher(publisher)
    year_normalized = normalize_year(year)
    publisher_grouped = publisher_normalized

    input_df = pd.DataFrame([{
        "platform": platform_normalized,
        "year": int(year_normalized),
        "genre": genre_normalized,
        "publisher_grouped": publisher_grouped
    }])

    probabilities = investment_model.predict_proba(input_df)[0]
    classes = list(investment_model.classes_)

    good_index = classes.index(metadata["positive_class"])
    good_probability = float(probabilities[good_index])

    threshold = metadata["investment_threshold"]

    if good_probability >= threshold:
        prediction = "good_investment"
        recommendation_level = "recommend_investment"
    elif good_probability >= 0.45:
        prediction = "needs_review"
        recommendation_level = "needs_review"
    else:
        prediction = "risky_investment"
        recommendation_level = "not_recommended"

    return {
        "platform": platform_normalized,
        "genre": genre_normalized,
        "publisher": publisher_normalized,
        "publisher_grouped": publisher_grouped,
        "year": int(year_normalized),
        "good_investment_probability": round(good_probability, 4),
        "threshold": threshold,
        "prediction": prediction,
        "recommendation_level": recommendation_level
    }


def recommend_games(platform: str, genre: str, publisher: str, year: int, top_n: int = 5):
    """Recommend similar games with automatic normalization and fallback"""
    
    # Normalize inputs to safe values
    platform_normalized = normalize_platform(platform)
    genre_normalized = normalize_genre(genre)
    publisher_normalized = normalize_publisher(publisher)
    year_normalized = normalize_year(year)
    publisher_grouped = publisher_normalized

    input_df = pd.DataFrame([{
        "platform": platform_normalized,
        "genre": genre_normalized,
        "publisher_grouped": publisher_grouped,
        "year": int(year_normalized)
    }])

    input_processed = preprocessor.transform(input_df)

    distances, indices = nn_model.kneighbors(
        input_processed,
        n_neighbors=top_n + 1
    )

    recommendations = recommend_df.iloc[indices[0]].copy()
    recommendations = recommendations.iloc[1:].copy()
    distances = distances[0][1:]

    recommendations["Distance"] = distances
    recommendations["Similarity"] = 1 / (1 + distances)

    regional_score = recommendations.get(
        "regional_diversity",
        pd.Series(0, index=recommendations.index)
    ).fillna(0)

    recommendations["Final_Score"] = (
        recommendations["Similarity"] * 50 +
        np.clip(recommendations["global_sales"].fillna(0), 0, 10) * 3 +
        regional_score * 5
    )

    def generate_reason(row):
        reasons = []

        if row["genre"] == genre_normalized:
            reasons.append("Same genre")

        if row["platform"] == platform_normalized:
            reasons.append("Same platform")

        if row["publisher_grouped"] == publisher_grouped:
            reasons.append("Same publisher")

        if abs(row["year"] - int(year)) <= 2:
            reasons.append("Close release year")

        if row["global_sales"] >= 5:
            reasons.append("High global sales")

        if row.get("regional_diversity", 0) >= 1:
            reasons.append("Strong regional diversity")

        return ", ".join(reasons) if reasons else "Similar game profile"

    recommendations["Why_Recommended"] = recommendations.apply(
        generate_reason,
        axis=1
    )

    result_cols = [
        "name",
        "platform",
        "genre",
        "publisher_grouped",
        "year",
        "global_sales",
        "Similarity",
        "Final_Score",
        "Why_Recommended"
    ]

    return (
        recommendations
        .sort_values(by="Final_Score", ascending=False)
        .head(top_n)[result_cols]
        .to_dict(orient="records")
    )