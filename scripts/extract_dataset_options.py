#!/usr/bin/env python3
"""
Extract unique values from dataset to create dataset_options.json
This script reads vgsales.csv and extracts unique platforms, genres, publishers, and years.
"""

import pandas as pd
import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

def extract_dataset_options():
    """Extract unique values from vgsales.csv"""
    
    # Read the CSV
    df = pd.read_csv(DATA_DIR / "vgsales.csv")
    
    print(f"✓ Dataset yüklendi: {len(df)} satır")
    print(f"Sütunlar: {df.columns.tolist()}")
    
    # Extract unique values (remove NaN values)
    platforms = sorted(df['Platform'].dropna().unique().tolist())
    genres = sorted(df['Genre'].dropna().unique().tolist())
    publishers = sorted(df['Publisher'].dropna().unique().tolist())
    years = sorted(df['Year'].dropna().unique().astype(int).tolist())
    
    # Create options structure
    dataset_options = {
        "platforms": platforms,
        "genres": genres,
        "publishers": publishers,
        "years": years,
        "metadata": {
            "source": "vgsales.csv",
            "platform_count": len(platforms),
            "genre_count": len(genres),
            "publisher_count": len(publishers),
            "year_range": [min(years), max(years)] if years else [None, None]
        }
    }
    
    # Save to models/dataset_options.json
    output_path = MODELS_DIR / "dataset_options.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dataset_options, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ dataset_options.json oluşturuldu: {output_path}")
    print(f"\n📊 Extracted Statistics:")
    print(f"  - Platformlar: {len(platforms)}")
    print(f"  - Türler: {len(genres)}")
    print(f"  - Yayıncılar: {len(publishers)}")
    print(f"  - Yıllar: {len(years)} ({min(years)}-{max(years)})")
    
    return dataset_options

if __name__ == "__main__":
    extract_dataset_options()
