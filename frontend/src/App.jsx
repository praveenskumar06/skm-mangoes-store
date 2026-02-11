import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SeasonProvider } from './context/SeasonContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/store/Home';
import Products from './pages/store/Products';
import ProductDetail from './pages/store/ProductDetail';
import Cart from './pages/store/Cart';
import Checkout from './pages/store/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import Settings from './pages/admin/Settings';

import AboutUs from './pages/info/AboutUs';
import FAQ from './pages/info/FAQ';
import ContactUs from './pages/info/ContactUs';
import MangoTips from './pages/info/MangoTips';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SeasonProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/about" element={<AboutUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/mango-tips" element={<MangoTips />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><Orders /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
        </SeasonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
