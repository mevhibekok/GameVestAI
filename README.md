# 🎮 GameVestAI

> **Global oyun pazarını analiz eden ve yatırım kararlarını destekleyen yapay zeka destekli karar destek sistemi.**

---

## 📌 Proje Vizyonu

Oyun sektörü, dünya genelinde en hızlı büyüyen dijital endüstrilerden biri. Ancak bu büyüklük aynı zamanda karmaşık bir veri ortamı yaratıyor: binlerce oyun, farklı platformlar, değişen kullanıcı davranışları ve öngörülemeyen pazar dinamikleri.

**GameVestAI**, bu karmaşıklığı fırsata dönüştürmek için tasarlandı.

Projenin amacı; global oyun piyasasındaki tarihsel ve güncel verileri kullanarak oyun başarısını tahmin eden, pazar trendlerini analiz eden ve yatırımcılara / yayıncılara veri odaklı içgörüler sunan bir makine öğrenmesi sistemi geliştirmektir.

---

## 🎯 Temel Hedefler

* Oyun satış verilerinden **başarı tahmini** modelleri geliştirmek
* Platform, tür ve bölge bazlı **pazar segmentasyonu** yapmak
* Tüm bu analizleri interaktif bir **dashboard** arayüzünde sunmak

---

## 🧠 Kullanılan Teknolojiler

| Kategori         | Araçlar                |
| ---------------- | ---------------------- |
| Veri İşleme      | Python, Pandas, NumPy  |
| Makine Öğrenmesi | scikit-learn, CatBoost |
| Görselleştirme   | Matplotlib, Seaborn    |
| Frontend         | React, Vite            |
| Backend          | Flask                  |
| Ortam            | Jupyter Notebook       |

---

## 🚀 Kurulum

```bash
# Repoyu klonla
git clone https://github.com/mevhibekok/GameVestAI.git
cd GameVestAI

# Bağımlılıkları yükle
pip install -r requirements.txt
npm install
```

---

## ▶️ Projeyi Çalıştırma

GameVestAI iki ana bileşenden oluşmaktadır:

* **Frontend (Kullanıcı Arayüzü):** Modern web tabanlı dashboard arayüzü
* **Backend (API & Makine Öğrenmesi Servisi):** Veri işleme, model tahmini ve analiz işlemleri

Projeyi lokal ortamda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Frontend’i başlatın

```bash
npm run dev
```

Frontend uygulaması varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

---

### 2. Backend’i başlatın

```bash
python flask_app.py
```

Backend servisi varsayılan olarak `http://127.0.0.1:5000` adresinde aktif olacaktır.

---

### 3. Sistemi kullanın

Frontend ve backend aynı anda çalıştırıldığında:

* Dashboard üzerinden oyun verilerini analiz edebilirsiniz.
* Var olan oyunlar için başarı tahmini alabilirsiniz.
* Yeni çıkacak oyunlar için tür, platform, yayıncı ve hedef çıkış yılı bilgilerini girerek yatırım analizi oluşturabilirsiniz.

---

## 📊 Sistem Özellikleri

* Geçmiş satış verileri üzerinden oyun performans analizi
* Tür, platform ve bölge bazlı trend analizi
* Yeni oyun konseptleri için yatırım potansiyeli tahmini
* Veri görselleştirme destekli interaktif dashboard
* Yapay zeka destekli karar destek mekanizması

---

## 📈 Kullanım Senaryoları

GameVestAI iki farklı analiz modunda çalışmaktadır:

### 1. Mevcut Oyun Analizi

Halihazırda piyasada bulunan oyunların verileri kullanılarak başarı, satış performansı ve pazar konumu analiz edilir.

### 2. Yeni Oyun Yatırım Simülasyonu

Henüz piyasaya çıkmamış bir oyun için tür, platform, yayıncı ve hedef çıkış yılı bilgileri modele girilerek potansiyel yatırım başarısı tahmin edilir.

Bu yapı sayesinde sistem yalnızca geçmişi analiz etmekle kalmaz, aynı zamanda geleceğe yönelik yatırım kararlarını da destekler.


