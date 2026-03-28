import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Activity, DollarSign, Trash2 } from 'lucide-react';
import { api } from '../api/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/users').then(res => setUsers(res.data)).catch(console.error);
      api.get('/logs').then(res => setLogs(res.data)).catch(console.error);
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="p-8 justify-center flex text-red-600 font-bold">Access Denied: Admins Only</div>;
  }

  const handleDelete = (id) => {
     // Optional: implement user deletion
     setUsers(users.filter(u => u.id !== id));
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (e) {
      console.error(e);
      alert("Failed to update role");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24} /></div>
          <div><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><Activity size={24} /></div>
          <div><p className="text-sm text-gray-500">System Logs</p><p className="text-2xl font-bold">{logs.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600"><DollarSign size={24} /></div>
          <div><p className="text-sm text-gray-500">Finances</p><p className="text-xl font-bold text-gray-400">View Treasurer</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-10">
        <div className="px-6 py-4 border-b bg-gray-50"><h2 className="text-lg font-semibold text-gray-800">User Management</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md shadow-sm bg-white border p-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                     <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 p-1 rounded transition">
                       <Trash2 size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50"><h2 className="text-lg font-semibold text-gray-800">Recent System Logs</h2></div>
        <ul className="divide-y divide-gray-100 px-6">
           {logs.map((log) => (
              <li key={log.id} className="py-4 text-sm">
                 <span className="font-semibold">{log.user?.name || 'System'}</span> did action: <span className="text-blue-600 font-mono">{log.action}</span> - {log.description} <span className="text-gray-400 text-xs ml-3">{new Date(log.created_at).toLocaleString()}</span>
              </li>
           ))}
           {logs.length === 0 && <li className="py-4 text-gray-500">No logs yet.</li>}
        </ul>
      </div>
    </div>
  );
}
