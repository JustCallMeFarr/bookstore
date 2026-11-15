<?php

namespace App\Support;

// Pembuat isi buku CONTOH (lorem ipsum) untuk demo fitur "Baca online".
// Isi berbeda tiap buku (berdasarkan id), tapi selalu sama untuk buku yang sama.
class DemoBook
{
    private const WORDS = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
        'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
        'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
        'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
        'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
        'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
        'mollit', 'anim', 'id', 'est', 'laborum', 'vitae', 'tellus', 'mauris', 'pretium', 'nibh',
        'ornare', 'cursus', 'sapien', 'ligula', 'viverra', 'eget', 'quam', 'luctus', 'faucibus',
    ];

    private const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

    public static function generate(int $id, string $title, string $author): string
    {
        // generator angka acak sederhana (tidak mengganggu fungsi acak lain di aplikasi)
        $seed = ($id * 7919 + 104729) & 0x7fffffff;
        $rand = function (int $min, int $max) use (&$seed): int {
            $seed = ($seed * 1103515245 + 12345) & 0x7fffffff;
            return $min + (($seed >> 8) % ($max - $min + 1));
        };

        $word = fn () => self::WORDS[$rand(0, count(self::WORDS) - 1)];

        $sentence = function (?string $mention = null) use ($rand, $word): string {
            $n = $rand(7, 16);
            $parts = [];
            for ($i = 0; $i < $n; $i++) {
                $parts[] = $word();
            }
            if ($mention) {
                array_splice($parts, $rand(1, 3), 0, [$mention]); // selipkan judul/nama
            }
            return ucfirst(implode(' ', $parts)) . '.';
        };

        $paragraph = function (?string $mention = null) use ($rand, $sentence): string {
            $count = $rand(3, 6);
            $out = [];
            for ($i = 0; $i < $count; $i++) {
                $out[] = $sentence($i === 0 ? $mention : null);
            }
            return implode(' ', $out);
        };

        $chapters = $rand(3, 5);
        $text = "# {$title}\n\n";
        $text .= "Karya {$author}\n\n";
        $text .= "Teks di bawah ini hanya isi contoh (lorem ipsum) untuk mendemokan fitur baca online. "
               . "Isi buku yang sebenarnya akan menggantikan teks ini.\n\n";

        for ($c = 0; $c < $chapters; $c++) {
            $chapterTitle = ucfirst($word() . ' ' . $word() . ' ' . $word());
            $text .= '## Bab ' . self::ROMAN[$c] . '. ' . $chapterTitle . "\n\n";

            $paras = $rand(4, 7);
            for ($p = 0; $p < $paras; $p++) {
                // paragraf pertama tiap bab menyebut judul / penulis
                $mention = $p === 0 ? ($c % 2 === 0 ? $title : $author) : null;
                $text .= $paragraph($mention) . "\n\n";
            }
        }

        return rtrim($text) . "\n";
    }
}
