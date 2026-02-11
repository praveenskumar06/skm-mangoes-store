import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { DELIVERY_ZONES } from '../../constants';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/profile'),
      api.get('/addresses'),
    ]).then(([profileRes, addrRes]) => {
      const p = profileRes.data;
      setProfile(p);
      setProfileForm({ name: p.name || '', email: p.email || '' });
      setAddresses(addrRes.data || []);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setError('');
    try {
      await api.put('/profile', profileForm);
      setProfile((prev) => ({ ...prev, ...profileForm }));
      setEditingProfile(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setError('');
    try {
      const { data } = await api.post('/addresses', newAddress);
      setAddresses([...addresses, data]);
      setNewAddress({ fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false });
      setShowAddAddress(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">👤 My Profile</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {/* Account Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">Account Details</h2>
          {!editingProfile && (
            <button onClick={() => setEditingProfile(true)}
              className="text-sm text-green-700 hover:text-green-900 font-semibold">
              ✏️ Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input value={profile.phone} disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleProfileSave} disabled={savingProfile}
                className="bg-green-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50">
                {savingProfile ? 'Saving...' : '💾 Save'}
              </button>
              <button onClick={() => { setEditingProfile(false); setProfileForm({ name: profile.name, email: profile.email }); }}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{profile.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{profile.phone}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{profile.email || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">📍 Saved Addresses</h2>
          <button onClick={() => setShowAddAddress(!showAddAddress)}
            className="text-sm bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition">
            {showAddAddress ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="bg-green-50 rounded-lg p-4 mb-4 space-y-3">
            <h3 className="font-semibold text-green-800">New Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Full Name" required value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              <input placeholder="Phone" required value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <input placeholder="Address Line (Street, Area, Landmark)" required value={newAddress.addressLine}
              onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="City" required value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
              <select required value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select State</option>
                {DELIVERY_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
              <input placeholder="Pincode" required value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                className="w-4 h-4" />
              Set as default address
            </label>
            <button type="submit" disabled={savingAddress}
              className="bg-green-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50">
              {savingAddress ? 'Saving...' : '💾 Save Address'}
            </button>
          </form>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No saved addresses yet. Add one above!</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className={`p-4 rounded-lg border-2 ${addr.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{addr.fullName}</p>
                      {addr.isDefault && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{addr.addressLine}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
                  </div>
                  <button onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
