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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Church Announcements</h1>
      
      {user?.role === 'admin' && (
         <div className="mb-12 bg-white p-6 rounded-xl border shadow-sm">
           <h2 className="text-xl font-bold mb-4">Add New Announcement (Admin Only)</h2>
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required className="border p-2 rounded" />
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} required className="border p-2 rounded" />
              <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required className="border p-2 rounded col-span-full" />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 col-span-full">Post Announcement</button>
           </form>
         </div>
      )}

      <div className="space-y-6">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white border-l-4 border-blue-600 rounded-r-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{a.title}</h3>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{a.date}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{a.content}</p>
            {user?.role === 'admin' && (
                 <button onClick={() => handleDelete(a.id)} className="mt-4 text-red-600 font-bold hover:underline">
                    Delete
                 </button>
            )}
          </div>
        ))}
        {announcements.length === 0 && <p className="text-center py-10 text-gray-500">There are no recent announcements.</p>}
      </div>
    </div>
  );
}
