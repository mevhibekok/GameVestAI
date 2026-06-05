# GameVestAI - Kurulum Rehberi

React + Flask ile tam stack oyun yatırım analiz sistemi.

## Proje Yapısı

```
GameVestAI/
├── frontend/          # React + Vite arayüzü
├── backend/           # Flask REST API
├── app/               # Eski Streamlit uygulaması
├── models/            # Makine öğrenmesi modelleri
├── data/              # Veri dosyaları
└── notebooks/         # Jupyter notebookları
```

## Hızlı Başlangıç

### 1. Backend Kurulumu

```bash
cd backend

# Virtual environment oluşturun
python -m venv venv

# Aktivasyon (Windows)
venv\Scripts\activate

# Aktivasyon (macOS/Linux)
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Flask API'sini başlatın
python flask_app.py
```

Backend `http://localhost:5000` üzerinde çalışacaktır.

### 2. Frontend Kurulumu

Başka bir terminal açın:

```bash
cd frontend

# Node.js bağımlılıklarını yükleyin
npm install

# Development sunucusunu başlatın
npm run dev
```

Frontend `http://localhost:3000` üzerinde açılacaktır.

## Kullanım

1. Web tarayıcısında `http://localhost:3000` açın
2. Platform, oyun türü, yayıncı ve yılı seçin
3. "Analiz Et" butonuna tıklayın
4. Tahmin ve önerileri görüntüleyin

## API Endpoints

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/health` | GET | Sunucu durumu |
| `/api/metadata` | GET | Platform/Türü/Yayıncı listesi |
| `/api/predict` | POST | Yatırım tahminini yap |
| `/api/recommend` | POST | Oyun önerileri al |
| `/api/analyze` | POST | Kapsamlı analiz yap |

## Teknolojiler

### Frontend
- **React 18** - UI kütüphanesi
- **Vite** - Geliştirme sunucusu
- **Tailwind CSS** - Styling
- **Axios** - HTTP istemcisi

### Backend
- **Flask** - Web framework
- **CatBoost** - Tahmin modeli
- **scikit-learn** - Makine öğrenmesi
- **Pandas** - Veri işleme

## Features

✅ **Responsive Design** - Mobil, tablet, desktop uyumlu
✅ **Real-time Analysis** - Anlık oyun analizi
✅ **Game Recommendations** - Benzer oyun önerileri
✅ **Investment Prediction** - Yatırım potansiyeli tahmini
✅ **Modern UI** - Gradient, animasyonlar, smooth transitions

## Ortam Değişkenleri

### Backend (.env)
```
FLASK_ENV=development
FLASK_DEBUG=True
API_PORT=5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Production Deploy

### Backend (Gunicorn ile)
```bash
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 flask_app:app
```

### Frontend (Build)
```bash
npm run build
# dist/ klasöründeki dosyalar static serving için hazırdır
```

## Sorun Giderme

### Port Çakışması
```bash
# Windows'ta port 5000 kullanımı kontrol edin
netstat -ano | findstr :5000

# Port 3000 kontrol edin
netstat -ano | findstr :3000
```

### CORS Hatası
Backend'deki CORS ayarlarını kontrol edin (`flask_app.py`).

### Model Dosyaları Bulunamadı
`models/` klasöründe tüm dosyaların bulunduğundan emin olun:
- catboost_investment_model.cbm
- knn_model.joblib
- knn_preprocessor.joblib
- recommend_df.joblib
- model_metadata.json

## Dosyalar

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Model Metadata](./models/model_metadata.json)

## Lisans

MIT License

## Geliştirici

GameVestAI Team
