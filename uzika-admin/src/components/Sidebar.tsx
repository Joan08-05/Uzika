import { NavLink } from 'react-router-dom';

import { orders, vendors } from '../data/mockData';

const activeOrdersCount = orders.filter(
  (o) => o.status !== 'Completed' && o.status !== 'Cancelled'
).length;

const pendingVendorsCount = vendors.filter(
  (v) => v.status === 'application'
).length;

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Orders', path: '/orders', badge: activeOrdersCount },
  { label: 'Vendors', path: '/vendors', badge: pendingVendorsCount },
  { label: 'Customers', path: '/customers' },
  { label: 'Architecture', path: '/architecture' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">U</div>
        <div>
          <div className="logo-title">UZIKA</div>
          <div className="logo-subtitle">BACKOFFICE</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            <span>{item.label}</span>
            {item.badge !== undefined && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">S</div>
        <div>
          <div className="user-name">Salma M.</div>
          <div className="user-role">Operations Admin</div>
        </div>
      </div>
    </aside>
  );
}