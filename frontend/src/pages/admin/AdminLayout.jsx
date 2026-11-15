import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth'

// Kerangka dashboard admin. Pengguna biasa / belum login otomatis dialihkan.
export default function AdminLayout() {
  const { user, isAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  const link = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <div className="admin">
      <aside className="admin-side">
        <h3>Admin</h3>
        <NavLink to="/admin" end className={link}>
          Ringkasan
        </NavLink>
        <NavLink to="/admin/categories" className={link}>
          Kategori
        </NavLink>
        <NavLink to="/admin/books" className={link}>
          Buku
        </NavLink>
        <NavLink to="/admin/orders" className={link}>
          Pesanan
        </NavLink>
        <NavLink to="/admin/users" className={link}>
          Pengguna
        </NavLink>
        <NavLink to="/admin/messages" className={link}>
          Pesan masuk
        </NavLink>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
