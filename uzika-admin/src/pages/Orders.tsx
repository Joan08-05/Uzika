import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

type TimelineStep = {
  stage: string;
  time: string | null;
};

type Order = {
  id: string;
  vendor: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  items: string;
  payment: string;
  timeline: TimelineStep[];
};

const filters: (OrderStatus | 'All')[] = ['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function Orders() {
  const { orders } = useData();
  const location = useLocation();
  const incomingOrderId = (location.state as { orderId?: string } | null)?.orderId;

  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    incomingOrderId ? orders.find(o => o.id === incomingOrderId) ?? null : null);

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

      <div className="orders-layout">
        <div className="orders-table-col card">
          <table>
            <thead>
              <tr><th>Order</th><th>Vendor</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr
                  key={o.id}
                  className={selectedOrder?.id === o.id ? 'row-selected' : ''}
                  onClick={() => setSelectedOrder(o)}
                  style={{ cursor: 'pointer' }}
                >
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

        {selectedOrder && (
          <div className="order-detail-panel card">
            <div className="detail-row"><span>Customer</span><strong>{selectedOrder.customer}</strong></div>
            <div className="detail-row"><span>Items</span><strong>{selectedOrder.items}</strong></div>
            <div className="detail-row"><span>Malipo</span><strong>{selectedOrder.payment}</strong></div>
            <div className="detail-row detail-total"><span>Jumla</span><strong>TZS {selectedOrder.amount.toLocaleString()}</strong></div>

            <div className="timeline-label">Transaction Timeline</div>
            <div className="timeline">
              {selectedOrder.timeline.map(step => (
                <div key={step.stage} className={`timeline-step ${step.time ? 'timeline-done' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <span>{step.stage}</span>
                    <span className="timeline-time">{step.time || '—'}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-danger-outline" style={{ width: '100%', marginTop: '16px' }}>
              Issue refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
}