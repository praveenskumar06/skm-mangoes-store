import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSeason } from '../../context/SeasonContext';
import Loader from '../../components/common/Loader';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { seasonActive } = useSeason();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const effectivePrice = product.effectivePrice || product.originalPrice;
  const isOnSale = product.onSale;
  const inStock = product.inStock;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/products')}
        className="text-green-700 hover:underline mb-4 inline-block"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-yellow-50 flex items-center justify-center text-9xl py-16 min-h-[400px]">
          {product.image ? (
            <img
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover max-h-[500px]"
            />
          ) : (
            <span>🥭</span>
          )}
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-1">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-green-700">₹{effectivePrice}</span>
            {isOnSale && (
              <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-gray-500">/ kg</span>
          </div>

          {isOnSale && (
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              🏷️ {Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
            </span>
          )}

          <div className="mb-4">
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? `✅ In Stock (${product.stockKg} kg available)` : '❌ Out of Stock'}
            </span>
          </div>

          <div className="mb-4 text-sm text-gray-500">
            Min order: {product.minOrderKg} kg
          </div>

          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Details</h3>
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {inStock && seasonActive ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQty(Math.max(product.minOrderKg || 1, qty - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >−</button>
                <span className="px-4 py-2 font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stockKg, qty + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${added
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-400 text-green-900 hover:bg-yellow-300'
                  }`}
              >
                {added ? '✅ Added!' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  addToCart(product, qty);
                  navigate('/checkout');
                }}
                className="flex-1 py-2 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                ⚡ Buy Now
              </button>
            </div>
          ) : !seasonActive ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-center font-semibold">
              ⏳ Mango season is currently closed
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
