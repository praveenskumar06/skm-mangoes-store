import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useSeason } from '../../context/SeasonContext';
import Loader from '../../components/common/Loader';

function ProductCard({ p, seasonActive }) {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
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

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      <Link to={`/products/${p.id}`} className="group">
        <div className="h-48 bg-yellow-50 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform relative">
          🥭
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
          <button
            onClick={handleAdd}
            className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Add to Cart ({p.minOrderKg || 1} kg)
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <button onClick={handleDec} className="w-9 h-9 rounded-full bg-green-100 text-green-800 font-bold text-lg hover:bg-green-200 transition">−</button>
              <span className="text-lg font-bold text-green-800 min-w-[50px] text-center">{qty} kg</span>
              <button onClick={handleInc} className="w-9 h-9 rounded-full bg-green-100 text-green-800 font-bold text-lg hover:bg-green-200 transition">+</button>
            </div>
            <div className="text-center text-green-700 font-bold text-lg">
              ₹{(price * qty).toFixed(0)}
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
      .catch(() => {})
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
