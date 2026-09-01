import PageHeader from '../components/PageHeader';
import { complaints } from '../data/mockData';

export default function Complaints() {
  return (
    <div>
      <PageHeader title="Complaints" />
      <div className="card">
        {complaints.map((c, i) => (
          <div key={i} className="detail-row" style={{ padding: '14px 0', borderBottom: '1px solid #f0f1f3' }}>
            <div>
              <strong>{c.from}</strong>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{c.fromType === 'vendor' ? 'Vendor' : 'Customer'}</div>
            </div>
            <div style={{ color: '#6b7280' }}>{c.issue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}