import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const STATUS_COLORS = {
  PENDING: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/admin/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filter === s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s} {s === 'ALL' ? `(${orders.length})` : `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {order.customer?.name} • {order.customer?.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </span>
                  <p className="text-xl font-bold text-green-700 mt-2">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="border-t pt-3 mb-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>{item.productName} × {item.quantityKg} kg</span>
                    <span>₹{item.lineTotal}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
