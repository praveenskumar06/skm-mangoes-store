import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', originalPrice: '',
    salePrice: '', stockKg: '', minOrderKg: '1', attributes: {},
  });
  const [error, setError] = useState('');

  const loadProducts = () => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const resetForm = () => {
    setForm({ name: '', description: '', originalPrice: '', salePrice: '', stockKg: '', minOrderKg: '1', attributes: {} });
    setEditing(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, description: p.description || '',
      originalPrice: p.originalPrice, salePrice: p.salePrice || '',
      stockKg: p.stockKg, minOrderKg: p.minOrderKg || '1', attributes: p.attributes || {},
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      originalPrice: parseFloat(form.originalPrice),
      salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      stockKg: parseFloat(form.stockKg),
      minOrderKg: parseFloat(form.minOrderKg),
    };
    try {
      if (editing) {
        await api.put(`/admin/products/${editing}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      resetForm();
      setLoading(true);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Products</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <h2 className="text-xl font-semibold">{editing ? 'Edit Product' : 'New Product'}</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Product Name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Original Price (₹/kg)" type="number" step="0.01" required value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Sale Price (optional)" type="number" step="0.01" value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Stock (kg)" type="number" step="0.1" required value={form.stockKg}
              onChange={(e) => setForm({ ...form, stockKg: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Min Order (kg)" type="number" step="0.1" value={form.minOrderKg}
              onChange={(e) => setForm({ ...form, minOrderKg: e.target.value })}
              className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <textarea placeholder="Description" value={form.description} rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
          <button type="submit" className="bg-yellow-400 text-green-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-right p-3">Price</th>
              <th className="text-right p-3">Sale</th>
              <th className="text-right p-3">Stock (kg)</th>
              <th className="text-center p-3">Active</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-right">₹{p.originalPrice}</td>
                <td className="p-3 text-right">{p.salePrice ? `₹${p.salePrice}` : '—'}</td>
                <td className="p-3 text-right">
                  <span className={p.inStock ? 'text-green-600' : 'text-red-600'}>{p.stockKg}</span>
                </td>
                <td className="p-3 text-center">{p.active ? '✅' : '❌'}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
