# GameVestAI Backend API

Flask ile yazılan REST API. Python model servisini expose eder.

## Kurulum

```bash
# Virtual environment oluşturun
python -m venv venv

# Aktivasyon (Windows)
venv\Scripts\activate

# Aktivasyon (macOS/Linux)
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt
```

## Çalıştırma

```bash
python flask_app.py
```

API `http://localhost:5000` üzerinde çalışacaktır.

## Endpoints

### Health Check
```
GET /api/health
```

### Model Metadata
```
GET /api/metadata
```

Cevap:
```json
{
  "genres": [...],
  "platforms": [...],
  "publishers": [...],
  "investment_threshold": 0.5
}
```

### Tahmin Yap
```
POST /api/predict
```

Istek:
```json
{
  "platform": "PS4",
  "genre": "Action",
  "publisher": "Electronic Arts",
  "year": 2023
}
```

Cevap:
```json
{
  "platform": "PS4",
  "genre": "Action",
  "publisher": "Electronic Arts",
  "year": 2023,
  "good_investment_probability": 0.75,
  "threshold": 0.5,
  "prediction": "good_investment",
  "recommendation_level": "recommend_investment"
}
```

### Oyun Önerileri
```
POST /api/recommend
```

Istek:
```json
{
  "platform": "PS4",
  "genre": "Action",
  "publisher": "Electronic Arts",
  "year": 2023,
  "top_n": 5
}
```

### Kapsamlı Analiz
```
POST /api/analyze
```

Tüm bilgileri birlikte döner (tahmin + öneriler).

## CORS

CORS tüm domainler için etkindir. Production'da bunu kısıtlamanız gerekir.

```python
CORS(app, resources={r"/api/*": {"origins": ["https://example.com"]}})
```

## Ortam Değişkenleri

`.env` dosyası oluşturun:

```
FLASK_ENV=development
FLASK_DEBUG=True
API_PORT=5000
API_HOST=0.0.0.0
```

## Model Dosyaları

Modeller `../models/` klasöründe bulunur:
- `catboost_investment_model.cbm` - Yatırım tahmin modeli
- `knn_model.joblib` - KNN önerisi modeli
- `knn_preprocessor.joblib` - Veri ön işleme
- `recommend_df.joblib` - Öneriler için veri seti
- `model_metadata.json` - Model metadata
