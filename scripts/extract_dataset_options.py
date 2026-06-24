#!/usr/bin/env python3
"""
Extract unique values from all datasets to create dataset_options.json
Merges data from vgsales.csv, Video_Games.csv, and Video Games Sales (1980-2024) - Raw.csv
"""

import pandas as pd
import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

def extract_dataset_options():
    """Extract and merge unique values from all three datasets"""

    # --- 1) vgsales.csv ---
    df1 = pd.read_csv(DATA_DIR / "vgsales.csv")
    print(f"✓ vgsales.csv yüklendi: {len(df1)} satır")

    platforms1  = set(df1['Platform'].dropna().unique())
    genres1     = set(df1['Genre'].dropna().unique())
    publishers1 = set(df1['Publisher'].dropna().unique())
    years1      = set(df1['Year'].dropna().astype(int).unique())
    developers1 = set()
    ratings1    = set()

    # --- 2) Video_Games.csv ---
    df2 = pd.read_csv(DATA_DIR / "Video_Games.csv")
    print(f"✓ Video_Games.csv yüklendi: {len(df2)} satır")

    platforms2  = set(df2['Platform'].dropna().unique())
    genres2     = set(df2['Genre'].dropna().unique())
    publishers2 = set(df2['Publisher'].dropna().unique())
    years2      = set(df2['Year_of_Release'].dropna().astype(int).unique())
    developers2 = set(df2['Developer'].dropna().unique())
    ratings2    = set(df2['Rating'].dropna().unique())

    # --- 3) Video Games Sales (1980-2024) - Raw.csv ---
    df3 = pd.read_csv(DATA_DIR / "Video Games Sales (1980-2024) - Raw.csv")
    print(f"✓ Video Games Sales (1980-2024) - Raw.csv yüklendi: {len(df3)} satır")

    platforms3  = set(df3['console'].dropna().unique())
    genres3     = set(df3['genre'].dropna().unique())
    publishers3 = set(df3['publisher'].dropna().unique())
    developers3 = set(df3['developer'].dropna().unique())
    ratings3    = set()
    # Extract year from release_date (format: DD-MM-YYYY)
    years3 = set(
        pd.to_datetime(df3['release_date'].dropna(), format="%d-%m-%Y", errors="coerce")
        .dropna()
        .dt.year
        .astype(int)
        .unique()
    )

    # --- Merge all ---
    platforms  = sorted(str(v) for v in platforms1  | platforms2  | platforms3)
    genres     = sorted(str(v) for v in genres1     | genres2     | genres3)
    publishers = sorted(str(v) for v in publishers1 | publishers2 | publishers3)
    years      = sorted(int(v) for v in years1      | years2      | years3)
    developers = sorted(str(v) for v in developers1 | developers2 | developers3)
    ratings    = sorted(str(v) for v in ratings1    | ratings2    | ratings3)

    # Create options structure
    dataset_options = {
        "platforms": platforms,
        "genres": genres,
        "publishers": publishers,
        "years": years,
        "developers": developers,
        "ratings": ratings,
        "metadata": {
            "sources": ["vgsales.csv", "Video_Games.csv", "Video Games Sales (1980-2024) - Raw.csv"],
            "platform_count": len(platforms),
            "genre_count": len(genres),
            "publisher_count": len(publishers),
            "year_range": [min(years), max(years)] if years else [None, None],
            "developer_count": len(developers),
            "rating_count": len(ratings)
        }
    }

    # Save to models/dataset_options.json
    output_path = MODELS_DIR / "dataset_options.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dataset_options, f, indent=2, ensure_ascii=False)

    print(f"\n✓ dataset_options.json oluşturuldu: {output_path}")
    print(f"\n📊 Birleştirilmiş İstatistikler:")
    print(f"  - Platformlar:  {len(platforms)}")
    print(f"  - Türler:       {len(genres)}")
    print(f"  - Yayıncılar:   {len(publishers)}")
    print(f"  - Yıllar:       {len(years)} ({min(years)}-{max(years)})")
    print(f"  - Geliştiriciler: {len(developers)}")
    print(f"  - Yaş dereceleri: {len(ratings)}")

    return dataset_options

if __name__ == "__main__":
    extract_dataset_options()
