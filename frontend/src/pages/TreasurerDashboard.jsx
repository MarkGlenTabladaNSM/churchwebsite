import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, History, Download, Activity } from 'lucide-react';
import { api } from '../api/axios';

export default function TreasurerDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 });
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const filteredTransactions = transactions.filter(t => {
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;
    return true;
  });

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Description,Type,Amount\n";
    filteredTransactions.forEach(t => {
      const amount = t.type === 'income' ? t.amount : `-${t.amount}`;
      csvContent += `${t.date},"${t.description}",${t.type},${amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transaction_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Treasurer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><DollarSign size={20}/> Available Balance</div>
           <div className={`text-3xl font-bold ${balance.balance >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}`}>
              ${parseFloat(balance.balance || 0).toLocaleString()}
           </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><Activity size={20} className="text-green-500 dark:text-green-400"/> Total Income</div>
           <div className="text-3xl font-bold text-green-600 dark:text-green-500">${parseFloat(balance.income || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><Activity size={20} className="text-red-500 dark:text-red-400"/> Total Expenses</div>
           <div className="text-3xl font-bold text-red-500 dark:text-red-400">${parseFloat(balance.expenses || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-800 pb-3">New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={type === 'income'} onChange={() => setType('income')} name="type" className="text-green-600 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700" /> 
                    <span className="text-green-700 dark:text-green-400 font-medium">Income</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={type === 'expense'} onChange={() => setType('expense')} name="type" className="text-red-600 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700" />
                    <span className="text-red-700 dark:text-red-400 font-medium">Expense</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <button type="submit" className={`w-full text-white font-medium py-2 rounded-md ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Add {type === 'income' ? 'Income' : 'Expense'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center self-start lg:self-auto">
                <History className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Transaction History</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md p-1.5 text-sm flex-1 lg:flex-none max-w-[140px] focus:ring-blue-500 focus:border-blue-500"
                  title="Start Date"
                />
                <span className="text-gray-500 dark:text-gray-400 text-sm">to</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md p-1.5 text-sm flex-1 lg:flex-none max-w-[140px] focus:ring-blue-500 focus:border-blue-500"
                  title="End Date"
                />
                <button 
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white p-1.5 px-4 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition flex-1 lg:flex-none shadow-sm"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-3 border-b dark:border-gray-800">Date</th>
                    <th className="px-6 py-3 border-b dark:border-gray-800">Description</th>
                    <th className="px-6 py-3 border-b dark:border-gray-800">Type</th>
                    <th className="px-6 py-3 border-b dark:border-gray-800 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{t.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{t.description}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400'}`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                     <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No transactions found.</td></tr>
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
