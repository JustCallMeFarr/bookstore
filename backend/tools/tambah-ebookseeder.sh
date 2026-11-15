#!/bin/bash
# Menambahkan pemanggilan EbookSeeder ke DatabaseSeeder (aman dijalankan berulang)
f="$(dirname "$0")/../database/seeders/DatabaseSeeder.php"
if grep -q "EbookSeeder" "$f"; then
  echo "Sudah ada, tidak diubah"
  exit 0
fi
cp "$f" "$f.bak"
head -n -2 "$f.bak" > "$f"
printf '\n        $this->call(EbookSeeder::class);\n    }\n}\n' >> "$f"
echo "OK, baris ditambahkan (cadangan: DatabaseSeeder.php.bak)"
php -l "$f"
