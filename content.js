/* ============================================================
   İÇERİK DOSYASI — Sadece bu dosyayı düzenlemen yeterli.
   Fotoğraflar: dosyaları /photos klasörüne koy, adlarını aşağıya yaz.
   Dosya bulunamazsa otomatik olarak zarif bir yer tutucu görünür.
   ============================================================ */
/* Prototip fotoğraf havuzu: photo01–photo17 döngüyle tekrarlanır. Kendi fotoğraflarını eklerken reel / montage dizilerini
   elle yaz: [{ src: "photos/ornek.jpg", caption: "" }, …]. Yüzlerce kare olabilir; ekranda sınırlı sayıda çizilir. */
const _dongu = (n, uzun, kay) => Array.from({ length: uzun }, (_, i) => ({ src: 'photos/photo' + String((i + kay) % n + 1).padStart(2, '0') + '.jpg', caption: '' }));
window.CONTENT = {
  title: "YİNE Mİ DOĞUM GÜNÜ?",
  name: "HIRA",
  date: "23.11.2026",
  /* AÇILIŞ SAYACI: 23:52 → 00:00 arasında alttan yükselen bantlı fotoğraflar (en fazla 9; sonradan değiştir) */
  introPhotos: ["photos/photo01.jpg", "photos/photo02.jpg", "photos/photo03.jpg", "photos/photo04.jpg", "photos/photo05.jpg", "photos/photo06.jpg", "photos/photo07.jpg", "photos/photo08.jpg", "photos/photo09.jpg"],
  quote: "15 yıldır buradasın. Hâlâ kimse nedenini bilmiyor.",

  /* MÜZİK: Sting — Shape of My Heart (değiştirme).
     Önce yerel dosya denenir: audio/shape-of-my-heart.mp3 (kendi sahip olduğun MP3'ü bu isimle koy).
     Dosya yoksa YouTube yedeği kullanılır.
     Resmî videonun YouTube kimliğini (watch?v=XXXX içindeki XXXX) videoId'ye yapıştır.
     Boşsa buton, YouTube'da şarkıyı arayan bir bağlantı açar. */
  music: { localFile: "audio/shape-of-my-heart.mp3", videoId: "", searchQuery: "Sting Shape of My Heart official music video" },

    /* BÖLÜM 02 — Anılar (sıra = dizideki sıra) */
  memories: [
    { src: "photos/photo01.jpg", caption: "" },
    { src: "photos/photo02.jpg", caption: "" },
    { src: "photos/photo03.jpg", caption: "" },
    { src: "photos/photo04.jpg", caption: "" },
    { src: "photos/photo05.jpg", caption: "" },
    { src: "photos/photo13.jpg", caption: "" },
    { src: "photos/photo14.jpg", caption: "" },
    { src: "photos/photo15.jpg", caption: "" }
  ],

    /* BÖLÜM 03 — Polaroid galerisi */
  gallery: [
    { src: "photos/photo06.jpg", caption: "" },
    { src: "photos/photo07.jpg", caption: "" },
    { src: "photos/photo08.jpg", caption: "" },
    { src: "photos/photo09.jpg", caption: "" },
    { src: "photos/photo10.jpg", caption: "" },
    { src: "photos/photo11.jpg", caption: "" },
    { src: "photos/photo16.jpg", caption: "" },
    { src: "photos/photo17.jpg", caption: "" }
  ],

  /* BÖLÜM 04 — Mesaj kartları (more: karta dokununca açılan isteğe bağlı ek not) */
  messages: [
    { text: "Mesajlarıma üç gün sonra döndüğün için…", more: "Tebrikler, sabır antrenmanı oldu." },
    { text: "Dürtünce \"ne var?\" dediğin için…", more: "Cevap hâlâ aynı: hiçbir şey, seni darlıyorum." },
    { text: "Son pasta dilimini \"tadına bakıyorum\" diye bitirdiğin için…", more: "Tadına baktığın şey dört dilimdi." },
    { text: "Tek kelime etmeden göz devirebildiğin için…", more: "Yetenek olduğunu inkâr etmiyorum." },
    { text: "Her tartışmada \"ben haklıyım\" yüzü yaptığın için…", more: "Haklı olmak zorunda değilsin ama çok deniyorsun." }
  ],

  /* BÖLÜM 04 — Cam kareler: her mesaj için bir fotoğraf (mesaj sayısı kadar). Prototip: photo03–photo07.
     Arka planı şeffaf PNG kullanırsan (ör. "photos/hira-kesim.png") otomatik olarak kesim gibi, çerçevesiz süzülür. */
  glassPhotos: _dongu(17, 5, 2),

  /* BÖLÜM 04.5 — Akıp giden kareler: iki yönlü 35 mm film şeridi (şerit başına en fazla 40 kare çizilir) */
  reel: _dongu(17, 34, 0),
  /* BÖLÜM 04.6 — Karanlık oda masası: süzülen kareler; havuz büyükse aralıklarla yenileri gelir */
  montage: _dongu(17, 34, 5),

  /* SAHNE ARALARI: perdeler kapanırken ekranda beliren kısa film yazıları */
  intertitles: {
    start: "Kemerler bağlansın, felaket yaklaşıyor…",
    c4: "Dur, daha bitmedi…",
    c45: "Makara dönüyor, sabrım dönmüyor…",
    c46: "Karanlık oda: burada herkes kötü çıkar",
    c5: "Mektup geldi. Spoiler: duygusal değil.",
    c6: "Son perde. Pastaya yaklaşma, önce ben."
  },

  /* BÖLÜM 05 — Mektup (her öğe bir paragraf; kendi anılarınla kişiselleştirebilirsin) */
  letter: {
    to: "Hira,",
    paragraphs: [
      "Bu mektuba üç kere oturdum. Üç kere de \"ya zaten biliyor, ne yazayım\" deyip kalktım. Dördüncüde pes ettim, işte buradasın.",
      "15 olmuşsun. Resmî olarak \"büyüdüm\" diyebilirsin. Kimse inanmaz ama diyebilirsin. Son pasta dilimini hâlâ \"tadına bakıyorum\" diyerek bitiren birinin yaşla ilişkisi zaten karışık.",
      "Mesaja üç gün sonra dönüyorsun, \"görüldü\" atıyorsun, dürtünce \"ne var?\" diyorsun. Sana ulaşmak, çekmeyen yerde sinyal aramak gibi. Yine de vazgeçmiyorum, çünkü inatçıyım. (Ve boşum.)",
      "Dilek tutarken \"daha çok pasta\" deme. Yetmedi mi? Bu yaşta insan biraz sebze düşünür. Sebzeyi ben yerim, pastayı sen yersin, iş bölümü tamam.",
      "Hediye yerine bu siteyi yaptım. Kaç saat harcadığımı sorma, söylemeyeceğim. Sadece bil ki bu site senin \"eline sağlık\" demen için yapıldı. Bekliyorum. Kahveyi de sen ısmarlıyorsun."
    ],
    sign: "Sabrını tüketen arkadaşın"
  },

  /* BÖLÜM 06 — Final */
  finale: {
    photo: { src: "photos/photo12.jpg", caption: "" },
    line1: "Doğdun. Tebrikler, kimse sormadı ama oldu.",
    line2: "Pastayı bitirme, bana da bırak."
  }
};
