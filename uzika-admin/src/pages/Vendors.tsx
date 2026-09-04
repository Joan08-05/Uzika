import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

type Tab = 'active' | 'application' | 'suspended' | 'rejected';

const PAGE_SIZE = 10;

export default function Vendors() {
  const { vendors, complaints, updateVendorStatus, markVendorSettled } = useData();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'active';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    setActivePage(1);
  }, [search]);

  const matchesSearch = (v: { name: string; phone: string }) =>
    v.name.toLowerCase().includes(search.toLowerCase()) || v.phone.includes(search);

  const allActive = vendors.filter(v => v.status === 'active');
  const allApplications = vendors.filter(v => v.status === 'application');
  const allSuspended = vendors.filter(v => v.status === 'suspended');
  const allRejected = vendors.filter(v => v.status === 'rejected');

  const active = allActive.filter(matchesSearch);
  const applications = allApplications.filter(matchesSearch);
  const suspended = allSuspended.filter(matchesSearch);
  const rejected = allRejected.filter(matchesSearch);

  const activeTotalPages = Math.max(1, Math.ceil(active.length / PAGE_SIZE));
  const activePageItems = active.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  const vendorComplaints = complaints.filter(c => c.fromType === 'vendor').length;
  const settlementsDueToday = allActive
    .filter(v => !v.settledToday)
    .reduce((sum, v) => sum + v.balance, 0);

  const commissionCounts = new Map<number, number>();
  allActive.forEach(v => commissionCounts.set(v.commission, (commissionCounts.get(v.commission) ?? 0) + 1));
  let standardCommission = allActive[0]?.commission ?? 8;
  let bestCount = 0;
  commissionCounts.forEach((count, c) => { if (count > bestCount) { bestCount = count; standardCommission = c; } });

  return (
    <div>
      <PageHeader
        title="Vendor Management"
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
        <button className={tab === 'active' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('active')}>
          Active ({allActive.length})
        </button>
        <button className={tab === 'application' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('application')}>
          Application ({allApplications.length})
        </button>
        <button className={tab === 'suspended' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('suspended')}>
          Suspended ({allSuspended.length})
        </button>
        {allRejected.length > 0 && (
          <button className={tab === 'rejected' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('rejected')}>
            Rejected ({allRejected.length})
          </button>
        )}
      </div>

      {tab === 'active' && (
        <>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th><th>Namba za simu</th><th>Rating</th><th>Order leo</th><th>Balance</th><th>Location</th><th>Hatua</th>
                </tr>
              </thead>
              <tbody>
                {activePageItems.map(v => (
                  <tr key={v.name}>
                    <td><strong>{v.name}</strong></td>
                    <td className="nowrap-cell">{v.phone}</td>
                    <td>{v.rating}</td>
                    <td>{v.orders}</td>
                    <td>TZS {v.balance.toLocaleString()}</td>
                    <td>{v.location}</td>
                    <td>
                      <div className="hatua-cell">
                        <button
                          className="btn btn-outline"
                          disabled={v.settledToday}
                          onClick={() => markVendorSettled(v.name)}
                        >
                          {v.settledToday ? 'Approved' : 'Approve'}
                        </button>
                        <button className="btn btn-danger-outline" onClick={() => updateVendorStatus(v.name, 'suspended')}>Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button disabled={activePage === 1} onClick={() => setActivePage(p => p - 1)}>‹</button>
              <span className="pagination-current">{activePage}</span>
              <span className="pagination-total">of {activeTotalPages}</span>
              <button disabled={activePage === activeTotalPages} onClick={() => setActivePage(p => p + 1)}>›</button>
            </div>
          </div>

          <div className="summary-footer">
            <span>Complaints wazi: <strong>{vendorComplaints}</strong></span>
            <span>Settlements due leo: <strong>TZS {settlementsDueToday.toLocaleString()}</strong></span>
            <span>Standard commission: <strong>{standardCommission}%</strong></span>
          </div>
        </>
      )}

      {tab === 'application' && (
        <div>
          {applications.map(v => (
            <div key={v.name} className="card vendor-app-card">
              <div className="vendor-app-left">
                <span className="icon-circle icon-circle-blue">🔔</span>
                <div>
                  <strong>{v.name}</strong>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.location}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={v.kycStatus === 'verified' ? 'kyc-pill kyc-verified' : 'kyc-pill kyc-pending'}>
                  KYC: {v.kycStatus === 'verified' ? 'Verified' : 'Pending'}
                </span>
                <button className="btn btn-primary" onClick={() => updateVendorStatus(v.name, 'active')}>Approve</button>
                <button className="btn btn-danger-outline" onClick={() => updateVendorStatus(v.name, 'rejected')}>Reject</button>
              </div>
            </div>
          ))}
          {applications.length === 0 && <p style={{ color: '#9ca3af' }}>No pending applications.</p>}
        </div>
      )}

      {tab === 'suspended' && (
        <div>
          {suspended.map(v => (
            <div key={v.name} className="card vendor-app-card">
              <div className="vendor-app-left">
                <span className="icon-circle icon-circle-blue">🔔</span>
                <div>
                  <strong>{v.name}</strong>
                  <div style={{ color: '#d0335c', fontSize: '13px' }}>
                    Suspended na admin{v.suspendedReason ? ` · ${v.suspendedReason}` : ''} · {v.suspendedDate ?? 'leo'}
                  </div>
                </div>
              </div>
              <button className="btn btn-outline" onClick={() => updateVendorStatus(v.name, 'active')}>Rudisha</button>
            </div>
          ))}
          {suspended.length === 0 && <p style={{ color: '#9ca3af' }}>No suspended vendors.</p>}
        </div>
      )}

      {tab === 'rejected' && (
        <div>
          {rejected.map(v => (
            <div key={v.name} className="card vendor-app-card">
              <div className="vendor-app-left">
                <span className="icon-circle icon-circle-blue">🔔</span>
                <div>
                  <strong>{v.name}</strong>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.location}</div>
                </div>
              </div>
              <button className="btn btn-outline" onClick={() => updateVendorStatus(v.name, 'application')}>Reconsider</button>
            </div>
          ))}
          {rejected.length === 0 && <p style={{ color: '#9ca3af' }}>No rejected applications.</p>}
        </div>
      )}
    </div>
  );
}