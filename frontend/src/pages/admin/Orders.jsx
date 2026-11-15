import { Fragment, useEffect, useState } from 'react'
import api, { errorMessage, rupiah } from '../../api'
import { PAYMENT_LABEL, STATUS_LABEL, STATUS_LIST, formatDate } from '../../orderStatus'
import '../../styles/orders.css'

// Daftar pesanan dari semua user + ubah status. Klik baris untuk melihat detailnya.
export default function Orders() {
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState(null) // id pesanan yang sedang dibuka
  const [error, setError] = useState('')

  const load = () =>
    api
      .get('/admin/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => setError(errorMessage(err)))

  useEffect(() => {
    load()
  }, [])

  async function changeStatus(order, status) {
    setError('')
    try {
      const { data } = await api.put(`/admin/orders/${order.id}/status`, { status })
      setOrders((list) => list.map((o) => (o.id === data.id ? data : o)))
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <>
      <h2>Pesanan Masuk</h2>
      {error && <p className="notice error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tanggal</th>
            <th>Pemesan</th>
            <th>Total</th>
            <th>Pembayaran</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <Fragment key={o.id}>
              <tr className="row-click" onClick={() => setOpen(open === o.id ? null : o.id)}>
                <td>{o.id}</td>
                <td className="muted">{formatDate(o.created_at)}</td>
                <td>
                  {o.user.name}
                  <br />
                  <span className="muted">{o.user.email}</span>
                </td>
                <td>{rupiah(o.total)}</td>
                <td className={o.payment_status === 'paid' ? 'paid' : 'muted'}>
                  {o.payment_status === 'paid' ? 'Lunas' : 'COD'}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    className={`status-select st-${o.status}`}
                    value={o.status}
                    disabled={o.status === 'cancelled'}
                    onChange={(e) => changeStatus(o, e.target.value)}
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

              {open === o.id && (
                <tr className="order-expand">
                  <td colSpan="6">
                    <div className="expand-grid">
                      <div>
                        <strong>Isi pesanan</strong>
                        <ul>
                          {o.items.map((i) => (
                            <li key={i.id}>
                              {i.book?.title ?? '(buku dihapus)'} × {i.qty} · {rupiah(i.subtotal)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Pengiriman</strong>
                        <p className="pre">{o.address}</p>
                        <span className="muted">{PAYMENT_LABEL[o.payment_status]}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="muted">
                Belum ada pesanan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
