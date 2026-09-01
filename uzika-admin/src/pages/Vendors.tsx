import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { vendors } from '../data/mockData';

type Tab = 'active' | 'application' | 'suspended';

export default function Vendors() {
  const [tab, setTab] = useState<Tab>('active');

  const active = vendors.filter(v => v.status === 'active');
  const applications = vendors.filter(v => v.status === 'application');
  const suspended = vendors.filter(v => v.status === 'suspended');

  const tabData = { active, application: applications, suspended };

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
              {tabData.active.map(v => (
                <tr key={v.name}>
                  <td><strong>{v.name}</strong></td>
                  <td>{v.location}</td>
                  <td>{v.rating}</td>
                  <td>{v.orders}</td>
                  <td>TZS {v.balance.toLocaleString()}</td>
                  <td>{v.commission}%</td>
                  <td>
                    <button className="btn btn-outline">Settle</button>{' '}
                    <button className="btn btn-danger-outline">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'application' && (
        <div>
          {tabData.application.map(v => (
            <div key={v.name} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong>{v.name}</strong>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>{v.location}</div>
              </div>
              <div>
                <button className="btn btn-primary">Approve</button>{' '}
                <button className="btn btn-danger-outline">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'suspended' && (
        <div>
          {tabData.suspended.map(v => (
            <div key={v.name} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{v.name}</strong>
              <button className="btn btn-outline">Rudisha</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}