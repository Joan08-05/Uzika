import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useData } from '../context/DataContext';

const PAGE_SIZE = 10;

export default function Customers() {
  const { customers, complaints, toggleCustomerSuspend } = useData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = customers.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalCustomers = customers.length;
  const members = customers.filter(c => c.isMember).length;
  const activeNow = customers.filter(c => c.status === 'active').length;
  const customerComplaints = complaints.filter(c => c.fromType === 'customer').length;

  return (
    <div>
      <PageHeader
        title="All Customers"
        rightContent={
          <input
            className="search-input"
            placeholder="Tafuta kwa jina au namba ya simu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />

      <div className="mini-stat-row">
        <div className="mini-stat-card">
          <div className="mini-stat-value">{totalCustomers.toLocaleString()}</div>
          <div className="mini-stat-label">Total Customers</div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-value">{members.toLocaleString()}</div>
          <div className="mini-stat-label">Members</div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-value">{activeNow.toLocaleString()}</div>
          <div className="mini-stat-label">Active Now</div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th><th>Phone Number</th><th>Orders</th><th>Matumizi</th><th>Pointi</th><th>Status</th><th>Hatua</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(c => (
              <tr key={c.name}>
                <td><strong>{c.name}</strong></td>
                <td className="nowrap-cell">{c.phone}</td>
                <td>{c.orders}</td>
                <td>TZS {c.spend.toLocaleString()}</td>
                <td>{c.points.toLocaleString()}</td>
                <td>
                  <span className={c.status === 'active' ? 'status-pill status-ready' : 'status-pill status-cancelled'}>
                    {c.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td>
                  <button
                    className={c.status === 'active' ? 'btn btn-danger-outline' : 'btn btn-outline'}
                    onClick={() => toggleCustomerSuspend(c.name)}
                  >
                    {c.status === 'active' ? 'Suspend' : 'Rudisha'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          <span className="pagination-current">{page}</span>
          <span className="pagination-total">of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      </div>

      <div className="summary-footer">
        <span>Complaints wazi: <strong>{customerComplaints}</strong></span>
        <span>Promotion hai: <strong>KARIBU10 (10% off, wateja wapya)</strong></span>
        <span>Loyalty: <strong>pointi 1 kwa kila TZS 100</strong></span>
      </div>
    </div>
  );
}