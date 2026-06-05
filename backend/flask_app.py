from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from pathlib import Path
import json
import pandas as pd

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "app"))

from model_service import predict_investment, recommend_games

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"

# Load model metadata (contains model configuration - DO NOT MODIFY)
with open(MODEL_DIR / "model_metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

# Load dataset options (contains UI options extracted from dataset)
with open(MODEL_DIR / "dataset_options.json", "r", encoding="utf-8") as f:
    dataset_options = json.load(f)

# Load games dataset for search
try:
    games_df = pd.read_csv(DATA_DIR / "vgsales.csv")
except Exception as e:
    print(f"Warning: Could not load games dataset: {e}")
    games_df = None


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "GameVestAI Backend"})


@app.route("/api/metadata", methods=["GET"])
def get_metadata():
    """
    Get UI metadata for dropdowns and form options
    Uses dataset_options.json for searchable dropdowns
    """
    return jsonify({
        "platforms": dataset_options.get("platforms", []),
        "genres": dataset_options.get("genres", []),
        "publishers": dataset_options.get("publishers", []),
        "years": dataset_options.get("years", []),
        "investment_threshold": metadata.get("investment_threshold", 0.6),
        "supported_publishers": metadata.get("top_publishers", [])
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Predict investment opportunity for a game
    
    Expected JSON:
    {
        "platform": "PS4",
        "genre": "Action",
        "publisher": "Electronic Arts",
        "year": 2023
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["platform", "genre", "publisher", "year"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Call prediction function
        result = predict_investment(
            platform=data["platform"],
            genre=data["genre"],
            publisher=data["publisher"],
            year=int(data["year"])
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/recommend", methods=["POST"])
def recommend():
    """
    Get game recommendations based on parameters
    
    Expected JSON:
    {
        "platform": "PS4",
        "genre": "Action",
        "publisher": "Electronic Arts",
        "year": 2023,
        "top_n": 5
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["platform", "genre", "publisher", "year"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        top_n = data.get("top_n", 5)
        
        # Call recommendation function
        recommendations = recommend_games(
            platform=data["platform"],
            genre=data["genre"],
            publisher=data["publisher"],
            year=int(data["year"]),
            top_n=int(top_n)
        )
        
        return jsonify({
            "recommendations": recommendations
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Comprehensive analysis: prediction + recommendations
    
    Expected JSON:
    {
        "platform": "PS4",
        "genre": "Action",
        "publisher": "Electronic Arts",
        "year": 2023,
        "top_n": 5
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["platform", "genre", "publisher", "year"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        top_n = data.get("top_n", 5)
        
        # Get prediction
        prediction = predict_investment(
            platform=data["platform"],
            genre=data["genre"],
            publisher=data["publisher"],
            year=int(data["year"])
        )
        
        # Get recommendations
        recommendations = recommend_games(
            platform=data["platform"],
            genre=data["genre"],
            publisher=data["publisher"],
            year=int(data["year"]),
            top_n=int(top_n)
        )
        
        return jsonify({
            "prediction": prediction,
            "recommendations": recommendations,
            "metadata": {
                "genres": metadata.get("genres", []),
                "platforms": metadata.get("platforms", []),
                "publishers": metadata.get("top_publishers", [])
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/search", methods=["GET"])
def search():
    """
    Search for games by name
    
    Query parameters:
    - q: Game name (required)
    """
    try:
        query = request.args.get("q", "").strip()
        
        if not query or games_df is None:
            return jsonify({
                "error": "Invalid query or games database not available"
            }), 400
        
        # Case-insensitive search in game names
        matches = games_df[games_df["Name"].str.contains(query, case=False, na=False)]
        
        if matches.empty:
            return jsonify({
                "found": False,
                "message": f"No games found matching '{query}'"
            }), 404
        
        # Get the most popular/first match
        game = matches.iloc[0]
        
        game_data = {
            "name": str(game["Name"]),
            "platform": str(game["Platform"]),
            "genre": str(game["Genre"]),
            "publisher": str(game["Publisher"]),
            "year": int(game["Year"]),
            "global_sales": float(game["Global_Sales"]),
            "na_sales": float(game["NA_Sales"]),
            "eu_sales": float(game["EU_Sales"]),
            "jp_sales": float(game["JP_Sales"]),
            "other_sales": float(game["Other_Sales"])
        }
        
        # Get prediction and recommendations for this game
        prediction = predict_investment(
            platform=game_data["platform"],
            genre=game_data["genre"],
            publisher=game_data["publisher"],
            year=game_data["year"]
        )
        
        recommendations = recommend_games(
            platform=game_data["platform"],
            genre=game_data["genre"],
            publisher=game_data["publisher"],
            year=game_data["year"],
            top_n=5
        )
        
        return jsonify({
            "found": True,
            "game": game_data,
            "prediction": prediction,
            "recommendations": recommendations
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
