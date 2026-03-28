import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, History } from 'lucide-react';
import { api } from '../api/axios';

export default function TreasurerDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 });
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    if (user?.role === 'treasurer' || user?.role === 'admin') {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = () => {
      api.get('/transactions').then(res => setTransactions(res.data)).catch(console.error);
      api.get('/transactions/balance').then(res => setBalance(res.data)).catch(console.error);
  }

  if (user?.role !== 'treasurer' && user?.role !== 'admin') {
    return <div className="p-8 justify-center flex text-red-600 font-bold">Access Denied: Treasurers Only</div>;
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    try {
        await api.post('/transactions', {
            type,
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString().split('T')[0]
        });
        fetchTransactions();
        setAmount('');
        setDescription('');
    } catch (err) {
        console.error("Failed to add transaction", err);
        alert("Failed to add transaction");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Treasurer Dashboard</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border text-center mb-10">
        <p className="text-gray-500 font-medium tracking-wide">TOTAL AVAILABLE BALANCE</p>
        <p className={`text-5xl font-extrabold mt-3 ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${Number(balance.balance).toFixed(2)}
        </p>
        <div className="mt-4 flex justify-center gap-8 text-sm text-gray-500 border-t pt-4">
           <div>Total Income: <strong className="text-green-600">${Number(balance.income).toFixed(2)}</strong></div>
           <div>Total Expenses: <strong className="text-red-600">${Number(balance.expenses).toFixed(2)}</strong></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={type === 'income'} onChange={() => setType('income')} name="type" className="text-green-600" /> 
                    <span className="text-green-700 font-medium">Income</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={type === 'expense'} onChange={() => setType('expense')} name="type" className="text-red-600" />
                    <span className="text-red-700 font-medium">Expense</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <button type="submit" className={`w-full text-white font-medium py-2 rounded-md ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Add {type === 'income' ? 'Income' : 'Expense'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center">
              <History className="h-5 w-5 mr-2 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.description}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                     <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No transactions recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
