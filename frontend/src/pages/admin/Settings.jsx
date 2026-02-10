import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSeason } from '../../context/SeasonContext';
import Loader from '../../components/common/Loader';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { refreshSeason } = useSeason();

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => setSettings(data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.put('/admin/settings', { key, value });
      }
      alert('Settings saved successfully!');
      refreshSeason();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const seasonActive = settings.season_active;

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        {/* Season Toggle */}
        {seasonActive !== undefined && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">🥭 Mango Season</h3>
                <p className="text-sm text-gray-500">
                  {seasonActive === 'true'
                    ? 'Season is ACTIVE — customers can place orders'
                    : 'Season is CLOSED — orders are disabled'}
                </p>
              </div>
              <button
                onClick={() => handleChange('season_active', seasonActive === 'true' ? 'false' : 'true')}
                className={`relative w-14 h-7 rounded-full transition ${
                  seasonActive === 'true' ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  seasonActive === 'true' ? 'translate-x-7' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Other Settings */}
        <div className="space-y-4">
          {Object.entries(settings).filter(([key]) => key !== 'season_active').map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b">
              <label className="text-gray-700 capitalize font-medium">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="px-3 py-1 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 w-48 text-right"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
