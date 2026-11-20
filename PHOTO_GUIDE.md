# PHOTO_GUIDE — Fotoğrafları sonradan değiştirmek

Tüm fotoğraf yolları **`content.js`** içindedir; JavaScript'e dokunmana gerek yok.
Dosyaları `photos/` klasörüne koy ve ya aynı adlarla (`photo01.jpg` … `photo17.jpg`) değiştir ya da `content.js` içindeki yolları düzenle.
Dosya eksikse şık bir yer tutucu görünür (site bozulmaz).

| content.js alanı | Sahne | Şu an beklenen dosyalar | Not |
|---|---|---|---|
| `introPhotos` | 01 Prolog (açılış sayacında duvara bantlı kareler) | photo01 – photo09 | En fazla 9 |
| `memories` | 02 Anılar | photo01–05, photo13, 14, 15 | Sıra = dizideki sıra |
| `gallery` | 03 Küçük Anlar | photo06–11, photo16, 17 | Dokununca büyür; başlık (`caption`) isteğe bağlı |
| `glassPhotos` | 04 Bilmeni İstediklerim (mesaj başına 1 kare) | photo03 – photo07 | Mesaj sayısı kadar (5). Şeffaf PNG verirsen çerçevesiz süzülür |
| `reel` | 05 Akıp Giden Kareler (35 mm şerit) | photo01–17 döngüsü | Şerit başına en çok 40 kare çizilir |
| `montage` | 06 Karanlık Oda | photo06–17 döngüsü | Ekranda aynı anda 6 (dar ekran) ya da 8 kare; havuzdan yenilenir |
| `finale.photo` | 08 Final, dilek ekranı | photo12 | İsteğe bağlı; pastanın çevresine fotoğraf konmaz |

`reel` ve `montage` şu an `_dongu(...)` ile photo01–17'yi tekrarlıyor. Kendi karelerini eklerken bunları elle yaz:
`[{ src: "photos/ornek.jpg", caption: "" }, …]`.

**Bonus sayfa (`extras.html`)** `memories`, `gallery`, `reel` ve `montage` listelerinin hepsini tek havuz olarak kullanır; ayrıca dosya gerekmez.

Diğer dosyalar: müzik `audio/shape-of-my-heart.mp3` (yoksa `content.js → music.videoId`), bonus video `video.mp4` (H.264 + AAC).