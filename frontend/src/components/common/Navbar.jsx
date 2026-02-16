import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { STORE_NAME } from '../../constants';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isHome = location.pathname === '/';
  const isOnAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setProfileOpen(false); setMenuOpen(false); }, [location.pathname]);

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🥭</span>
          <span>{STORE_NAME}</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/products" className="hover:text-yellow-300 transition">Products</Link>
          <Link to="/mango-tips" className="hover:text-yellow-300 transition">Mango Tips</Link>
          <Link to="/about" className="hover:text-yellow-300 transition">About</Link>
          <Link to="/faq" className="hover:text-yellow-300 transition">FAQ</Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link>

          {/* Cart button - visible for guests and non-admin users */}
          {!isAdmin && (
            <Link to="/cart" className="relative group flex items-center gap-1 bg-yellow-500 text-green-900 px-3 py-1.5 rounded-full font-bold hover:bg-yellow-400 transition-all hover:scale-105">
              <span className="text-xl">🛒</span>
              <span className="text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="hover:text-yellow-300 transition">Admin</Link>
              ) : null}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 bg-yellow-500 text-green-900 w-9 h-9 rounded-full font-bold hover:bg-yellow-400 transition-all hover:scale-105 justify-center">
                  <span className="text-lg">👤</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>
                    {!isAdmin && (
                      <>
                        <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition">
                          📦 My Orders
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition">
                          ⚙️ Profile
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
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

      {/* Mobile side panel backdrop */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile side panel (slides from right) */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header — same green as navbar */}
        <div className="flex items-center justify-between px-5 py-4 bg-green-800">
          <span className="text-lg font-bold text-white">🥭 {STORE_NAME}</span>
          <button onClick={() => setMenuOpen(false)} className="text-2xl text-green-300 hover:text-white">
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-1 text-gray-700">
          {isOnAdminPage ? (
            <>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Admin Panel</p>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">📊 Dashboard</Link>
              <Link to="/admin/products" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">🥭 Products</Link>
              <Link to="/admin/orders" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">📦 Orders</Link>
              <Link to="/admin/users" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">👥 Users</Link>
              <Link to="/admin/settings" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">⚙️ Settings</Link>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Store</p>
                <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">🏠 Home</Link>
                <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">🛍️ Shop Products</Link>
              </div>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">Home</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">Products</Link>
              <Link to="/mango-tips" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">Mango Tips</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">About</Link>
              <Link to="/faq" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">FAQ</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">Contact</Link>

              {!isAdmin && (
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 bg-yellow-500 text-green-900 px-3 py-2 rounded-lg font-bold hover:bg-yellow-400 transition mt-2">
                  <span className="text-lg">🛒</span> Cart
                  {totalItems > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">🛠️ Admin Panel</Link>
              )}
            </>
          )}

          {/* User info + logout / login */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            {user ? (
              <>
                <p className="text-xs text-gray-500 mb-2">👤 {user.name}</p>
                {!isAdmin && !isOnAdminPage && (
                  <>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">📦 My Orders</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 transition">⚙️ Profile</Link>
                  </>
                )}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-red-600 font-semibold mt-2 py-2 px-3 rounded-lg hover:bg-red-50 transition">
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-green-700 font-semibold py-2 px-3 rounded-lg hover:bg-green-50 transition">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Back button bar - shown on all pages except home */}
      {!isHome && (
        <div className="bg-green-700/80 border-t border-green-600">
          <div className="max-w-7xl mx-auto px-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-green-100 hover:text-yellow-300 py-1.5 transition"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
