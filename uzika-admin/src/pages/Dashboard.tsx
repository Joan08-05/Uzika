import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function Dashboard() {
  const { orders, vendors, customers, complaints } = useData();
  const navigate = useNavigate();

  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const pendingApplications = vendors.filter(v => v.status === 'application').length;
  const vendorComplaints = complaints.filter(c => c.fromType === 'vendor').length;
  const customerComplaints = complaints.filter(c => c.fromType === 'customer').length;
  const refundsPending = customers.filter(c => !c.refunded).length;
  const settlementsDue = vendors.filter(v => v.status === 'active' && !v.settledToday).length;

  return (
    <div>
      <PageHeader title="Platform Overview" />
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{orders.length}</div><div className="stat-label">Orders</div></div>
        <div className="stat-card"><div className="stat-value">{activeOrders}</div><div className="stat-label">Active Orders</div></div>
        <div className="stat-card"><div className="stat-value">{vendors.filter(v => v.status === 'active').length}</div><div className="stat-label">Active Vendors</div></div>
        <div className="stat-card"><div className="stat-value">{customers.length}</div><div className="stat-label">Customers</div></div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Orders zinazoendelea sasa</h3>
          <table>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/orders', { state: { orderId: o.id } })}>
                  <td>#{o.id}</td>
                  <td><strong>{o.vendor}</strong></td>
                  <td>{o.customer}</td>
                  <td>{o.amount.toLocaleString()}</td>
                  <td><span className={`status-pill status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="action-panel">
          <div className="action-label">Inahitaji Hatua</div>
          <Link to="/vendors?tab=application" className="action-card">
            <div><strong>Vendor applications</strong><div className="action-sub">Zinasubiri approval na KYC</div></div>
            <div className="action-count">{pendingApplications}</div>
          </Link>
          <Link to="/complaints" className="action-card">
            <div><strong>Complaints wazi</strong><div className="action-sub">Vendors {vendorComplaints} · Customers {customerComplaints}</div></div>
            <div className="action-count">{complaints.length}</div>
          </Link>
          <Link to="/customers" className="action-card">
            <div><strong>Refunds pending</strong><div className="action-sub">Zinahitaji uhakiki</div></div>
            <div className="action-count">{refundsPending}</div>
          </Link>
          <Link to="/vendors?tab=active" className="action-card">
            <div><strong>Settlements due</strong><div className="action-sub">Vendors awaiting payout</div></div>
            <div className="action-count">{settlementsDue}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}