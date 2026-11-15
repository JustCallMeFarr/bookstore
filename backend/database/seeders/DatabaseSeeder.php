<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---------- Akun ----------
        User::updateOrCreate(['email' => 'admin@bookstore.test'], [
            'name' => 'Admin BookStore', 'password' => 'admin12345', 'role' => 'admin',
        ]);
        User::updateOrCreate(['email' => 'user@bookstore.test'], [
            'name' => 'User Demo', 'password' => 'user12345', 'role' => 'user',
        ]);

        // ---------- Genre + Buku contoh (karya domain publik) ----------
        $data = [
            'Fiksi Klasik' => [
                ['Pride and Prejudice', 'Jane Austen', 'Kisah Elizabeth Bennet yang cerdas dan keras kepala, serta Mr. Darcy yang angkuh, tentang cinta, kelas sosial, dan prasangka di Inggris abad ke-19.', 75000],
                ['Moby Dick', 'Herman Melville', 'Obsesi Kapten Ahab memburu paus putih raksasa yang pernah merenggut kakinya, dikisahkan oleh pelaut bernama Ishmael.', 82000],
                ['Metamorphosis', 'Franz Kafka', 'Suatu pagi Gregor Samsa terbangun dan mendapati dirinya berubah menjadi serangga raksasa. Kisah tentang keterasingan dan keluarga.', 55000],
            ],
            'Misteri' => [
                ['The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'Kumpulan kasus detektif Sherlock Holmes dan Dr. Watson di London, dipecahkan lewat pengamatan dan logika yang tajam.', 70000],
                ['The Hound of the Baskervilles', 'Arthur Conan Doyle', 'Legenda anjing hantu menghantui keluarga Baskerville di rawa Dartmoor. Holmes dipanggil untuk mengungkap kebenarannya.', 68000],
            ],
            'Horor & Gotik' => [
                ['Frankenstein', 'Mary Shelley', 'Victor Frankenstein menciptakan makhluk hidup dari bagian tubuh manusia, lalu lari dari tanggung jawabnya. Novel gotik tentang ambisi ilmu.', 72000],
                ['Dracula', 'Bram Stoker', 'Jonathan Harker mengunjungi puri misterius di Transylvania dan menemukan sang Count, vampir yang berniat pindah ke Inggris.', 78000],
            ],
            'Fantasi & Petualangan' => [
                ['Alice\'s Adventures in Wonderland', 'Lewis Carroll', 'Alice mengikuti kelinci putih masuk ke lubang dan tiba di dunia aneh penuh teka-teki, ratu galak, dan pesta teh gila.', 60000],
                ['Treasure Island', 'Robert Louis Stevenson', 'Jim Hawkins menemukan peta harta karun dan berlayar bersama bajak laut licik Long John Silver.', 65000],
            ],
            'Sains & Fiksi Ilmiah' => [
                ['The Time Machine', 'H. G. Wells', 'Seorang penemu melakukan perjalanan ke tahun 802.701 dan menemukan masa depan umat manusia yang terbelah dua.', 58000],
                ['The War of the Worlds', 'H. G. Wells', 'Makhluk dari Mars menyerbu Inggris dengan mesin perang raksasa, dan manusia nyaris tidak berdaya.', 62000],
            ],
            'Filsafat & Strategi' => [
                ['The Art of War', 'Sun Tzu', 'Risalah kuno tentang strategi, kepemimpinan, dan cara memenangkan pertempuran tanpa harus bertempur.', 50000],
                ['Meditations', 'Marcus Aurelius', 'Catatan pribadi seorang kaisar Romawi tentang disiplin diri, ketenangan batin, dan filsafat Stoa.', 54000],
                ['The Prince', 'Niccolo Machiavelli', 'Panduan kekuasaan yang blak-blakan tentang bagaimana seorang penguasa merebut dan mempertahankan kekuasaannya.', 52000],
            ],
            'Romansa & Keluarga' => [
                ['Emma', 'Jane Austen', 'Emma Woodhouse gemar menjodohkan orang lain, tetapi perlahan menyadari bahwa urusan hati tidak selalu berjalan sesuai rencananya.', 69000],
                ['Jane Eyre', 'Charlotte Bronte', 'Perjalanan Jane Eyre mencari kemandirian, kasih sayang, dan tempatnya di dunia setelah masa kecil yang sulit.', 76000],
                ['Wuthering Heights', 'Emily Bronte', 'Kisah hubungan penuh gejolak antara Catherine dan Heathcliff di kawasan Yorkshire yang liar.', 74000],
                ['Little Women', 'Louisa May Alcott', 'Empat saudari March tumbuh bersama, menghadapi perubahan hidup, cita-cita, dan arti keluarga.', 68000],
                ['The Scarlet Letter', 'Nathaniel Hawthorne', 'Hester Prynne menghadapi penilaian masyarakat Puritan setelah sebuah rahasia mengubah hidupnya.', 65000],
            ],
            'Petualangan' => [
                ['Robinson Crusoe', 'Daniel Defoe', 'Seorang pelaut terdampar di pulau terpencil dan berusaha membangun kehidupan dengan sumber daya yang ada.', 67000],
                ['Gullivers Travels', 'Jonathan Swift', 'Perjalanan Lemuel Gulliver membawanya ke negeri-negeri asing dengan masyarakat dan kebiasaan yang tak biasa.', 70000],
                ['Around the World in Eighty Days', 'Jules Verne', 'Phileas Fogg bertaruh bahwa ia dapat mengelilingi dunia dalam delapan puluh hari.', 72000],
                ['Twenty Thousand Leagues Under the Seas', 'Jules Verne', 'Petualangan bawah laut bersama Kapten Nemo dan kapal selam Nautilus.', 79000],
                ['The Call of the Wild', 'Jack London', 'Buck, seekor anjing peliharaan, menjalani kehidupan baru di alam liar Yukon.', 63000],
                ['White Fang', 'Jack London', 'Kisah seekor anjing-serigala yang belajar mengenal manusia dan lingkungannya di wilayah utara.', 64000],
            ],
            'Fantasi & Imajinasi' => [
                ['Peter Pan', 'J. M. Barrie', 'Wendy dan saudara-saudaranya mengikuti Peter Pan menuju Neverland, tempat petualangan masa kanak-kanak.', 61000],
                ['The Secret Garden', 'Frances Hodgson Burnett', 'Mary menemukan taman tersembunyi yang perlahan membawa perubahan bagi dirinya dan orang-orang di sekitarnya.', 66000],
                ['The Invisible Man', 'H. G. Wells', 'Seorang ilmuwan menemukan cara menjadi tak terlihat dan menghadapi akibat dari penemuannya.', 62000],
                ['The Island of Doctor Moreau', 'H. G. Wells', 'Seorang pelaut menemukan pulau terpencil tempat seorang ilmuwan melakukan eksperimen yang mengusik batas kemanusiaan.', 65000],
            ],
            'Klasik & Misteri' => [
                ['Great Expectations', 'Charles Dickens', 'Pip menerima kesempatan hidup baru dan berusaha memahami asal-usul harapan serta perubahan nasibnya.', 75000],
                ['Oliver Twist', 'Charles Dickens', 'Oliver tumbuh di tengah kerasnya kehidupan kota dan mencari tempat yang aman untuk dirinya.', 70000],
                ['A Tale of Two Cities', 'Charles Dickens', 'Kisah persahabatan, pengorbanan, dan perubahan sosial pada masa Revolusi Prancis.', 73000],
                ['The Picture of Dorian Gray', 'Oscar Wilde', 'Dorian Gray berharap tetap muda sementara sebuah potret menyimpan jejak pilihan hidupnya.', 71000],
                ['The Strange Case of Dr Jekyll and Mr Hyde', 'Robert Louis Stevenson', 'Sebuah misteri tentang dua sisi kepribadian yang terhubung melalui eksperimen seorang dokter.', 66000],
            ],
                    'Klasik Dunia' => [
                ['The Odyssey', 'Homer', 'Karya klasik Homer yang menghadirkan kisah The Odyssey, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62700],
                ['The Iliad', 'Homer', 'Karya klasik Homer yang menghadirkan kisah The Iliad, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 61300],
                ['The Aeneid', 'Virgil', 'Karya klasik Virgil yang menghadirkan kisah The Aeneid, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62000],
                ['The Divine Comedy', 'Dante Alighieri', 'Karya klasik Dante Alighieri yang menghadirkan kisah The Divine Comedy, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 66900],
                ['Don Quixote', 'Miguel de Cervantes', 'Karya klasik Miguel de Cervantes yang menghadirkan kisah Don Quixote, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62700],
                ['Gargantua and Pantagruel', 'Francois Rabelais', 'Karya klasik Francois Rabelais yang menghadirkan kisah Gargantua and Pantagruel, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 71800],
                ['The Decameron', 'Giovanni Boccaccio', 'Karya klasik Giovanni Boccaccio yang menghadirkan kisah The Decameron, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64100],
                ['The Canterbury Tales', 'Geoffrey Chaucer', 'Karya klasik Geoffrey Chaucer yang menghadirkan kisah The Canterbury Tales, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69000],
                ['The Pilgrim’s Progress', 'John Bunyan', 'Karya klasik John Bunyan yang menghadirkan kisah The Pilgrim’s Progress, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 70400],
                ['Paradise Lost', 'John Milton', 'Karya klasik John Milton yang menghadirkan kisah Paradise Lost, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64100],
                ['The Three Musketeers', 'Alexandre Dumas', 'Karya klasik Alexandre Dumas yang menghadirkan kisah The Three Musketeers, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69000],
            ],
            'Petualangan Klasik' => [
                ['The Count of Monte Cristo', 'Alexandre Dumas', 'Karya klasik Alexandre Dumas yang menghadirkan kisah The Count of Monte Cristo, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 72500],
                ['Twenty Years After', 'Alexandre Dumas', 'Karya klasik Alexandre Dumas yang menghadirkan kisah Twenty Years After, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 67600],
                ['The Last of the Mohicans', 'James Fenimore Cooper', 'Karya klasik James Fenimore Cooper yang menghadirkan kisah The Last of the Mohicans, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 71800],
                ['The Swiss Family Robinson', 'Johann David Wyss', 'Karya klasik Johann David Wyss yang menghadirkan kisah The Swiss Family Robinson, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 72500],
                ['Kidnapped', 'Robert Louis Stevenson', 'Karya klasik Robert Louis Stevenson yang menghadirkan kisah Kidnapped, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 61300],
                ['The Black Arrow', 'Robert Louis Stevenson', 'Karya klasik Robert Louis Stevenson yang menghadirkan kisah The Black Arrow, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 65500],
                ['The Coral Island', 'R. M. Ballantyne', 'Karya klasik R. M. Ballantyne yang menghadirkan kisah The Coral Island, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 66200],
                ['The Adventures of Tom Sawyer', 'Mark Twain', 'Karya klasik Mark Twain yang menghadirkan kisah The Adventures of Tom Sawyer, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 74600],
                ['Adventures of Huckleberry Finn', 'Mark Twain', 'Karya klasik Mark Twain yang menghadirkan kisah Adventures of Huckleberry Finn, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 76000],
                ['The Mysterious Island', 'Jules Verne', 'Karya klasik Jules Verne yang menghadirkan kisah The Mysterious Island, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69700],
                ['Journey to the Center of the Earth', 'Jules Verne', 'Karya klasik Jules Verne yang menghadirkan kisah Journey to the Center of the Earth, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 78800],
            ],
            'Misteri & Detektif' => [
                ['The Moonstone', 'Wilkie Collins', 'Karya klasik Wilkie Collins yang menghadirkan kisah The Moonstone, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64100],
                ['The Woman in White', 'Wilkie Collins', 'Karya klasik Wilkie Collins yang menghadirkan kisah The Woman in White, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 67600],
                ['The Murders in the Rue Morgue', 'Edgar Allan Poe', 'Karya klasik Edgar Allan Poe yang menghadirkan kisah The Murders in the Rue Morgue, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 75300],
                ['The Purloined Letter', 'Edgar Allan Poe', 'Karya klasik Edgar Allan Poe yang menghadirkan kisah The Purloined Letter, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69000],
                ['The Mystery of Marie Roget', 'Edgar Allan Poe', 'Karya klasik Edgar Allan Poe yang menghadirkan kisah The Mystery of Marie Roget, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 73200],
                ['The Sign of the Four', 'Arthur Conan Doyle', 'Karya klasik Arthur Conan Doyle yang menghadirkan kisah The Sign of the Four, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69000],
                ['A Study in Scarlet', 'Arthur Conan Doyle', 'Karya klasik Arthur Conan Doyle yang menghadirkan kisah A Study in Scarlet, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 67600],
                ['The Valley of Fear', 'Arthur Conan Doyle', 'Karya klasik Arthur Conan Doyle yang menghadirkan kisah The Valley of Fear, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 67600],
                ['The Secret Agent', 'Joseph Conrad', 'Karya klasik Joseph Conrad yang menghadirkan kisah The Secret Agent, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 66200],
                ['The Thirty-Nine Steps', 'John Buchan', 'Karya klasik John Buchan yang menghadirkan kisah The Thirty-Nine Steps, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69700],
                ['The Lodger', 'Marie Belloc Lowndes', 'Karya klasik Marie Belloc Lowndes yang menghadirkan kisah The Lodger, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62000],
            ],
            'Horor & Gotik' => [
                ['The Vampyre', 'John Polidori', 'Karya klasik John Polidori yang menghadirkan kisah The Vampyre, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62700],
                ['Carmilla', 'Sheridan Le Fanu', 'Karya klasik Sheridan Le Fanu yang menghadirkan kisah Carmilla, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 60600],
                ['The Fall of the House of Usher', 'Edgar Allan Poe', 'Karya klasik Edgar Allan Poe yang menghadirkan kisah The Fall of the House of Usher, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 76000],
                ['The Masque of the Red Death', 'Edgar Allan Poe', 'Karya klasik Edgar Allan Poe yang menghadirkan kisah The Masque of the Red Death, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 73900],
                ['The Castle of Otranto', 'Horace Walpole', 'Karya klasik Horace Walpole yang menghadirkan kisah The Castle of Otranto, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69700],
                ['The Monk', 'Matthew Lewis', 'Karya klasik Matthew Lewis yang menghadirkan kisah The Monk, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 60600],
                ['The Phantom of the Opera', 'Gaston Leroux', 'Karya klasik Gaston Leroux yang menghadirkan kisah The Phantom of the Opera, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 71800],
                ['The Beetle', 'Richard Marsh', 'Karya klasik Richard Marsh yang menghadirkan kisah The Beetle, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62000],
                ['The Turn of the Screw', 'Henry James', 'Karya klasik Henry James yang menghadirkan kisah The Turn of the Screw, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69700],
                ['The Willows', 'Algernon Blackwood', 'Karya klasik Algernon Blackwood yang menghadirkan kisah The Willows, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62700],
                ['The Great God Pan', 'Arthur Machen', 'Karya klasik Arthur Machen yang menghadirkan kisah The Great God Pan, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 66900],
            ],
            'Romansa & Drama' => [
                ['Sense and Sensibility', 'Jane Austen', 'Karya klasik Jane Austen yang menghadirkan kisah Sense and Sensibility, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69700],
                ['Persuasion', 'Jane Austen', 'Karya klasik Jane Austen yang menghadirkan kisah Persuasion, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 62000],
                ['Northanger Abbey', 'Jane Austen', 'Karya klasik Jane Austen yang menghadirkan kisah Northanger Abbey, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 66200],
                ['Far from the Madding Crowd', 'Thomas Hardy', 'Karya klasik Thomas Hardy yang menghadirkan kisah Far from the Madding Crowd, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 73200],
                ['Tess of the d’Urbervilles', 'Thomas Hardy', 'Karya klasik Thomas Hardy yang menghadirkan kisah Tess of the d’Urbervilles, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 72500],
                ['The Mayor of Casterbridge', 'Thomas Hardy', 'Karya klasik Thomas Hardy yang menghadirkan kisah The Mayor of Casterbridge, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 72500],
                ['Anna Karenina', 'Leo Tolstoy', 'Karya klasik Leo Tolstoy yang menghadirkan kisah Anna Karenina, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64100],
                ['War and Peace', 'Leo Tolstoy', 'Karya klasik Leo Tolstoy yang menghadirkan kisah War and Peace, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64100],
                ['The Brothers Karamazov', 'Fyodor Dostoevsky', 'Karya klasik Fyodor Dostoevsky yang menghadirkan kisah The Brothers Karamazov, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 70400],
                ['Crime and Punishment', 'Fyodor Dostoevsky', 'Karya klasik Fyodor Dostoevsky yang menghadirkan kisah Crime and Punishment, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69000],
                ['Les Miserables', 'Victor Hugo', 'Karya klasik Victor Hugo yang menghadirkan kisah Les Miserables, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64800],
            ],
            'Sains & Imajinasi' => [
                ['The First Men in the Moon', 'H. G. Wells', 'Karya klasik H. G. Wells yang menghadirkan kisah The First Men in the Moon, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 72500],
                ['The Lost World', 'Arthur Conan Doyle', 'Karya klasik Arthur Conan Doyle yang menghadirkan kisah The Lost World, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 64800],
                ['From the Earth to the Moon', 'Jules Verne', 'Karya klasik Jules Verne yang menghadirkan kisah From the Earth to the Moon, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 73200],
                ['The Invisible Man of Mars', 'Edgar Rice Burroughs', 'Karya klasik Edgar Rice Burroughs yang menghadirkan kisah The Invisible Man of Mars, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 72500],
                ['Flatland', 'Edwin A. Abbott', 'Karya klasik Edwin A. Abbott yang menghadirkan kisah Flatland, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 60600],
                ['The Coming Race', 'Edward Bulwer-Lytton', 'Karya klasik Edward Bulwer-Lytton yang menghadirkan kisah The Coming Race, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 65500],
                ['Looking Backward', 'Edward Bellamy', 'Karya klasik Edward Bellamy yang menghadirkan kisah Looking Backward, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 66200],
                ['Erewhon', 'Samuel Butler', 'Karya klasik Samuel Butler yang menghadirkan kisah Erewhon, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 59900],
                ['The Food of the Gods', 'H. G. Wells', 'Karya klasik H. G. Wells yang menghadirkan kisah The Food of the Gods, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 69000],
                ['The Island of Adventure', 'R. M. Ballantyne', 'Karya klasik R. M. Ballantyne yang menghadirkan kisah The Island of Adventure, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 71100],
                ['The Wonderful Wizard of Oz', 'L. Frank Baum', 'Karya klasik L. Frank Baum yang menghadirkan kisah The Wonderful Wizard of Oz, diterbitkan ulang sebagai bagian dari koleksi bacaan klasik BookStore.', 73200],
            ],
        ];

        foreach ($data as $genre => $books) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($genre)],
                ['name' => $genre]
            );

            foreach ($books as [$title, $author, $synopsis, $price]) {
                Book::updateOrCreate(
                    ['title' => $title],
                    [
                        'category_id' => $category->id,
                        'author'      => $author,
                        'synopsis'    => $synopsis,
                        'price'       => $price,
                        'stock'       => rand(5, 30),
                        'cover'       => 'covers/' . Str::slug($title) . '.svg',
                        'ebook_file'  => null,
                    ]
                );
            }
        }

        $this->call(EbookSeeder::class);
    }
}
