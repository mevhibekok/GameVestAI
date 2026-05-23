from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from catboost import CatBoostClassifier


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

with open(MODEL_DIR / "model_metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

investment_model = CatBoostClassifier()
investment_model.load_model(str(MODEL_DIR / "catboost_investment_model.cbm"))

preprocessor = joblib.load(MODEL_DIR / "knn_preprocessor.joblib")
nn_model = joblib.load(MODEL_DIR / "knn_model.joblib")
recommend_df = joblib.load(MODEL_DIR / "recommend_df.joblib")


def normalize_publisher(publisher: str) -> str:
    top_publishers = metadata["top_publishers"]

    if publisher in top_publishers:
        return publisher

    return "Other"


def predict_investment(platform: str, genre: str, publisher: str, year: int):
    publisher_grouped = normalize_publisher(publisher)

    input_df = pd.DataFrame([{
        "platform": platform,
        "year": int(year),
        "genre": genre,
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
        "platform": platform,
        "genre": genre,
        "publisher": publisher,
        "publisher_grouped": publisher_grouped,
        "year": int(year),
        "good_investment_probability": round(good_probability, 4),
        "threshold": threshold,
        "prediction": prediction,
        "recommendation_level": recommendation_level
    }


def recommend_games(platform: str, genre: str, publisher: str, year: int, top_n: int = 5):
    publisher_grouped = normalize_publisher(publisher)

    input_df = pd.DataFrame([{
        "platform": platform,
        "genre": genre,
        "publisher_grouped": publisher_grouped,
        "year": int(year)
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

        if row["genre"] == genre:
            reasons.append("Same genre")

        if row["platform"] == platform:
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