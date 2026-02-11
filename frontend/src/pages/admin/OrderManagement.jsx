import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { CURRENCY_SYMBOL } from '../../constants';

const STATUS_COLORS = {
  CONFIRMED: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUSES = ['CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const COURIERS = ['DTDC', 'Delhivery', 'BlueDart', 'India Post', 'Professional Courier', 'Local Delivery', 'Other'];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState('list');
  const [expandedId, setExpandedId] = useState(null);
  const [courierForm, setCourierForm] = useState({});
  const [savingCourier, setSavingCourier] = useState(null);
  const [dispatchData, setDispatchData] = useState({});
  const [dispatching, setDispatching] = useState(false);

  const fetchOrders = async (type, date) => {
    setLoading(true);
    try {
      let endpoint;
      if (type === 'today') endpoint = '/admin/orders/today';
      else if (type === 'date') endpoint = `/admin/orders/by-date?date=${date || selectedDate}`;
      else endpoint = '/admin/orders';
      const { data } = await api.get(endpoint);
      setOrders(data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'date') fetchOrders('date', selectedDate);
    else fetchOrders(view);
  }, [view, selectedDate]);

  const enterDispatchMode = () => {
    const pending = orders.filter((o) => o.status === 'CONFIRMED');
    const initial = {};
    pending.forEach((o) => {
      initial[o.id] = { selected: true, courierName: o.courierName || '', trackingId: o.trackingId || '' };
    });
    setDispatchData(initial);
    setMode('dispatch');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCourierSave = async (orderId) => {
    const form = courierForm[orderId];
    if (!form?.courierName || !form?.trackingId) { alert('Please enter both courier name and tracking ID'); return; }
    setSavingCourier(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/courier`, { courierName: form.courierName, trackingId: form.trackingId });
      setOrders((prev) => prev.map((o) =>
        o.id === orderId ? { ...o, courierName: form.courierName, trackingId: form.trackingId } : o
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update courier info');
    } finally { setSavingCourier(null); }
  };

  const handleBatchDispatch = async () => {
    const selected = Object.entries(dispatchData).filter(([, d]) => d.selected && d.courierName && d.trackingId);
    if (selected.length === 0) { alert('Please select orders and fill in courier details'); return; }
    const incomplete = Object.entries(dispatchData).filter(([, d]) => d.selected && (!d.courierName || !d.trackingId));
    if (incomplete.length > 0) { alert(`${incomplete.length} selected order(s) are missing courier/tracking info`); return; }

    setDispatching(true);
    let successCount = 0, failCount = 0;
    for (const [idStr, data] of selected) {
      const id = parseInt(idStr);
      try {
        await api.put(`/admin/orders/${id}/courier`, { courierName: data.courierName, trackingId: data.trackingId });
        await api.put(`/admin/orders/${id}/status`, { status: 'SHIPPED' });
        setOrders((prev) => prev.map((o) =>
          o.id === id ? { ...o, status: 'SHIPPED', courierName: data.courierName, trackingId: data.trackingId } : o
        ));
        successCount++;
      } catch { failCount++; }
    }
    setDispatching(false);
    alert(`Dispatched ${successCount} order(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);
    setMode('list');
  };

  const handleExportCSV = async () => {
    try {
      let endpoint;
      if (view === 'today') endpoint = '/admin/orders/today/export';
      else if (view === 'date') endpoint = `/admin/orders/by-date/export?date=${selectedDate}`;
      else endpoint = '/admin/orders/export';
      const { data } = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = view === 'date'
        ? `orders-${selectedDate}.csv`
        : view === 'today'
          ? `orders-today-${new Date().toISOString().slice(0, 10)}.csv`
          : `orders-all-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch { alert('Failed to export CSV'); }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    if (!courierForm[id]) {
      const order = orders.find((o) => o.id === id);
      setCourierForm((prev) => ({ ...prev, [id]: { courierName: order?.courierName || '', trackingId: order?.trackingId || '' } }));
    }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);
  const totalRevenue = filtered.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'CONFIRMED').length;

  if (loading) return <Loader />;

  // ==================== DISPATCH MODE ====================
  if (mode === 'dispatch') {
    const dispatchOrders = orders.filter((o) => o.status === 'CONFIRMED');
    const selectedCount = Object.values(dispatchData).filter((d) => d.selected).length;
    const readyCount = Object.values(dispatchData).filter((d) => d.selected && d.courierName && d.trackingId).length;

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">🚚 Batch Dispatch</h1>
            <p className="text-sm text-gray-500 mt-1">
              {dispatchOrders.length} order(s) to dispatch • {selectedCount} selected • {readyCount} ready
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode('list')}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
              ← Back to Orders
            </button>
            <button onClick={handleBatchDispatch} disabled={dispatching || readyCount === 0}
              className="px-6 py-2 rounded-lg font-semibold text-sm bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-50">
              {dispatching ? '⏳ Dispatching...' : `✅ Dispatch ${readyCount} Order(s)`}
            </button>
          </div>
        </div>

        {dispatchOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No pending/confirmed orders to dispatch.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Quick fill bar */}
            <div className="bg-green-50 border-b p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">⚡ Quick fill — apply same courier to all selected:</p>
              <div className="flex gap-2 flex-wrap items-center">
                <select id="bulk-courier" defaultValue=""
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Courier</option>
                  {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => {
                    const courier = document.getElementById('bulk-courier').value;
                    if (!courier) { alert('Select a courier first'); return; }
                    setDispatchData((prev) => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach((id) => { if (updated[id].selected) updated[id] = { ...updated[id], courierName: courier }; });
                      return updated;
                    });
                  }}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition">
                  Apply to Selected
                </button>
              </div>
            </div>

            {/* Dispatch Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">
                      <input type="checkbox"
                        checked={Object.values(dispatchData).every((d) => d.selected)}
                        onChange={(e) => setDispatchData((prev) => {
                          const updated = { ...prev };
                          Object.keys(updated).forEach((id) => { updated[id] = { ...updated[id], selected: e.target.checked }; });
                          return updated;
                        })} className="w-4 h-4" />
                    </th>
                    <th className="p-3 text-left">Order</th>
                    <th className="p-3 text-left">Customer & Address</th>
                    <th className="p-3 text-left">Items</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-left">Courier</th>
                    <th className="p-3 text-left">Tracking ID</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchOrders.map((order) => {
                    const d = dispatchData[order.id] || {};
                    const addr = order.address;
                    const cust = order.customer;
                    return (
                      <tr key={order.id} className={`border-t ${d.selected ? 'bg-green-50/50' : ''}`}>
                        <td className="p-3">
                          <input type="checkbox" checked={d.selected || false}
                            onChange={(e) => setDispatchData((prev) => ({ ...prev, [order.id]: { ...prev[order.id], selected: e.target.checked } }))}
                            className="w-4 h-4" />
                        </td>
                        <td className="p-3">
                          <p className="font-bold">#{order.id}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold">{cust?.name}</p>
                          <p className="text-gray-500">📞 {cust?.phone}</p>
                          {addr && <p className="text-gray-400 text-xs mt-1">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>}
                        </td>
                        <td className="p-3">
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="text-xs">{item.productName} × {item.quantityKg}kg</p>
                          ))}
                        </td>
                        <td className="p-3 text-right font-bold text-green-700">{CURRENCY_SYMBOL}{order.totalAmount}</td>
                        <td className="p-3">
                          <select value={d.courierName || ''}
                            onChange={(e) => setDispatchData((prev) => ({ ...prev, [order.id]: { ...prev[order.id], courierName: e.target.value } }))}
                            className="w-full px-2 py-1.5 border rounded text-sm outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Select</option>
                            {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="p-3">
                          <input type="text" placeholder="AWB / Tracking ID" value={d.trackingId || ''}
                            onChange={(e) => setDispatchData((prev) => ({ ...prev, [order.id]: { ...prev[order.id], trackingId: e.target.value } }))}
                            className="w-full px-2 py-1.5 border rounded text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Dispatch Footer */}
            <div className="bg-gray-50 border-t p-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">{readyCount} of {selectedCount} selected orders ready (courier + tracking filled)</p>
              <button onClick={handleBatchDispatch} disabled={dispatching || readyCount === 0}
                className="px-6 py-2 rounded-lg font-semibold text-sm bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-50">
                {dispatching ? '⏳ Dispatching...' : `✅ Dispatch ${readyCount} Order(s)`}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== LIST MODE ====================
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-green-800">📦 Orders</h1>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => { setView('today'); setFilter('ALL'); }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${view === 'today' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            📋 Today
          </button>
          <button onClick={() => { setView('all'); setFilter('ALL'); }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${view === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            📁 All
          </button>
          <div className="flex items-center gap-1">
            <input type="date" value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setView('date'); setFilter('ALL'); }}
              className={`px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-green-500 ${view === 'date' ? 'border-green-700 ring-2 ring-green-200' : 'border-gray-300'}`} />
          </div>
          {pendingCount > 0 && (
            <button onClick={enterDispatchMode}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 transition">
              🚚 Batch Dispatch ({pendingCount})
            </button>
          )}
          <button onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg font-semibold text-sm bg-yellow-500 text-green-900 hover:bg-yellow-400 transition">
            ⬇ CSV
          </button>
          <button onClick={() => fetchOrders(view, selectedDate)}
            className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
            🔄
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-green-700">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-green-700">{CURRENCY_SYMBOL}{totalRevenue.toFixed(0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-500">Awaiting Dispatch</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-500">Shipped</p>
          <p className="text-2xl font-bold text-purple-600">{orders.filter((o) => o.status === 'SHIPPED').length}</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${filter === s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {s.replace(/_/g, ' ')} ({s === 'ALL' ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;
            const addr = order.address;
            const cust = order.customer;
            return (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-5 cursor-pointer hover:bg-gray-50 transition" onClick={() => toggleExpand(order.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-lg">Order #{order.id}</p>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || ''}`}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">👤 {cust?.name} &nbsp;•&nbsp; 📞 {cust?.phone}</p>
                      <p className="text-sm text-gray-400">
                        🕐 {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {addr && <p className="text-sm text-gray-500 mt-1">📍 {addr.city}, {addr.state}</p>}
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xl font-bold text-green-700">{CURRENCY_SYMBOL}{order.totalAmount}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.items?.length || 0} item(s)</p>
                      <span className="text-gray-400 text-lg mt-1">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {order.courierName && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                      🚚 {order.courierName} {order.trackingId && `• ${order.trackingId}`}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-700 mb-2">👤 Customer Details</h4>
                        <p className="text-sm"><span className="text-gray-500">Name:</span> {cust?.name}</p>
                        <p className="text-sm"><span className="text-gray-500">Phone:</span> {cust?.phone}</p>
                        {cust?.email && <p className="text-sm"><span className="text-gray-500">Email:</span> {cust?.email}</p>}
                      </div>
                      <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-700 mb-2">📍 Delivery Address</h4>
                        {addr ? (
                          <>
                            <p className="text-sm font-medium">{addr.fullName}</p>
                            <p className="text-sm">{addr.addressLine}</p>
                            <p className="text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-sm">📞 {addr.phone}</p>
                          </>
                        ) : <p className="text-sm text-gray-400">No address on record</p>}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-700 mb-2">🥭 Order Items</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2">Product</th>
                            <th className="pb-2 text-right">Qty (kg)</th>
                            <th className="pb-2 text-right">Price/kg</th>
                            <th className="pb-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-2">{item.productName}</td>
                              <td className="py-2 text-right">{item.quantityKg}</td>
                              <td className="py-2 text-right">{CURRENCY_SYMBOL}{item.pricePerKg}</td>
                              <td className="py-2 text-right font-medium">{CURRENCY_SYMBOL}{item.lineTotal}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="font-bold text-green-700">
                            <td colSpan="3" className="pt-2 text-right">Order Total:</td>
                            <td className="pt-2 text-right">{CURRENCY_SYMBOL}{order.totalAmount}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-700 mb-2">🔄 Update Status</h4>
                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-700 mb-2">🚚 Courier & Tracking</h4>
                        <div className="space-y-2">
                          <select value={courierForm[order.id]?.courierName || ''}
                            onChange={(e) => setCourierForm((prev) => ({ ...prev, [order.id]: { ...prev[order.id], courierName: e.target.value } }))}
                            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Select Courier</option>
                            {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input type="text" placeholder="Tracking ID / AWB Number"
                            value={courierForm[order.id]?.trackingId || ''}
                            onChange={(e) => setCourierForm((prev) => ({ ...prev, [order.id]: { ...prev[order.id], trackingId: e.target.value } }))}
                            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                          <button onClick={() => handleCourierSave(order.id)} disabled={savingCourier === order.id}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                            {savingCourier === order.id ? 'Saving...' : '💾 Save Courier Info'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
