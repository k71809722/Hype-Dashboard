# Hype Dashboard 🎮

**Versiyon:** 1.1.0

Hype'ın Kick yayınlarını takip edin, YouTube videolarını, VOD'ları ve en popüler klipleri tek bir yerden görüntüleyin!

---

## ✨ Özellikler

### 📡 Canlı Yayın Takibi
- **Anlık Durum Kontrolü** - Hype'ın Kick'te canlı olup olmadığını anında görün
- **Masaüstü Bildirimleri** - Yayın başladığında otomatik bildirim alın
- **Canlı İstatistikler** - İzleyici sayısı ve oyun kategorisini görüntüleyin
- **Badge Göstergesi** - Tarayıcı simgesinde canlı durum göstergesi

### 🎬 İçerik Akışları

#### YouTube Videoları
- Son 3 YouTube videosunu görüntüleyin
- Shorts otomatik filtrelenir
- Doğrudan izlemeye başlayın

#### Kick VOD'ları
- En son 3 Kick yayın kaydını izleyin
- Tarih ve küçük resim bilgileri
- Tek tıkla VOD'a erişim

#### Kick Klipleri ⭐ YENİ
- **Zaman Filtreleri:** 1 Gün, 7 Gün, 30 Gün
- **En Çok İzlenenler:** Otomatik sıralama
- **Akıllı Pagination:** Son 30 günün tüm klipleri
- **Canlı Güncelleme:** Her popup açılışında yeni klipler

### 🔗 Sosyal Medya
- YouTube: @AyniSinemalar
- Instagram: @aynisinemalar
- Twitter/X: @aynisinemalar
- Kick: @hype

---

## 📦 Kurulum

### Chrome / Edge
1. [Releases](https://github.com/k71809722/hype-dashboard/releases) sayfasından son sürümü indirin
2. ZIP dosyasını çıkartın
3. Chrome/Edge'de `chrome://extensions` adresine gidin
4. Sağ üst köşeden **"Geliştirici modu"** aktif edin
5. **"Paketlenmemiş öğe yükle"** butonuna tıklayın
6. `hype_dashboard_v1.1.0` klasörünü seçin

### Brave / Opera
1. [Releases](https://github.com/k71809722/hype-dashboard/releases) sayfasından son sürümü indirin
2. ZIP dosyasını çıkartın
3. Tarayıcınızda eklentiler sayfasına gidin
4. **Geliştirici modu** aktif edin
5. **"Paketlenmemiş eklenti yükle"** seçeneğini kullanın
6. `hype_dashboard_v1.1.0` klasörünü seçin


## 🔧 Teknik Detaylar

### API'ler
- **Kick Live API:** `https://kick.com/api/v1/channels/hype`
- **Kick VODs API:** `https://kick.com/api/v2/channels/hype/videos`
- **Kick Clips API:** `https://kick.com/api/v2/channels/hype/clips`
- **YouTube RSS Feed:** Channel-based RSS

### Özellikler
- **Arka Plan İşlemleri:** Her 1 dakikada bir durum kontrolü
- **Bildirim Sistemi:** Chrome Notifications API
- **Akıllı Pagination:** 30 günlük klip limiti ile optimizasyon
- **Caching:** Performans için veri önbellekleme
- **Responsive Design:** Modern ve kullanıcı dostu arayüz

### Dosya Yapısı
```
hype_dashboard_v1.1.0/
├── manifest.json          # Eklenti yapılandırması
├── popup.html            # Ana arayüz
├── popup.css             # Stil dosyası
├── popup.js              # Arayüz mantığı
├── background.js         # Arka plan işlemleri
├── icons/                # Eklenti simgeleri
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # Bu dosya
```

---

## 📊 Versiyon Geçmişi

### v1.1.0 (06.12.2025)
**Yeni Özellikler:**
- ✅ Kick Klipleri özelliği eklendi
- ✅ Zaman filtreleri (1/7/30 gün)
- ✅ Akıllı pagination (30 günlük limit)
- ✅ Klip sıralaması optimize edildi
- ✅ Her popup açılışında otomatik yenileme

**İyileştirmeler:**
- ✅ API performansı optimize edildi
- ✅ Hata yönetimi iyileştirildi
- ✅ Console logging eklendi

### v1.0.0 (06.12.2025)
**İlk Sürüm:**
- ✅ Canlı yayın takibi
- ✅ YouTube video akışı
- ✅ Kick VOD akışı
- ✅ Bildirim sistemi
- ✅ Sosyal medya bağlantıları

---

## 🐛 Bilinen Sorunlar

Şu anda bilinen bir sorun bulunmamaktadır.

Sorun bildirmek için [Issues](https://github.com/k71809722/hype-dashboard/issues) sayfasını kullanın.

---

## 🤝 Katkıda Bulunma

Bu eklenti Hype topluluğu için geliştirilmiştir. Önerileriniz için issue açabilirsiniz.

---

## 📝 Lisans

Bu proje kişisel kullanım içindir.

---

## 📧 İletişim

https://x.com/anonimt95266682 dm veya Tweet yolu ile iletişim.

---

<div align="center">

**Not:** Bu eklenti resmi bir Hype ürünü değildir. Topluluk tarafından geliştirilmiştir.

Made with ❤️ for Hype Community

</div>
