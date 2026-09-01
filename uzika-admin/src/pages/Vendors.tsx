import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

type Tab = 'active' | 'application' | 'suspended' | 'rejected';

export default function Vendors() {
  const { vendors, updateVendorStatus, markVendorSettled } = useData();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'active';
  const [tab, setTab] = useState<Tab>(initialTab);

  const active = vendors.filter(v => v.status === 'active');
  const applications = vendors.filter(v => v.status === 'application');
  const suspended = vendors.filter(v => v.status === 'suspended');
  const rejected = vendors.filter(v => v.status === 'rejected');

  return (
    <div>
      <PageHeader title="Vendor Management" />

      <div className="filter-tabs">
        <button className={tab === 'active' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('active')}>
          Active ({active.length})
        </button>
        <button className={tab === 'application' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('application')}>
          Applications ({applications.length})
        </button>
        <button className={tab === 'suspended' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('suspended')}>
          Suspended ({suspended.length})
        </button>
        <button className={tab === 'rejected' ? 'filter-tab filter-tab-active' : 'filter-tab'} onClick={() => setTab('rejected')}>
          Rejected ({rejected.length})
        </button>
      </div>

      {tab === 'active' && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Vendor</th><th>Location</th><th>Rating</th><th>Orders</th><th>Balance</th><th>Commission</th><th></th>
              </tr>
            </thead>
            <tbody>
              {active.map(v => (
                <tr key={v.name}>
                  <td><strong>{v.name}</strong></td>
                  <td>{v.location}</td>
                  <td>{v.rating}</td>
                  <td>{v.orders}</td>
                  <td>TZS {v.balance.toLocaleString()}</td>
                  <td>{v.commission}%</td>
                  <td>
                    <button
                      className="btn btn-outline"
                      disabled={v.settledToday}
                      onClick={() => markVendorSettled(v.name)}
                    >
                      {v.settledToday ? 'Settled' : 'Settle'}
                    </button>{' '}
                    <button className="btn btn-danger-outline" onClick={() => updateVendorStatus(v.name, 'suspended')}>Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'application' && (
        <div>
          {applications.map(v => (
            <div key={v.name} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong>{v.name}</strong>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.location}</div>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => updateVendorStatus(v.name, 'active')}>Approve</button>{' '}
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
            <div key={v.name} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong>{v.name}</strong>
              <button className="btn btn-outline" onClick={() => updateVendorStatus(v.name, 'active')}>Rudisha</button>
            </div>
          ))}
          {suspended.length === 0 && <p style={{ color: '#9ca3af' }}>No suspended vendors.</p>}
        </div>
      )}

      {tab === 'rejected' && (
        <div>
          {rejected.map(v => (
            <div key={v.name} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong>{v.name}</strong>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.location}</div>
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