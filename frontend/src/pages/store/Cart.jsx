import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSeason } from '../../context/SeasonContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { seasonActive } = useSeason();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious mangoes!</p>
        <Link
          to="/products"
          className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          return (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="text-4xl">🥭</div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">{item.name}</h3>
                <p className="text-green-700 font-bold">₹{item.effectivePrice || item.originalPrice} / kg</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => {
                      const minQty = item.minOrderKg || 1;
                      if (item.quantity - 1 < minQty) return;
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    className={`px-3 py-1 ${item.quantity <= (item.minOrderKg || 1) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  >−</button>
                  <span className="px-3 py-1 font-semibold">{item.quantity} kg</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >+</button>
                </div>
                <span className="text-xs text-gray-400 mt-1">Min: {item.minOrderKg || 1} kg</span>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-green-700">₹{(item.effectivePrice || item.originalPrice) * item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-600 text-xl"
              >×</button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Total</span>
          <span className="text-green-700">₹{totalPrice}</span>
        </div>
        {!seasonActive ? (
          <div>
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-center mb-3">
              ⏳ Mango season is currently closed. Ordering is disabled.
            </div>
            <button onClick={clearCart} className="w-full text-center text-gray-500 hover:text-red-600 text-sm font-semibold">
              Clear Cart
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/products"
              className="flex-1 block text-center border-2 border-green-700 text-green-700 py-3 rounded-lg font-bold hover:bg-green-50 transition"
            >
              ← Continue Shopping
            </Link>
            <Link
              to="/checkout"
              className="flex-1 block text-center bg-yellow-400 text-green-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

