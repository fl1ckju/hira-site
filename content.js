/* ============================================================
   İÇERİK DOSYASI — Sadece bu dosyayı düzenlemen yeterli.
   Fotoğraflar: dosyaları /photos klasörüne koy, adlarını aşağıya yaz.
   Dosya bulunamazsa otomatik olarak zarif bir yer tutucu görünür.
   ============================================================ */
/* Prototip fotoğraf havuzu: photo01–photo17 döngüyle tekrarlanır. Kendi fotoğraflarını eklerken reel / montage dizilerini
   elle yaz: [{ src: "photos/ornek.jpg", caption: "" }, …]. Yüzlerce kare olabilir; ekranda sınırlı sayıda çizilir. */
const _dongu = (n, uzun, kay) => Array.from({ length: uzun }, (_, i) => ({ src: 'photos/photo' + String((i + kay) % n + 1).padStart(2, '0') + '.jpg', caption: '' }));
window.CONTENT = {
  title: "A STORY WORTH REMEMBERING",
  name: "HIRA",
  date: "23.11.2026",
  /* AÇILIŞ SAYACI: 23:52 → 00:00 arasında alttan yükselen bantlı fotoğraflar (en fazla 9; sonradan değiştir) */
  introPhotos: ["photos/photo01.jpg", "photos/photo02.jpg", "photos/photo03.jpg", "photos/photo04.jpg", "photos/photo05.jpg", "photos/photo06.jpg", "photos/photo07.jpg", "photos/photo08.jpg", "photos/photo09.jpg"],
  quote: "Bazı insanlar hayatımıza girer ve sıradan günleri bile unutulmaz kılar.",

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
    { text: "Yanında kendim olabildiğim için...", more: "Teşekkür ederim." },
    { text: "Beni yargılamadan dinlediğin için...", more: "Teşekkür ederim." },
    { text: "En sıradan anları bile güzelleştirdiğin için...", more: "Teşekkür ederim." },
    { text: "Bazen tek kelime söylemeden bile beni anlayabildiğin için...", more: "Teşekkür ederim." },
    { text: "Hayatıma kattığın bütün güzel anlar için...", more: "Teşekkür ederim." }
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
    start: "Işıklar kısılıyor…",
    c4: "Gece derinleşiyor…",
    c45: "Makara dönüyor…",
    c46: "Karanlık odada…",
    c5: "Bir mektup bırakıldı…",
    c6: "Son perde."
  },

  /* BÖLÜM 05 — Mektup (her öğe bir paragraf; kendi anılarınla kişiselleştirebilirsin) */
  letter: {
    to: "Sevgili Hira,",
    paragraphs: [
      "Seninle olunca kendimi toparlamak zorunda hissetmiyorum. Senin olduğun günler aklımda ayrı bir yerde duruyor. Doğum günün kutlu olsun, Hira."
    ],
    /* Eski uzun mektup (kendi metnini yazarken kullanabilirsin):
      "Bu mektuba kaç kere baştan başladım, saymadım. Sana söylemek istediklerim büyük cümlelere sığmıyor çünkü; küçük, gündelik şeyler bunlar.",
      "Seninle olunca kendimi toparlamak zorunda hissetmiyorum. Saçma bir şey söylesem de, hiç konuşmasam da, keyfim yokken de aynı rahatlıkla yanındayım. Bunun ne kadar nadir olduğunu zaman geçtikçe daha iyi anlıyorum.",
      "Bazen sen daha bir şey söylemeden ne düşündüğünü anlıyorum. Bazen de tam tersi oluyor: ben anlatamadığımda sen anlıyorsun. Bunun için teşekkür etmek bile az kalıyor ama yine de teşekkür ederim.",
      "Günlerin çoğu birbirine benziyor, biliyorsun. Ama senin olduğun günler aklımda ayrı bir yerde duruyor. Çoğu hatırlanacak kadar büyük şeyler değildi, yine de hepsini hatırlıyorum.",
      "On beş yaşına giriyorsun. Önünde daha çok yol var ve ben o yolun bir kısmında yanında olabildiğim için kendimi şanslı sayıyorum. Yorulursan, ki yorulacaksın, bana yaz ya da ara. Saat kaç olursa olsun.",
      "Bu siteyi sana bir şey vermek için değil, sana ne kadar önemli olduğunu bir yere yazıp orada bırakmak için yaptım. Açıp açıp tekrar bakabilesin diye.",
      "Doğum günün kutlu olsun, Hira. Bu yaş sana sakin, sıcak ve tam kendin gibi geçsin."
    */
    sign: "Hep yanında olan arkadaşın"
  },

  /* BÖLÜM 06 — Final */
  finale: {
    photo: { src: "photos/photo12.jpg", caption: "" },
    line1: "İyi ki doğdun Hira.",
    line2: "İyi ki yollarımız kesişmiş."
  }
};
