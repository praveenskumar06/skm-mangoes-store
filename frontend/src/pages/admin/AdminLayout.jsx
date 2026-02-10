import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '🥭 Products' },
  { to: '/admin/orders', label: '📦 Orders' },
  { to: '/admin/users', label: '👥 Users' },
  { to: '/admin/settings', label: '⚙️ Settings' },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <aside className="w-56 shrink-0">
          <h2 className="text-lg font-bold text-green-800 mb-4">Admin Panel</h2>
          <nav className="space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-green-700 text-white'
                      : 'text-gray-700 hover:bg-green-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
