import axios from 'axios'

// Satu "pintu" untuk semua panggilan ke API Laravel.
// Token login otomatis ditempel ke setiap request lewat interceptor.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Ambil pesan error yang enak dibaca dari respons Laravel (validasi 422 dst.)
export function errorMessage(err) {
  const data = err?.response?.data
  if (data?.errors) return Object.values(data.errors).flat().join(' ')
  return data?.message || 'Terjadi kesalahan. Pastikan backend sedang berjalan.'
}

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export default api
