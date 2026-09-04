import PageHeader from '../components/PageHeader';

export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" />
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#D62828" strokeWidth="1.5" style={{ margin: '0 auto 20px' }}>
          <path d="M4 15a8 8 0 0 1 16 0z" />
          <path d="M4 15h16" />
          <path d="M9 11a3 3 0 0 1 6 0" />
        </svg>
        <h2 style={{ color: '#1B1B2F', marginBottom: 8 }}>Coming Soon</h2>
        <p style={{ color: '#6b7280' }}>Revenue, order trends, and vendor performance reports are on the way.</p>
      </div>
    </div>
  );
}