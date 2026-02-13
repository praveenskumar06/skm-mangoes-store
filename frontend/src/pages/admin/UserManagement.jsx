import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Users</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.id}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.phone || '—'}</td>
                <td className="p-3 text-gray-500">{u.email || '—'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="p-3 text-gray-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
