import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { orders } from '../data/mockData';
import type { OrderStatus } from '../data/mockData';

const filters: (OrderStatus | 'All')[] = ['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter(o => o.status === activeFilter);

  return (
    <div>
      <PageHeader title="Order Management" />

      <div className="filter-tabs">
        {filters.map(f => (
          <button
            key={f}
            className={activeFilter === f ? 'filter-tab filter-tab-active' : 'filter-tab'}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'All' ? 'Zote' : f}
          </button>
        ))}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Vendor</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
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