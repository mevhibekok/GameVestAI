# GameVestAI Frontend

React + Vite ile yazılan responsive arayüz. Tailwind CSS ile stillendirilmiş.

## Özellikler

- 📱 **Responsive Design** - Mobil, tablet, desktop uyumlu
- ⚡ **Vite** - Ultra hızlı geliştirme ortamı
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔗 **API Integration** - Flask backend ile bağlantılı
- 📊 **Real-time Analysis** - Anlık oyun analizi

## Kurulum

```bash
# Node.js ve npm gereklidir (Node 16+)

# Bağımlılıkları yükleyin
npm install
```

## Geliştirme

```bash
# Development sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` üzerinde açılacaktır.

## Build

```bash
# Production build
npm run build

# Build sonucunu preview et
npm run preview
```

## Proje Yapısı

```
src/
├── components/
│   ├── Header.jsx           # Üst başlık
│   ├── SearchForm.jsx       # Arama formu
│   ├── PredictionResult.jsx # Tahmin sonuçları
│   ├── RecommendationsList.jsx # Oyun önerileri
│   ├── LoadingSpinner.jsx   # Yüklenme göstergesi
│   └── ErrorMessage.jsx     # Hata mesajları
├── pages/
│   └── HomePage.jsx         # Ana sayfa
├── api/
│   └── gameAPI.js          # API istemcisi
├── App.jsx                  # Ana App bileşeni
├── main.jsx                 # Entry point
└── index.css               # Global stiller
```

## Ortam Değişkenleri

`.env.local` dosyası oluşturun:

```
VITE_API_URL=http://localhost:5000/api
```

## Responsive Tasarım

- **Mobil (< 640px)**: Tek sütun layout
- **Tablet (640px - 1024px)**: İki sütun layout
- **Desktop (> 1024px)**: Üç sütun layout

## Tailwind CSS Özelleştirmesi

`tailwind.config.js` dosyasında renk ve stil değişiklikleri yapabilirsiniz:

```javascript
{
  primary: '#3B82F6',      // Ana mavi renk
  secondary: '#10B981',    // Yeşil vurgu
}
```

## API Endpoints

Frontend aşağıdaki API endpoints'ini kullanır:

- `GET /api/health` - Sunucu durumu
- `GET /api/metadata` - Platform, türü, yayıncı listesi
- `POST /api/predict` - Tahmin yap
- `POST /api/recommend` - Oyun önerileri
- `POST /api/analyze` - Kapsamlı analiz

## Performans

- Lazy loading bileşenleri
- Optimized bundle size (~150KB gzip)
- Fast Refresh etkindir

## Browser Desteği

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Sorun Giderme

### API bağlantı hatası
Backend'in `http://localhost:5000` üzerinde çalıştığını kontrol edin.

### Tailwind stilleri yüklenmedi
```bash
npm install
npm run dev
```

### Port 3000 zaten kullanımda
`vite.config.js` dosyasında port değiştirin veya:
```bash
npx vite --port 3001
```
