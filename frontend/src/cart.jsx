import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from './api'
import { useAuth } from './auth'
import './styles/cart.css'

// Menyimpan jumlah isi keranjang, supaya angka di navbar selalu ikut berubah.
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  // Ambil jumlah isi keranjang dari API (0 kalau belum login)
  const refresh = useCallback(async () => {
    if (!user) {
      setCount(0)
      return
    }
    try {
      const { data } = await api.get('/cart')
      setCount(data.count)
    } catch {
      setCount(0)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Tambah buku ke keranjang. Mengembalikan respons API (berisi message).
  async function add(bookId, qty = 1) {
    const { data } = await api.post('/cart', { book_id: bookId, qty })
    setCount(data.count)
    return data
  }

  return <CartContext.Provider value={{ count, setCount, refresh, add }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
