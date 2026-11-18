#!/bin/sh
# Gece laciverti + pembe tema düzeltmesi. Site klasöründe çalıştır:  sh tema.sh   (önce pembe.sh çalışmış olmalı)
# Yedek: yedek_tema/ — geri almak için:  cp yedek_tema/* .
mkdir -p yedek_tema
for f in style.css extra.css shitpost.css shitpost2.css app.js fx.js finale.js extra.js index.html; do
  if [ ! -f "$f" ]; then echo "yok, atlandı: $f"; continue; fi
  [ -f "yedek_tema/$f" ] || cp "$f" "yedek_tema/$f"
  sed -i -E \
    -e 's/#0b1426/#0a0f2c/gI' -e 's/#14233f/#131a46/gI' -e 's/#0e1a30/#0c1236/gI' -e 's/#0b1224/#0a0e26/gI' \
    -e 's/#04070d/#05061a/gI' -e 's/#02050b/#02030f/gI' -e 's/#02040a/#02030c/gI' -e 's/#05080f/#060818/gI' -e 's/#060b16/#060818/gI' -e 's/#1a1030/#101638/gI' \
    -e 's/#5a78c4/#e096a7/gI' -e 's/#8fb0ff/#ff69ab/gI' -e 's/#bcd0ff/#e096a7/gI' -e 's/#243a63/#2a2f6e/gI' \
    -e 's/#e08a7a/#fe4f8a/gI' -e 's/#ffcf8a/#ff69ab/gI' -e 's/#ffd08a/#ff69ab/gI' -e 's/#ff9a5a/#fe4f8a/gI' -e 's/#ff7a4a/#fe4f8a/gI' \
    -e 's/#cdbfa5/#f0c9d4/gI' -e 's/#f4ecdc/#fdf0f5/gI' -e 's/#7dffa6/#ffd0e2/gI' -e 's/#fff6e0/#ffe6f0/gI' \
    -e 's/#2a2536/#2a1220/gI' -e 's/#d9c79c/#e096a7/gI' -e 's/#ffd63a/#fe4f8a/gI' -e 's/#46a0ff/#ff69ab/gI' -e 's/#3cc86e/#e096a7/gI' -e 's/#ff8028/#ff69ab/gI' \
    "$f"
  echo "düzeltildi: $f"
done
echo "Bitti. index.html'de tema.css'in EN SON stil dosyası olarak yüklendiğinden emin ol."
