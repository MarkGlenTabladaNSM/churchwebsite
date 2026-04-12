import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProjectPlans() {
  const [plans, setPlans] = useState([]);
  const { user } = useAuth();
  
  // Creation form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  // Add Amount form state
  const [amountInputs, setAmountInputs] = useState({});

  const fetchPlans = () => {
     api.get('/project-plans').then(res => setPlans(res.data)).catch(console.error);
  };

  useEffect(() => {
     fetchPlans();
  }, []);

  const handleCreate = async (e) => {
     e.preventDefault();
     try {
       await api.post('/project-plans', {
           title,
           description,
           target_amount: targetAmount
       });
       fetchPlans();
       setTitle(''); setDescription(''); setTargetAmount('');
     } catch (err) {
       alert("Error creating project plan");
     }
  };

  const handleAddAmount = async (e, id) => {
     e.preventDefault();
     const amount = amountInputs[id];
     if (!amount || amount <= 0) return;
     
     try {
       await api.put(`/project-plans/${id}/add-amount`, { amount: parseFloat(amount) });
       fetchPlans();
       setAmountInputs({ ...amountInputs, [id]: '' });
     } catch (err) {
       alert("Error adding amount");
     }
  };

  // Users who can manage plans
  const canManagePlans = user?.role === 'treasurer' || user?.role === 'admin' || user?.role === 'pastor';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Church Project Plans</h1>
      
      {canManagePlans && (
         <div className="mb-12 bg-white p-6 rounded-xl border shadow-sm">
           <h2 className="text-xl font-bold mb-4">Create New Project Plan</h2>
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Project Title" value={title} onChange={e=>setTitle(e.target.value)} required className="border p-2 rounded" />
              <input type="number" placeholder="Target Amount" value={targetAmount} onChange={e=>setTargetAmount(e.target.value)} required min="1" className="border p-2 rounded" />
              <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required className="border p-2 rounded col-span-full md:col-span-1" />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 col-span-full md:col-span-3">Create Project</button>
           </form>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((p) => {
          const target = parseFloat(p.target_amount);
          const current = parseFloat(p.current_amount);
          const percent = target > 0 ? Math.min((current / target) * 100, 100).toFixed(2) : 0;
          
          return (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col p-6">
              <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
              <p className="text-gray-700 flex-1 mb-6">{p.description}</p>
              
              <div className="mb-4">
                 <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>${current.toLocaleString()} Raised</span>
                    <span className="text-gray-500">Target: ${target.toLocaleString()}</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                 </div>
              <div className="text-right text-xs mt-1 text-gray-500">{percent}% Achieved</div>
              </div>

              {canManagePlans && (
                 <form onSubmit={(e) => handleAddAmount(e, p.id)} className="mt-4 flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Amount to add" 
                      value={amountInputs[p.id] || ''} 
                      onChange={(e) => setAmountInputs({...amountInputs, [p.id]: e.target.value})} 
                      required 
                      min="1" 
                      step="0.01"
                      className="border p-2 rounded flex-1" 
                    />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700">Add Funds</button>
                 </form>
              )}
            </div>
          );
        })}
        {plans.length === 0 && <p className="text-center w-full col-span-full py-10 text-gray-500">There are no project plans active.</p>}
      </div>
    </div>
  );
}
