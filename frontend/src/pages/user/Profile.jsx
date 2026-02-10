import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

export default function Profile() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/addresses')
      .then(({ data }) => setAddresses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Account Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium">{user?.phone}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Role</span>
            <span className="font-medium">{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses yet.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold">{addr.fullName}</p>
                <p className="text-sm text-gray-600">
                  {addr.addressLine}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm text-gray-500">📞 {addr.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
