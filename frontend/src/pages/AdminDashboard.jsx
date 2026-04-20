import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Activity, DollarSign, Trash2 } from 'lucide-react';
import { api } from '../api/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [balanceData, setBalanceData] = useState({ income: 0, expenses: 0, balance: 0});
  
  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/users').then(res => setUsers(res.data)).catch(console.error);
      api.get('/logs').then(res => setLogs(res.data)).catch(console.error);
      api.get('/transactions/balance').then(res => setBalanceData(res.data)).catch(console.error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><DollarSign size={20}/> Available Balance</div>
           <div className={`text-3xl font-bold ${balanceData.balance >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}`}>
              ${parseFloat(balanceData.balance || 0).toLocaleString()}
           </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><Activity size={20} className="text-green-500 dark:text-green-400"/> Total Income</div>
           <div className="text-3xl font-bold text-green-600 dark:text-green-500">${parseFloat(balanceData.income || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><Activity size={20} className="text-red-500 dark:text-red-400"/> Total Expenses</div>
           <div className="text-3xl font-bold text-red-500 dark:text-red-400">${parseFloat(balanceData.expenses || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400"><Users size={24} /></div>
          <div><p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p><p className="text-2xl font-bold dark:text-white">{users.length}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400"><Activity size={24} /></div>
          <div><p className="text-sm text-gray-500 dark:text-gray-400">System Logs</p><p className="text-2xl font-bold dark:text-white">{logs.length}</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden mb-10">
        <div className="px-6 py-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"><h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Management</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-sm border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border p-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="pastor">Pastor</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                     <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition">
                       <Trash2 size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"><h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent System Logs</h2></div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800 px-6">
           {logs.map((log) => (
              <li key={log.id} className="py-4 text-sm dark:text-gray-300">
                 <span className="font-semibold">{log.user?.name || 'System'}</span> did action: <span className="text-blue-600 dark:text-blue-400 font-mono">{log.action}</span> - {log.description} <span className="text-gray-400 dark:text-gray-500 text-xs ml-3">{new Date(log.created_at).toLocaleString()}</span>
              </li>
           ))}
           {logs.length === 0 && <li className="py-4 text-gray-500 dark:text-gray-400">No logs yet.</li>}
        </ul>
      </div>
    </div>
  );
}
