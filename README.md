# 🎮 GameVestAI

> **Global oyun pazarını analiz eden ve yatırım kararlarını destekleyen yapay zeka destekli karar destek sistemi.**

---

## 📌 Proje Vizyonu

Oyun sektörü, dünya genelinde en hızlı büyüyen dijital endüstrilerden biri. Ancak bu büyüklük aynı zamanda karmaşık bir veri ortamı yaratıyor: binlerce oyun, farklı platformlar, değişen kullanıcı davranışları ve öngörülemeyen pazar dinamikleri.

**GameVestAI**, bu karmaşıklığı fırsata dönüştürmek için tasarlandı.

Projenin amacı; global oyun piyasasındaki tarihsel ve güncel verileri kullanarak oyun başarısını tahmin eden, pazar trendlerini analiz eden ve yatırımcılara / yayıncılara veri odaklı içgörüler sunan bir makine öğrenmesi sistemi geliştirmektir.

---

## 🎯 Temel Hedefler

- Oyun satış verilerinden **başarı tahmini** modelleri geliştirmek
- Platform, tür ve bölge bazlı **pazar segmentasyonu** yapmak
- Kullanıcı yorumları ve puanlamalardan **NLP ile duygu analizi** çıkarmak
- Tüm bu analizleri interaktif bir **dashboard** arayüzünde sunmak

---

## 🗂️ Proje Yapısı

```
GameVestAI/
├── app/            # Streamlit / web uygulama arayüzü
├── backend/        # API katmanı ve servis mantığı
├── data/           # Ham ve işlenmiş veri setleri
├── frontend/       # Kullanıcı arayüzü bileşenleri
├── models/         # Eğitilmiş ML modelleri (.pkl, .joblib)
├── notebooks/      # Keşifsel veri analizi ve model geliştirme
├── reports/        # Analiz çıktıları ve görselleştirmeler
├── scripts/        # Veri toplama ve ön işleme scriptleri
├── src/            # Yardımcı modüller ve utility fonksiyonları
├── requirements.txt
└── SETUP.md
```

---

## 🧠 Kullanılan Teknolojiler

| Kategori | Araçlar |
|---|---|
| Veri İşleme | Python, Pandas, NumPy |
| Makine Öğrenmesi | scikit-learn, XGBoost |
| Doğal Dil İşleme | NLTK, HuggingFace Transformers |
| Görselleştirme | Matplotlib, Seaborn, Plotly |
| Arayüz | Streamlit / JavaScript |
| Ortam | Jupyter Notebook |

---

## 🚀 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/mevhibekok/GameVestAI.git
cd GameVestAI

# Bağımlılıkları yükle
pip install -r requirements.txt
```

Detaylı kurulum adımları için [`SETUP.md`](./SETUP.md) dosyasına bakabilirsiniz.

---

## 📊 Veri Kaynakları

Proje; Steam, Metacritic ve çeşitli açık oyun veri API'leri üzerinden derlenen veri setlerini kullanmaktadır. Veri seti; oyun başlıkları, platform bilgileri, kullanıcı ve eleştirmen puanlamaları, satış rakamları ve tür etiketlerini kapsamaktadır.

---

## 🔮 Yol Haritası

- [x] Veri toplama ve ön işleme pipeline'ı
- [x] Keşifsel veri analizi (EDA)
- [x] Temel sınıflandırma ve regresyon modelleri
- [x] Model performans değerlendirmesi
- [ ] NLP tabanlı duygu analizi modülü
- [ ] Gerçek zamanlı tahmin API'si
- [ ] İnteraktif yatırım dashboard'u

---

## 👩‍💻 Geliştirici

**Mevhibe Kokoç**
Yazılım Mühendisliği Öğrencisi — Doğuş Üniversitesi

[![GitHub](https://img.shields.io/badge/GitHub-mevhibekok-181717?style=flat&logo=github)](https://github.com/mevhibekok)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profil-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/mevhibekok)

---

> *"Data is the new controller."*
