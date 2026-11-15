// =====================================================
// GANTI ISI FILE INI dengan datamu sendiri.
// Foto: taruh di folder public/photos/ lalu ubah nama filenya di bawah.
// =====================================================
export const profile = {
  name: 'Farr',
  role: 'Junior Web Developer',
  tagline: 'Membangun toko buku kecil dengan cerita besar.',

  // Dua foto: yang kiri berpasangan dengan teks kanan, yang kanan dengan teks kiri
  // Dua foto: yang kiri berpasangan dengan teks kanan, yang kanan dengan teks kiri
photoLeft: '/photos/foto-kiri.jpg',
photoRight: '/photos/foto-kanan.jpg',

  // Blok 1: foto kiri, teks kanan
  about1: {
    title: 'Halo, Kenalin Gua Farr.',
    text: [
      'Aku sedang belajar menjadi web developer. Proyek ini adalah toko buku online yang kubangun selama masa pelatihan, lengkap dengan halaman admin, keranjang, dan pembayaran.',
      'Aku suka membaca, dan suka membuat sesuatu yang bisa dipakai orang lain.',
    ],
  },

  // Blok 2: teks kiri, foto kanan
  about2: {
    title: 'Apa yang kupelajari',
    text: [
      'Selama pelatihan aku belajar HTML, CSS, PHP, MySQL, Laravel, dan React. Tiap minggu ada hal baru yang bikin pusing sekaligus seru.',
      'Aku mengerjakan proyek ini dari nol: merancang database, membuat API, lalu menyusun tampilannya.',
    ],
    skills: ['React', 'Laravel', 'MySQL', 'REST API', 'CSS'],
  },

  // Judul area penjelajah buku (gaya "there's nothing to watch")
  exploreTitle: "there's nothing to read",
  exploreHint: 'gerakkan kursor di atas sampul · klik untuk melihat ringkasan',

  contact: {
    email: 'hello@example.com',
    github: 'https://github.com/',
    instagram: 'https://instagram.com/',
  },
}
