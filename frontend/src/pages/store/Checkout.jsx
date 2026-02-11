import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useSeason } from '../../context/SeasonContext';
import { DELIVERY_ZONES } from '../../constants';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { seasonActive } = useSeason();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', addressLine: '',
    city: '', state: 'Tamil Nadu', pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) { navigate('/cart'); return; }
    if (seasonActive === false) { navigate('/cart'); return; }
    setAddressLoading(true);
    api.get('/addresses').then(({ data }) => {
      const list = Array.isArray(data) ? data : [];
      setAddresses(list);
      if (list.length > 0) setSelectedAddress(list[0].id);
      else setShowNewAddress(true);
    }).catch((err) => {
      setError('Failed to load addresses. Please try again.');
      setShowNewAddress(true);
    }).finally(() => setAddressLoading(false));
  }, [items.length, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/addresses', newAddress);
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      setShowNewAddress(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { setError('Please select a delivery address'); return; }
    setError('');
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.id,
        quantityKg: i.quantity,
      }));
      await api.post('/orders', { addressId: selectedAddress, items: orderItems });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Checkout</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Address */}
        <div>
          <h2 className="text-xl font-semibold text-green-800 mb-4">Delivery Address</h2>

          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`block p-4 mb-3 border-2 rounded-lg cursor-pointer transition ${
                selectedAddress === addr.id ? 'border-green-600 bg-green-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="mr-2"
              />
              <span className="font-semibold">{addr.fullName}</span>
              <p className="text-sm text-gray-600 mt-1">
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm text-gray-500">📞 {addr.phone}</p>
            </label>
          ))}

          {!showNewAddress ? (
            <button
              onClick={() => setShowNewAddress(true)}
              className="text-green-700 font-semibold hover:underline"
            >
              + Add new address
            </button>
          ) : (
            <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded-lg space-y-3">
              <input
                placeholder="Full Name" required value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Phone" required value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                placeholder="Address" required value={newAddress.addressLine}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="City" required value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                >
                  {DELIVERY_ZONES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <input
                placeholder="Pincode" required value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">
                  Save Address
                </button>
                {addresses.length > 0 && (
                  <button type="button" onClick={() => setShowNewAddress(false)} className="text-gray-500">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-green-800 mb-4">Order Summary</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {items.map((item) => {
              const price = item.effectivePrice || item.originalPrice;
              return (
                <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                  <span>{item.name} × {item.quantity} kg</span>
                  <span className="font-semibold">₹{price * item.quantity}</span>
                </div>
              );
            })}
            <div className="flex justify-between pt-4 text-xl font-bold text-green-700">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full mt-4 bg-yellow-400 text-green-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Free delivery within delivery zones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
