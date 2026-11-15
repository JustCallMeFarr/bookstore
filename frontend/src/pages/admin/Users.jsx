import { useEffect, useState } from 'react'
import api from '../../api'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data))
  }, [])

  return (
    <>
      <h2>Pengguna Terdaftar</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Terdaftar</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td className="muted">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="muted">
                Belum ada pengguna.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
