import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🥭</span>
          <span>SKM Mangoes</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/products" className="hover:text-yellow-300 transition">
            Products
          </Link>

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="hover:text-yellow-300 transition">
                  Admin
                </Link>
              ) : (
                <>
                  <Link to="/cart" className="relative hover:text-yellow-300 transition">
                    🛒
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-3 bg-yellow-400 text-green-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className="hover:text-yellow-300 transition">
                    Orders
                  </Link>
                  <Link to="/profile" className="hover:text-yellow-300 transition">
                    Profile
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-yellow-500 text-green-900 px-3 py-1 rounded font-semibold hover:bg-yellow-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-500 text-green-900 px-3 py-1 rounded font-semibold hover:bg-yellow-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
