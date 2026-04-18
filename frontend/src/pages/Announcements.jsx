import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const fetchAnnouncements = () => {
     api.get('/announcements').then(res => setAnnouncements(res.data)).catch(console.error);
  };

  useEffect(() => {
     fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
     e.preventDefault();
     try {
       await api.post('/announcements', { title, content, date });
       fetchAnnouncements();
       setTitle(''); setContent(''); setDate('');
     } catch (err) {
       alert("Error creating announcement");
     }
  };

  const handleDelete = async (id) => {
     try {
       await api.delete(`/announcements/${id}`);
       fetchAnnouncements();
     } catch (err) {
       alert("Error deleting");
     }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 transition-colors duration-200">
      <h1 className="text-4xl font-bold mb-10 text-center dark:text-white">Church Announcements</h1>
      
      {user?.role === 'admin' && (
         <div className="mb-12 bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 shadow-sm">
           <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Announcement (Admin Only)</h2>
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} required className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
              <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 p-2 rounded col-span-full focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white p-2 rounded font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors col-span-full">Post Announcement</button>
           </form>
         </div>
      )}

      <div className="space-y-6">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white dark:bg-gray-900 border-l-4 border-blue-600 rounded-r-xl p-6 shadow-sm border border-gray-100 dark:border-transparent dark:border-l-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{a.title}</h3>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{a.date}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{a.content}</p>
            {user?.role === 'admin' && (
                 <button onClick={() => handleDelete(a.id)} className="mt-4 text-red-600 dark:text-red-400 font-bold hover:underline transition-colors">
                    Delete
                 </button>
            )}
          </div>
        ))}
        {announcements.length === 0 && <p className="text-center py-10 text-gray-500 dark:text-gray-400">There are no recent announcements.</p>}
      </div>
    </div>
  );
}
