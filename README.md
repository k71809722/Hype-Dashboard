# Hype Dashboard 🎮

**Versiyon:** 2.1.0

Hype'ın Kick yayınlarını takip edin, YouTube videolarını, VOD'ları ve en popüler klipleri tek bir yerden görüntüleyin!

---

## ✨ Özellikler

### 📡 Canlı Yayın Takibi
- **Anlık Durum Kontrolü** - Hype'ın Kick'te canlı olup olmadığını anında görün
- **Masaüstü Bildirimleri** - Yayın başladığında otomatik bildirim alın
- **Canlı İstatistikler** - İzleyici sayısı ve oyun kategorisini görüntüleyin
- **Badge Göstergesi** - Tarayıcı simgesinde canlı durum göstergesi

### 🔔 Gelişmiş Bildirimler ⭐ YENİ (v2.1.0)
Bildirimlerinizi tam olarak istediğiniz gibi özelleştirin:
- **Kategori Değişim Bildirimi:** Yayın sırasında oyun/kategori değiştiğinde anında bildirim alın (Örn: Just Chatting -> GTA V).
- **Akıllı Kategori Filtresi:** Sadece belirlediğiniz oyun oynandığında bildirim alın! (Örn: Sadece "Valorant" yazarsanız, diğer yayınlarda rahatsız edilmezsiniz).
- **Sessiz Saatler:** Belirlediğiniz saatlerde bildirimleri otomatik susturun.

### 🎬 İçerik Akışları

#### YouTube Videoları
- Son 3 YouTube videosunu görüntüleyin
- Shorts otomatik filtrelenir
- Doğrudan izlemeye başlayın

#### Kick VOD'ları
- En son 3 Kick yayın kaydını izleyin
- Tarih ve küçük resim bilgileri
- Tek tıkla VOD'a erişim

#### Kick Klipleri
- **Zaman Filtreleri:** 1 Gün, 7 Gün, 30 Gün
- **En Çok İzlenenler:** Otomatik sıralama
- **Akıllı Pagination:** Son 30 günün tüm klipleri
- **Canlı Güncelleme:** Her popup açılışında yeni klipler

### 🎓 Onboarding Ekranı
- **İlk Yükleme Tutorial:** Eklenti ilk yüklendiğinde açılır
- **Pin Talimatı:** Eklentiyi nasıl sabitleyeceğinizi gösterir
- **Özellik Tanıtımı:** Tüm özellikleri keşfedin

### ⚙️ Ayarlar Sayfası
- **Tema Seçimi:** Açık/Koyu tema
- **Varsayılan Sekme:** Eklenti açılışında gösterilecek sekme ayarı
- **Test Bildirimi:** Bildirim sistemini test etme özelliği

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
6. `hype_dashboard_v2.1.0` klasörünü seçin

### Brave / Opera
1. [Releases](https://github.com/k71809722/hype-dashboard/releases) sayfasından son sürümü indirin
2. ZIP dosyasını çıkartın
3. Tarayıcınızda eklentiler sayfasına gidin
4. **Geliştirici modu** aktif edin
5. **"Paketlenmemiş eklenti yükle"** seçeneğini kullanın
6. `hype_dashboard_v2.1.0` klasörünü seçin


## 🔧 Teknik Detaylar

### API'ler
- **Kick Live API:** `https://kick.com/api/v1/channels/hype`
- **Kick VODs API:** `https://kick.com/api/v2/channels/hype/videos`
- **Kick Clips API:** `https://kick.com/api/v2/channels/hype/clips`
- **YouTube RSS Feed:** Channel-based RSS

### Dosya Yapısı
```
hype_dashboard_v2.1.0/
├── manifest.json          # Eklenti yapılandırması
├── popup.html            # Ana arayüz
...
├── settings.html         # Ayarlar sayfası
├── settings.js           # Ayarlar mantığı
├── background.js         # Arka plan işlemleri (Notification Logic Updated)
...
└── README.md            # Bu dosya
```

---

## 📊 Versiyon Geçmişi

### v2.1.0 (07.12.2025)
**Gelişmiş Bildirim Özellikleri:**
- ✅ **Kategori Değişimi:** Yayın sırasında oyun değişirse bildirim gönderme.
- ✅ **Kategori Filtreleme:** Sadece seçilen oyunda bildirim alma özelliği.
- ✅ Ayarlar menüsü güncellendi.

### v2.0.0 (06.12.2025)
- ✅ Ayarlar Sayfası, Tema Desteği, Sessiz Saatler.

### v1.2.0 (06.12.2025)
- ✅ Onboarding Ekranı.

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
