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

const STATUS_ICONS = {
  CONFIRMED: '📋', SHIPPED: '🚚', OUT_FOR_DELIVERY: '🏍️', DELIVERED: '✅', CANCELLED: '❌',
};

const todayStr = () => new Date().toISOString().split('T')[0];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate] = useState(todayStr());
  const [rangeLoading, setRangeLoading] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data: d }) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const handleRangeSearch = async () => {
    setRangeLoading(true);
    try {
      const { data: d } = await api.get(`/admin/dashboard/range?from=${fromDate}&to=${toDate}`);
      setData(d);
    } catch {
      // keep existing data
    } finally {
      setRangeLoading(false);
    }
  };

  const setQuickRange = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setFromDate(from.toISOString().split('T')[0]);
    setToDate(to.toISOString().split('T')[0]);
  };

  if (loading) return <Loader />;
  if (!data) return <p className="text-center py-10 text-red-500">Failed to load dashboard</p>;

  const summaryCards = [
    { label: "Today's Orders", value: data.todayOrderCount || 0, icon: '📋', color: 'bg-orange-100 text-orange-800' },
    { label: "Today's Revenue", value: `${CURRENCY_SYMBOL}${data.todayRevenue || 0}`, icon: '💰', color: 'bg-green-100 text-green-800' },
    { label: 'Awaiting Dispatch', value: data.pendingOrders || 0, icon: '⏳', color: 'bg-red-100 text-red-800' },
    { label: 'Total Products', value: data.totalProducts || 0, icon: '🥭', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Total Users', value: data.totalUsers || 0, icon: '👥', color: 'bg-purple-100 text-purple-800' },
  ];

  const isRangeToday = fromDate === todayStr() && toDate === todayStr();

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">📊 Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 mb-8">
        {summaryCards.map((c) => (
          <div key={c.label} className={`${c.color} rounded-xl p-3 sm:p-5 shadow-sm`}>
            <div className="flex items-center justify-between gap-1">
              <div className="min-w-0">
                <p className="text-xs font-medium opacity-80 truncate">{c.label}</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{c.value}</p>
              </div>
              <span className="text-2xl sm:text-3xl shrink-0">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Date Range Analysis — Accordion */}
      <div className="bg-white rounded-xl shadow mb-6">
        <button onClick={() => setRangeOpen(!rangeOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition rounded-xl">
          <h2 className="text-lg font-semibold text-green-800">📅 Date Range Analysis</h2>
          <span className={`text-green-700 text-xl transition-transform ${rangeOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {rangeOpen && (
          <div className="px-6 pb-6">
            {/* Quick Range Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: 'Today', days: 0 },
                { label: 'Last 7 Days', days: 7 },
                { label: 'Last 30 Days', days: 30 },
                { label: 'Last 90 Days', days: 90 },
              ].map((q) => (
                <button key={q.label}
                  onClick={() => {
                    if (q.days === 0) { setFromDate(todayStr()); setToDate(todayStr()); }
                    else setQuickRange(q.days);
                  }}
                  className="px-3 py-1.5 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 transition">
                  {q.label}
                </button>
              ))}
            </div>

            {/* Date Inputs */}
            <div className="flex flex-wrap items-end gap-3 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input type="date" value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDate}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input type="date" value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate}
                  className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <button onClick={handleRangeSearch} disabled={rangeLoading}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition disabled:opacity-50">
                {rangeLoading ? '⏳ Loading...' : '🔍 Search'}
              </button>
            </div>

            {/* Range Results */}
            {(data.rangeOrderCount !== undefined) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Range Summary */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-green-800 mb-3">
                    {isRangeToday ? "📋 Today's Summary" : `📋 ${fromDate} to ${toDate}`}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Orders</span>
                      <span className="text-2xl font-bold text-blue-800">{data.rangeOrderCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Revenue</span>
                      <span className="text-2xl font-bold text-green-800">{CURRENCY_SYMBOL}{data.rangeRevenue || 0}</span>
                    </div>
                    {data.rangeOrderCount > 0 && (
                      <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Avg. Order Value</span>
                        <span className="text-2xl font-bold text-amber-800">
                          {CURRENCY_SYMBOL}{(parseFloat(data.rangeRevenue || 0) / data.rangeOrderCount).toFixed(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-green-800 mb-3">📊 Status Breakdown</h3>
                  {data.statusBreakdown && Object.keys(data.statusBreakdown).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(data.statusBreakdown).map(([status, count]) => {
                        const pct = Math.round((count / data.rangeOrderCount) * 100);
                        return (
                          <div key={status}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                {STATUS_ICONS[status] || '📦'} {status.replace(/_/g, ' ')}
                              </span>
                              <span className="text-sm font-bold">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className={`h-3 rounded-full ${STATUS_COLORS[status]?.split(' ')[0] || 'bg-gray-300'}`}
                                style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">No orders in this period</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
