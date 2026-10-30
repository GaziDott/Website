# Gazi DOTT SEO Denetimi

**Tarih:** 18 Temmuz 2026
**Kapsam:** `https://gazidott.org/` ve beş genel sayfa
**Sağlık skoru:** **51,2/100 (D)**, 34 kanıta dayalı kontrol

> Bu puan teknik önceliklendirme içindir; Google sıralama puanı değildir. Search Console ve CrUX alan verisine erişim olmadığından index kapsamı, sorgular, backlinkler ve gerçek kullanıcı INP değeri doğrulanamadı.

## Yönetici Özeti

- Teknik temel iyi durumda: HTTPS/www yönlendirmeleri, robots, sitemap, canonical, 404 ve GitHub Pages yayını doğru; teknik kategori **75/100**.
- En zayıf alan içerik (**25/100**): 18 etkinliğin hiçbiri güncel değil, etkinliklerin kalıcı URL'leri yok ve bazı genel sayfalar ince içerikli.
- Mobil laboratuvar LCP'si iki ölçümde **5,47-5,92 sn**; uzak hero görseli 307 KB ve Tailwind CDN tarayıcıda derleme yapıyor.
- Navigasyon, footer ve etkinlikler ilk HTML'de bulunmuyor. JavaScript sonrası içerik geliyor; bu durum tarama/render gecikmesi ve Google dışı botlar için eksik keşif riski oluşturuyor.
- En hızlı kazanımlar: başlıkları genişletmek, sosyal paylaşım metaları eklemek ve hero görselini yerelleştirip optimize etmek.

## Skor Dağılımı

| Kategori | Skor | Ana neden |
|---|---:|---|
| Teknik | 75,0 | Temel tarama sinyalleri iyi; ilk HTML JavaScript'e bağımlı |
| Görseller | 66,7 | Etkinlik afşleri WebP; responsive kaynak ve kart alt metni eksik |
| On-page | 57,1 | H1/hiyerarşi iyi; başlık, ilk link grafiği ve sosyal meta zayıf |
| Schema | 50,0 | Organization/WebSite var; Event yok |
| AI/cevap motoru hazırlığı | 50,0 | Kurum net; etkinlik yanıtları ilk HTML'de değil |
| Performans | 41,7 | LCP, uzak hero ve runtime Tailwind |
| İçerik | 25,0 | Güncellik, kalıcı etkinlik sayfaları ve ince sayfalar |

## Sayfa Skorları

`seo_checker.py` ilk HTML'i analiz eder; JavaScript sonrası içerik ayrıca Chromium ile ölçüldü.

| Sayfa | Skor | İlk HTML kelime | Render kelime | Ana zayıflık |
|---|---:|---:|---:|---|
| Ana sayfa | 73 | 109 | 234 | Kısa metadata, yavaş hero |
| Etkinlikler | 65 | 14 | 1.166 | Temel içerik tamamen JavaScript ile geliyor |
| Game Jam'ler | 66 | 28 | 167 | İnce içerik, kalıcı jam URL'si yok |
| Hakkımızda | 69 | 82 | 148 | Placeholder ekip ve sınırlı güven sinyali |
| İletişim | 59 | 49 | 87 | Kısa metadata ve az bağlamsal iç link |

## Teknik SEO Bulguları

| Sorun | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---:|
| İlk HTML'de navigasyon ve etkinlik içeriği yok | Yüksek | Navbar/footer `js/common.js`, kartlar `js/events.js` tarafından ekleniyor; Events kaynak HTML'i 14 kelime ve 0 link | Navigasyonu doğrudan HTML'e koy; etkinlik özetlerini JSON'dan build sırasında statik üret | 1 |
| Admin için robots/noindex çakışı | Orta | `robots.txt` admin'i engelliyor, sayfada ayrıca `noindex` var; engellenen bot `noindex`i okuyamayabilir | Robots'taki admin yasağını kaldır, sayfadaki `noindex, nofollow`u koru | 3 |
| İngilizce sürümün URL ve dil sinyali yok | Orta | Dil localStorage ile değişiyor; URL aynı ve `<html lang="tr">` sabit | Sadece Türkçe indeksle veya `/en/` + hreflang kur; geçişte `html.lang` değiştir | 3 |

### Doğrulanan Olumlu Sinyaller

- `http://gazidott.org/` ve `https://www.gazidott.org/` tek `301` ile `https://gazidott.org/` adresine gidiyor.
- Beş genel URL `200`, bilinmeyen URL `404` döndürüyor.
- `robots.txt` ve `sitemap.xml` canlıda `200`; sitemap beş canonical genel URL içeriyor.
- Tüm genel sayfalarda self-referencing canonical ve tek H1 var.
- `/index.html` ayrıca açılsa da canonical ana kök URL'yi gösteriyor.

## On-Page Bulguları

| Sorun | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---:|
| Başlıklar arama niyetini eksik kullanıyor | Yüksek | Beş title 20-43 karakter; araç hedef aralığı 50-60 | Gazi Üniversitesi, oyun geliştirme, Ankara ve sayfa konusunu doğru olduğu yerde ekle | 1 |
| İlk HTML iç link grafiği zayıf | Yüksek | Events, Game Jams ve About kaynak HTML'inde 0 link | Ana navigasyon ve temel bağlamsal linkleri statik HTML'e taşı | 1 |
| Meta açıklamaları kısa | Orta | Açıklamalar 54-111 karakter | Her sayfaya benzersiz, konu + hedef kitle + konum + eylem içeren yaklaşık 140-160 karakter yaz | 2 |
| Open Graph/Twitter Card yok | Orta | Genel sayfalarda `og:*` ve `twitter:*` etiketi bulunmuyor | `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card` ekle | 2 |
| Render edilen kart görselleri boş alt kullanıyor | Orta | Events'te render sonrası 19 görselin alt değeri boş; modal görseli açıklamalı | Afş bilgi taşıyorsa etkinlik başlığıyla kısa alt ver; salt dekoratif kopyalarda boş altı koru | 3 |

## İçerik Bulguları

| Sorun | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---:|
| Güncel etkinlik yok | Yüksek | 18 etkinliğin 0'ı 18 Temmuz 2026 sonrasında | Yeni etkinlikleri düzenli yayınla; boş dönemde geçmiş etkinlik çıktıları/fotoğraflarını görünür kıl | 1 |
| Kalıcı etkinlik URL'leri yok | Yüksek | Detaylar modalda açılıyor; paylaşılabilir/crawlable etkinlik adresi bulunmuyor | `events/<slug>.html` dosyalarını `events.json`dan statik üret; modal bu URL'ye de bağlansın | 1 |
| Genel sayfalar ince | Yüksek | Render sonrası About 148, Game Jams 167, Contact 87 kelime | Katılım, format, geçmiş, süreç, mekân ve beklenen çıktıları gerçek bilgilerle ekle | 2 |
| Ekip verisi placeholder | Orta | Üç kayıt `İsim Soyisim` | Gerçek ad, rol, dönem ve deneyim bilgisini yayınla veya bölümü geçici kaldır | 2 |
| Güven sayfaları eksik | Orta | Ayrı gizlilik ve davranış kuralları sayfası yok | Kısa, gerçek uygulamayı yansıtan gizlilik ve topluluk kuralları sayfaları ekle | 3 |

## Schema Bulguları

| Sorun | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---:|
| Event schema yok | Yüksek | 18 etkinlik var fakat hiç `Event` JSON-LD yok | Kalıcı etkinlik sayfalarına `name`, `startDate`, `location`, `image`, `description`, `organizer`, `eventStatus` ekle | 1 |
| Kurum schema mevcut | Olumlu | Ana sayfada Organization + WebSite JSON-LD, logo, e-posta ve sameAs var | Kalıcı kimlikleri koru; değişen sosyal URL'leri güncel tut | - |

## Performans Bulguları

| Sorun | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---:|
| Mobil LCP zayıf | Yüksek | Chromium 3G + 4x CPU: 5,47 ve 5,92 sn; iyi eşik <=2,5 sn | Hero ve CSS işini azalt; ardından Lighthouse ve gerçek alan verisiyle tekrar ölç | 1 |
| Uzak hero görseli ağır | Yüksek | Unsplash kaynak 307 KB ve 3,57 sn; ana LCP adayı | Görseli lisansı uygun yerel WebP/AVIF'e çevir, responsive varyant ve preload kullan | 1 |
| Tailwind production'da tarayıcıda derleniyor | Yüksek | Altı sayfa CDN scriptini yüklüyor; 7 uzun görev toplam yaklaşık 1,1 sn | Tailwind'i build-time derle/purge et; görsel regresyon testiyle statik minified CSS yayınla | 1 |
| CLS iyi | Olumlu | Mobil laboratuvar CLS 0,0034; iyi eşik <=0,1 | Sabit boyut/aspect-ratio kurallarını koru | - |
| Alan INP/LCP verisi yok | Bilinmiyor | Search Console/CrUX erişimi yok; PageSpeed API kota nedeniyle 429 verdi | Search Console Core Web Vitals raporunu izle; 28 günlük p75 veriyi kaydet | 3 |

## Anahtar Kelime Haritası

| Sayfa | Birincil hedef |
|---|---|
| Ana sayfa | Gazi Üniversitesi dijital oyun tasarımı topluluğu |
| Etkinlikler | Gazi DOTT oyun geliştirme etkinlikleri ve atölyeleri |
| Game Jam'ler | Ankara öğrenci game jam / Gazi DOTT game jam |
| Hakkımızda | Gazi DOTT hakkında ve topluluk faaliyetleri |
| İletişim | Gazi DOTT iletişim |

Mevcut beş sayfa arasında belirgin anahtar kelime yamyamlığı yok. Ana sayfa kurum kimliğine, About misyon ve ekibe, Events ise etkinlik niyetine odaklı kalmalı.

## Öncelikli Eylem Planı

1. **Kritik:** Indexlemeyi tamamen engelleyen kritik hata bulunmadı.
2. **Yüksek / performans:** Uzak hero görselini yerel responsive WebP/AVIF ile değiştir ve preload et.
3. **Yüksek / performans:** Tailwind CDN'i build-time statik CSS'e taşı; masaüstü/mobil görsel regresyonla yayınla.
4. **Yüksek / taranabilirlik:** Statik navigasyon ekle; `events.json`dan build sırasında etkinlik özetleri ve kalıcı detay sayfaları üret.
5. **Yüksek / schema:** Kalıcı detay sayfalarına Event JSON-LD ekle ve sitemap'e dahil et.
6. **Yüksek / içerik:** Yeni etkinlikleri yayınla; About, Game Jams ve Contact sayfalarını gerçek ve faydalı bilgilerle genişlet.
7. **Hızlı kazanım:** Beş title ve meta description'ı hedef sorgularla benzersiz biçimde geliştir.
8. **Hızlı kazanım:** Open Graph/Twitter Card etiketleri ve paylaşım görseli ekle.
9. **Orta:** Admin robots/noindex çakışını, dil sinyalini, ekip placeholder'larını ve güven sayfalarını düzelt.
10. **Ölçüm:** Search Console'a sitemap gönder; Coverage, sorgu, CTR ve 28 günlük p75 LCP/INP/CLS verisini takip et.

## Denetim Notları

- Yerel araçlar: `seo_checker.py`, `seo_health_scorer.py`.
- Canlı testler: HTTP yönlendirme/header kontrolleri ve Playwright Chromium render testi.
- Performans profili: 390x844 viewport, 1,6 Mbps indirme, 150 ms gecikme, 4x CPU yavaşlatma; laboratuvar sonucu alan Core Web Vitals yerine geçmez.
- Google PageSpeed API anahtarsız kota vermedi (`429 RESOURCE_EXHAUSTED`); bu nedenle PageSpeed puanı raporlanmadı.
