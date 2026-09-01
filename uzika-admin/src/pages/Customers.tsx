import PageHeader from '../components/PageHeader';
import { customers } from '../data/mockData';

export default function Customers() {
  return (
    <div>
      <PageHeader title="Customer Management" />
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Customer</th><th>Simu</th><th>Orders</th><th>Matumizi</th><th>Pointi</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.name}>
                <td><strong>{c.name}</strong></td>
                <td>{c.phone}</td>
                <td>{c.orders}</td>
                <td>TZS {c.spend.toLocaleString()}</td>
                <td>{c.points.toLocaleString()}</td>
                <td>
                  <span className={c.status === 'active' ? 'status-pill status-ready' : 'status-pill status-cancelled'}>
                    {c.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline">Refund</button>{' '}
                  <button className="btn btn-danger-outline">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}