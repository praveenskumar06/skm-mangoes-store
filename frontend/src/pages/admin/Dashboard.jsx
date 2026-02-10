import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p className="text-center py-10 text-red-500">Failed to load dashboard</p>;

  const cards = [
    { label: 'Today\'s Revenue', value: `₹${data.todayRevenue || 0}`, icon: '💰', color: 'bg-green-100 text-green-800' },
    { label: 'Today\'s Orders', value: data.todayOrderCount || 0, icon: '📋', color: 'bg-orange-100 text-orange-800' },
    { label: 'Total Products', value: data.totalProducts || 0, icon: '🥭', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Total Users', value: data.totalUsers || 0, icon: '👥', color: 'bg-purple-100 text-purple-800' },
    { label: 'Pending Orders', value: data.pendingOrders || 0, icon: '⏳', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{c.label}</p>
                <p className="text-3xl font-bold mt-1">{c.value}</p>
              </div>
              <span className="text-4xl">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
