import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useSeason } from '../../context/SeasonContext';
import Loader from '../../components/common/Loader';

function ProductCard({ p, seasonActive }) {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const cartItem = items.find((i) => i.id === p.id);
  const qty = cartItem?.quantity || 0;
  const price = p.effectivePrice || p.salePrice || p.originalPrice;
  const canOrder = seasonActive && p.inStock;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, p.minOrderKg || 1);
  };
  const handleInc = (e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(p.id, qty + 1); };
  const handleDec = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (qty <= (p.minOrderKg || 1)) removeFromCart(p.id);
    else updateQuantity(p.id, qty - 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, p.minOrderKg || 1);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      <Link to={`/products/${p.id}`} className="group">
        <div className="h-48 bg-yellow-50 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform relative overflow-hidden">
          {p.image ? (
            <img
              src={`data:image/jpeg;base64,${p.image}`}
              alt={p.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>🥭</span>
          )}
          {p.onSale && seasonActive && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">SALE</span>
          )}
          {p.special && seasonActive && (
            <span className={`absolute top-2 ${p.onSale ? 'left-16' : 'left-2'} bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold`}>⭐ SPECIAL</span>
          )}
          {!seasonActive && (
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">SEASON CLOSED</span>
          )}
        </div>
        <div className="p-4 pb-2">
          <h3 className="font-semibold text-green-800 text-lg">{p.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{p.description?.substring(0, 60)}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {p.onSale && seasonActive ? (
                <>
                  <span className="text-lg font-bold text-green-700">₹{p.salePrice}</span>
                  <span className="text-sm text-gray-400 line-through">₹{p.originalPrice}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-green-700">₹{p.originalPrice}</span>
              )}
              <span className="text-sm text-gray-500">/ kg</span>
            </div>
            {p.minOrderKg > 1 && (
              <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Min: {p.minOrderKg} kg
              </span>
            )}
          </div>
          {!p.inStock && seasonActive && (
            <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Out of Stock</span>
          )}
        </div>
      </Link>

      {/* Qty selector + add to cart */}
      <div className="p-4 pt-2 mt-auto">
        {!canOrder ? (
          <div className="text-center text-sm text-gray-400 font-semibold py-2">
            {!seasonActive ? '⏳ Season Closed' : 'Out of Stock'}
          </div>
        ) : qty === 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-bold hover:bg-green-100 transition text-sm flex items-center justify-center gap-1"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-yellow-400 text-green-900 py-2 rounded-lg font-bold hover:bg-yellow-300 transition text-sm flex items-center justify-center gap-1"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Qty Controller */}
            <div className="flex items-center justify-between bg-green-50 rounded-lg p-1 border border-green-100">
              <button onClick={handleDec} className="w-8 h-8 rounded-md bg-white text-green-700 font-bold hover:bg-green-100 shadow-sm transition">−</button>
              <div className="text-center px-2">
                <span className="block text-green-900 font-bold leading-tight">{qty} kg</span>
                <span className="block text-[10px] text-green-600 font-medium">in cart</span>
              </div>
              <button onClick={handleInc} className="w-8 h-8 rounded-md bg-white text-green-700 font-bold hover:bg-green-100 shadow-sm transition">+</button>
            </div>

            {/* Total & Buy Now */}
            <div className="flex items-center gap-2">
              <div className="text-center px-2 flex-1">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</span>
                <div className="text-green-700 font-bold text-lg leading-none">₹{(price * qty).toFixed(0)}</div>
              </div>
              <button
                onClick={handleBuyNow}
                className="flex-[2] bg-yellow-400 text-green-900 py-2 rounded-lg font-bold hover:bg-yellow-300 transition text-sm shadow-sm"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { seasonActive } = useSeason();

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Our Mangoes</h1>

      {!seasonActive && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center">
          ⏳ Mango season is currently closed. You can browse our products but ordering is disabled.
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🥭</p>
          <p className="text-lg">No products available right now. Check back during mango season!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} p={p} seasonActive={seasonActive} />)}
        </div>
      )}
    </div>
  );
}
