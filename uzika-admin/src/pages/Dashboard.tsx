import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

function parseTimeToMinutes(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function Dashboard() {
  const { orders, vendors, customers, complaints } = useData();
  const navigate = useNavigate();

  const totalCustomers = customers.length;
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  const averageOrder = orders.length
    ? Math.round(orders.reduce((sum, o) => sum + o.amount, 0) / orders.length)
    : 0;

  const completedCount = orders.filter(o => o.status === 'Completed').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
  const completionRate = orders.length ? Math.round((completedCount / orders.length) * 1000) / 10 : 0;
  const cancelledRate = orders.length ? Math.round((cancelledCount / orders.length) * 1000) / 10 : 0;

  const prepDurations = orders
    .map(o => {
      const prep = parseTimeToMinutes(o.timeline.find(s => s.stage === 'Preparing')?.time ?? null);
      const ready = parseTimeToMinutes(o.timeline.find(s => s.stage === 'Ready')?.time ?? null);
      return prep !== null && ready !== null ? ready - prep : null;
    })
    .filter((d): d is number => d !== null && d >= 0);
  const avgPrepTime = prepDurations.length
    ? Math.round(prepDurations.reduce((a, b) => a + b, 0) / prepDurations.length)
    : null;

  const pendingApplications = vendors.filter(v => v.status === 'application').length;
  const vendorComplaints = complaints.filter(c => c.fromType === 'vendor').length;
  const customerComplaints = complaints.filter(c => c.fromType === 'customer').length;
  const refundsPending = customers.filter(c => !c.refunded).length;
  const settlementsDue = vendors.filter(v => v.status === 'active' && !v.settledToday).length;

  const stats: { label: string; value: string; to: string; state?: object }[] = [
    { label: 'Total Customers', value: totalCustomers.toLocaleString(), to: '/customers' },
    { label: 'Total Vendors', value: totalVendors.toLocaleString(), to: '/vendors' },
    { label: 'Active Vendors', value: activeVendors.toLocaleString(), to: '/vendors?tab=active' },
    { label: 'Active Customers', value: activeCustomers.toLocaleString(), to: '/customers' },
    { label: 'Average Order', value: `TZS ${averageOrder.toLocaleString()}`, to: '/orders' },
    { label: 'Completion Rate', value: `${completionRate}%`, to: '/orders', state: { statusFilter: 'Completed' } },
    { label: 'Cancelled Orders', value: `${cancelledRate}%`, to: '/orders', state: { statusFilter: 'Cancelled' } },
    { label: 'Avg Preparation Time', value: avgPrepTime !== null ? `${avgPrepTime} min` : '—', to: '/orders' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="stat-grid">
        {stats.map(s => (
          <Link key={s.label} to={s.to} state={s.state} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3>Orders zinazoendelea sasa</h3>
            <Link to="/orders" style={{ fontSize: 14, color: '#D62828', fontWeight: 600, textDecoration: 'none' }}>
              Zote →
            </Link>
          </div>
          <table>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/orders', { state: { orderId: o.id } })}>
                  <td><span className="order-id-link">#{o.id}</span></td>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="icon-circle icon-circle-blue">🔔</span>
              <div><strong>Vendor Applications</strong><div className="action-sub">Zinasubiri approval na KYC</div></div>
            </div>
            <div className="action-count">{pendingApplications}</div>
          </Link>

          <Link to="/complaints" className="action-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="icon-circle icon-circle-red">🔔</span>
              <div><strong>Complaints wazi</strong><div className="action-sub">Vendors {vendorComplaints} · Customers {customerComplaints}</div></div>
            </div>
            <div className="action-count">{complaints.length}</div>
          </Link>

          <Link to="/customers" className="action-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="icon-circle icon-circle-blue">🔔</span>
              <div><strong>Refunds pending</strong><div className="action-sub">Zinahitaji uhakiki</div></div>
            </div>
            <div className="action-count">{refundsPending}</div>
          </Link>

          <Link to="/vendors?tab=active" className="action-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="icon-circle icon-circle-red">🔔</span>
              <div><strong>Settlements due</strong><div className="action-sub">Vendors awaiting payout</div></div>
            </div>
            <div className="action-count">{settlementsDue}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}