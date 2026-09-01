interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-title-row">
        <h1>{title}</h1>
        <span className="live-badge">
          <span className="live-dot"></span>
          Live
        </span>
      </div>
      <div className="page-date">Ijumaa, 29 Aug 2026 · Dar es Salaam</div>
    </div>
  );
}