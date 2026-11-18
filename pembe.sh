#!/bin/sh
# Pembe tema: altın / amber tonlarını #ff69ab · #fe4f8a · #e096a7 ile değiştirir.
# Site klasöründe çalıştır:  sh pembe.sh   (ilk çalıştırmada yedek_pembe/ klasörüne yedek alır; tekrar çalıştırmak zararsız)
for f in style.css extra.css app.js fx.js finale.js; do
  if [ ! -f "$f" ]; then echo "yok, atlandı: $f"; continue; fi
  mkdir -p yedek_pembe
  [ -f "yedek_pembe/$f" ] || cp "$f" "yedek_pembe/$f"
  sed -i -E \
    -e 's/#c9a96a/#ff69ab/gI' \
    -e 's/#e0a458/#fe4f8a/gI' \
    -e 's/#ffd27a/#ff69ab/gI' \
    -e 's/#ffb458/#ff69ab/gI' \
    -e 's/#ffb86a/#ff69ab/gI' \
    -e 's/#ffe2a8/#e096a7/gI' \
    -e 's/#ffd9a0/#e096a7/gI' \
    -e 's/#b98b8b/#e096a7/gI' \
    -e 's/rgba\(224, ?164, ?88/rgba(254,79,138/g' \
    "$f"
  echo "pembe yapıldı: $f"
done
echo "Bitti. Geri almak için: cp yedek_pembe/* ."
