import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ADMIN, DEMO_USER, GOOGLE_CLIENT_ID } from '../../constants';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleResponse = useCallback(async (response) => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLogin(response.credential);
      navigate(data.role === 'ROLE_ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }, [googleLogin, navigate]);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
      );
    }
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(phone, password);
      navigate(data.role === 'ROLE_ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-5xl">🥭</span>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Welcome Back</h1>
          <p className="text-gray-500">Login to SKM Mangoes</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">or</span>
          </div>
        </div>

        <div id="google-signin-btn" className="flex justify-center"></div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-700 font-semibold hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-500">
          <p className="font-semibold mb-1">Demo Accounts:</p>
          <p>Admin: {DEMO_ADMIN.phone} / {DEMO_ADMIN.password}</p>
          <p>User: {DEMO_USER.phone} / {DEMO_USER.password}</p>
        </div>
      </div>
    </div>
  );
}
