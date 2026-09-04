import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useData } from '../context/DataContext';
import type { OrderStatus } from '../data/mockData';

export default function Orders() {
  const { orders, issueOrderRefund } = useData();
  const location = useLocation();
  const state = location.state as { orderId?: string; statusFilter?: OrderStatus | 'All' } | null;
  const incomingOrderId = state?.orderId;
  const incomingStatusFilter = state?.statusFilter;

  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>(incomingStatusFilter ?? 'All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(incomingOrderId ?? null);

  const filteredOrders = orders
    .filter(o => activeFilter === 'All' || o.status === activeFilter)
    .filter(o =>
      o.vendor.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    );

  const selectedOrder = selectedId ? orders.find(o => o.id === selectedId) ?? null : null;

  return (
    <div>
      <PageHeader
        title="Order Management"
        rightContent={
          <input
            className="search-input"
            placeholder="Tafuta kwa jina au namba ya simu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />

      <div className="filter-tabs">
        {(['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled'] as const).map(f => (
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
        <div className="orders-table-col">
          <div className="card">
            <table>
              <thead>
                <tr><th>Order</th><th>Vendor</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr
                    key={o.id}
                    className={selectedId === o.id ? 'row-selected' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedId(o.id)}
                  >
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
        </div>

        {selectedOrder && (
          <div className="order-detail-panel">
            <div className="card">
              <div className="detail-row"><span>Customer</span><strong>{selectedOrder.customer}</strong></div>
              <div className="detail-row"><span>Items</span><strong>{selectedOrder.items}</strong></div>
              <div className="detail-row"><span>Location</span><strong>{selectedOrder.location}</strong></div>
              <div className="detail-row"><span>Malipo</span><strong>{selectedOrder.payment}</strong></div>
              <div className="detail-row detail-total"><span>Jumla</span><strong>TZS {selectedOrder.amount.toLocaleString()}</strong></div>

              <div className="timeline-label">Transaction Timeline</div>
              {selectedOrder.timeline.map(step => (
                <div key={step.stage} className={`timeline-step ${step.time ? 'timeline-done' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-text">
                    <span>{step.stage}</span>
                    <span className="timeline-time">{step.time ?? '—'}</span>
                  </div>
                </div>
              ))}

              <button
                className="btn-refund"
                disabled={selectedOrder.refundIssued}
                onClick={() => issueOrderRefund(selectedOrder.id)}
              >
                {selectedOrder.refundIssued ? 'Refund Issued ✓' : 'Issue refund'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}