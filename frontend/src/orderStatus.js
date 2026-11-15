// Teks dan kelas warna untuk status pesanan (dipakai halaman user dan admin)
export const STATUS_LABEL = {
  pending: 'Menunggu diproses',
  processed: 'Diproses',
  shipped: 'Dikirim',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}

export const STATUS_LIST = ['pending', 'processed', 'shipped', 'done', 'cancelled']

export const PAYMENT_LABEL = {
  unpaid: 'Belum dibayar · bayar saat barang diterima',
  paid: 'Lunas',
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
