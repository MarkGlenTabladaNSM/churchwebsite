import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import { Calendar, MessageSquare, DollarSign, Activity, FileText } from 'lucide-react';

export default function PastorDashboard() {
  const { user } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balanceData, setBalanceData] = useState({ income: 0, expenses: 0, balance: 0});
  const [plans, setPlans] = useState([]);

  // Form states for Events
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventImage, setEventImage] = useState(null);

  // Form states for Announcements
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceMsg, setAnnounceMsg] = useState('');
  const [announceDate, setAnnounceDate] = useState('');

  const fetchData = async () => {
    try {
      const [evRes, anRes, trRes, balRes, plRes] = await Promise.all([
        api.get('/events'),
        api.get('/announcements'),
        api.get('/transactions'),
        api.get('/transactions/balance'),
        api.get('/project-plans')
      ]);
      setEvents(evRes.data);
      setAnnouncements(anRes.data);
      setTransactions(trRes.data);
      setBalanceData(balRes.data);
      setPlans(plRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Events actions
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', eventTitle);
      formData.append('description', eventDesc);
      formData.append('date', eventDate);
      if (eventImage) formData.append('image', eventImage);
      
      // Let Axios handle Content-Type for FormData automatically
      await api.post('/events', formData);
      fetchData();
      setEventTitle(''); setEventDate(''); setEventDesc(''); setEventImage(null); setShowEventForm(false);
    } catch (err) { alert("Error creating event"); }
  };

  const handleDeleteEvent = async (id) => {
    if(!window.confirm("Delete event?")) return;
    try { await api.delete(`/events/${id}`); fetchData(); } catch(err) { alert("Error deleting event"); }
  };

  // Announcements actions
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', { title: announceTitle, content: announceMsg, date: announceDate });
      fetchData();
      setAnnounceTitle(''); setAnnounceMsg(''); setAnnounceDate(''); setShowAnnounceForm(false);
    } catch (err) { alert("Error creating announcement"); }
  };

  const handleDeleteAnnouncement = async (id) => {
     if(!window.confirm("Delete announcement?")) return;
     try { await api.delete(`/announcements/${id}`); fetchData(); } catch(err) { alert("Error deleting announcement"); }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="flex justify-between items-center mb-10">
           <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pastor Dashboard</h1>
           <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1 px-3 rounded-full font-medium text-sm">Welcome, Pastor</span>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><DollarSign size={20}/> Available Balance</div>
             <div className={`text-3xl font-bold ${balanceData.balance >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}`}>
                ${parseFloat(balanceData.balance).toLocaleString()}
             </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><Activity size={20} className="text-green-500 dark:text-green-400"/> Total Income</div>
             <div className="text-3xl font-bold text-green-600 dark:text-green-500">${parseFloat(balanceData.income).toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><Activity size={20} className="text-red-500 dark:text-red-400"/> Total Expenses</div>
             <div className="text-3xl font-bold text-red-500 dark:text-red-400">${parseFloat(balanceData.expenses).toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium mb-2"><FileText size={20} className="text-blue-500 dark:text-blue-400"/> Active Plans</div>
             <div className="text-3xl font-bold text-gray-800 dark:text-white">{plans.length}</div>
          </div>
        </div>

        {/* Management & Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Events Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
               <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><Calendar className="text-blue-600 dark:text-blue-400"/> Upcoming Events</h2>
               <button onClick={()=>setShowEventForm(!showEventForm)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">Add Event</button>
            </div>
            
            {showEventForm && (
              <form onSubmit={handleCreateEvent} className="p-6 border-b border-gray-100 dark:border-gray-800 bg-blue-50/30 dark:bg-blue-900/10 grid grid-cols-1 gap-4">
                 <input type="text" placeholder="Title" value={eventTitle} onChange={e=>setEventTitle(e.target.value)} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full" required/>
                 <input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full" required/>
                 <input type="file" onChange={e=>setEventImage(e.target.files[0])} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full bg-white"/>
                 <textarea placeholder="Description" value={eventDesc} onChange={e=>setEventDesc(e.target.value)} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full" required/>
                 <button type="submit" className="bg-green-600 dark:bg-green-700 text-white font-bold py-2 rounded hover:bg-green-700 dark:hover:bg-green-600">Save Event</button>
              </form>
            )}

            <div className="p-6 flex-1 overflow-auto max-h-96">
               {events.map(e => (
                 <div key={e.id} className="mb-4 pb-4 border-b dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg dark:text-white">{e.title}</h3>
                      <button onClick={()=>handleDeleteEvent(e.id)} className="text-red-500 dark:text-red-400 text-sm hover:underline">Delete</button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{e.date}</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{e.description}</p>
                 </div>
               ))}
               {events.length===0 && <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No upcoming events.</p>}
            </div>
          </div>

          {/* Announcements Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
               <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><MessageSquare className="text-purple-600 dark:text-purple-400"/> Announcements</h2>
               <button onClick={()=>setShowAnnounceForm(!showAnnounceForm)} className="bg-purple-600 dark:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 dark:hover:bg-purple-600">Add Announce</button>
            </div>
            
            {showAnnounceForm && (
              <form onSubmit={handleCreateAnnouncement} className="p-6 border-b border-gray-100 dark:border-gray-800 bg-purple-50/30 dark:bg-purple-900/10 grid grid-cols-1 gap-4">
                 <input type="text" placeholder="Title" value={announceTitle} onChange={e=>setAnnounceTitle(e.target.value)} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full" required/>
                 <input type="date" value={announceDate} onChange={e=>setAnnounceDate(e.target.value)} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full" required/>
                 <textarea placeholder="Message content" value={announceMsg} onChange={e=>setAnnounceMsg(e.target.value)} className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded w-full" required/>
                 <button type="submit" className="bg-green-600 dark:bg-green-700 text-white font-bold py-2 rounded hover:bg-green-700 dark:hover:bg-green-600">Broadcast</button>
              </form>
            )}

            <div className="p-6 flex-1 overflow-auto max-h-96">
               {announcements.map(a => (
                 <div key={a.id} className="mb-4 pb-4 border-b dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg dark:text-white">{a.title}</h3>
                      <button onClick={()=>handleDeleteAnnouncement(a.id)} className="text-red-500 dark:text-red-400 text-sm hover:underline">Delete</button>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">{new Date(a.created_at).toLocaleDateString()}</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{a.content}</p>
                 </div>
               ))}
               {announcements.length===0 && <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No announcements.</p>}
            </div>
          </div>

        </div>

        {/* Third Section: Plans and Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Ministry Projects (Plans) */}
           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                 <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">Ministry Projects</h2>
              </div>
              <div className="p-6 overflow-auto max-h-96">
                 {plans.map(p => {
                    const pct = Math.min((parseFloat(p.current_amount) / parseFloat(p.target_amount)) * 100, 100);
                    let status = "Planned";
                    if(pct > 0 && pct < 100) status = "Ongoing";
                    if(pct >= 100) status = "Completed";

                    return (
                      <div key={p.id} className="mb-5 last:mb-0">
                         <div className="flex justify-between font-bold mb-1 dark:text-white">
                            <span>{p.title}</span>
                            <span>${parseFloat(p.target_amount).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span>Status: {status}</span>
                            <span>${parseFloat(p.current_amount).toLocaleString()} Raised</span>
                         </div>
                         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                           <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                         </div>
                      </div>
                    )
                 })}
                 {plans.length === 0 && <p className="text-gray-500 text-sm py-4">No project plans found.</p>}
              </div>
           </div>

           {/* Financial Summary */}
           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                 <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">Recent Transactions Log</h2>
                 <span className="text-xs text-gray-400 dark:text-gray-500">Read-Only</span>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800 hidden md:table-header-group">
                    <tr>
                      <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                      <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Description</th>
                      <th className="p-4 font-medium text-gray-600 dark:text-gray-400 text-right">Amount</th>
                    </tr>
                  </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-900 dark:text-gray-100">
                    {transactions.map(t => (
                      <tr key={t.id} className="border-b dark:border-gray-800 last:border-0 md:table-row flex flex-col md:flex-row p-4 md:p-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                         <td className="p-0 md:p-4 text-gray-500 dark:text-gray-400 mb-1 md:mb-0">{t.date}</td>
                         <td className="p-0 md:p-4 font-medium text-gray-800 dark:text-white mb-2 md:mb-0">
                            {t.description}
                            <span className="md:hidden block text-xs text-gray-400 dark:text-gray-500 capitalize">{t.type}</span>
                         </td>
                         <td className={`p-0 md:p-4 text-right font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}`}>
                            {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                         </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                       <tr><td colSpan="3" className="p-4 text-center text-gray-500 dark:text-gray-400">No transactions recorded.</td></tr>
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
