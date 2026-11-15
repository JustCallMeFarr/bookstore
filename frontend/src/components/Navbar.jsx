import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useCart } from '../cart'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Book<span>Store</span>
      </Link>

      <nav>
        <a href="/#about">Tentang</a>
        <a href="/#explore">Jelajah</a>
        <a href="/#books">Koleksi</a>
        <a href="/#contact">Kontak</a>

        {isAdmin && <Link to="/admin">Dashboard Admin</Link>}

        {user && <Link to="/orders">Pesanan</Link>}

        {user && (
          <Link to="/cart" className="nav-cart">
            Keranjang
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        )}

        {user ? (
          <>
            <span className="nav-user">
              Hai, {user?.name?.split(' ')[0] || 'Pengguna'}
            </span>
            <button className="btn btn-small btn-ghost" onClick={handleLogout}>
              Keluar
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-small btn-ghost">
              Masuk
            </Link>
            <Link to="/register" className="btn btn-small">
              Daftar
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
