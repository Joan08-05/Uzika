import PageHeader from '../components/PageHeader';
import { orders } from '../data/mockData';

export default function Dashboard() {
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;

  return (
    <div>
      <PageHeader title="Platform Overview" />

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeOrders}</div>
          <div className="stat-label">Active Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">417</div>
          <div className="stat-label">Active Vendors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">8,241</div>
          <div className="stat-label">Active Customers</div>
        </div>
      </div>

      <div className="card">
        <h3>Orders zinazoendelea sasa</h3>
        <table>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
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
    </div>
  );
}