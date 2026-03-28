import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);

  const fetchEvents = () => {
     api.get('/events').then(res => setEvents(res.data)).catch(console.error);
  };

  useEffect(() => {
     fetchEvents();
  }, []);

  const handleCreate = async (e) => {
     e.preventDefault();
     try {
       const formData = new FormData();
       formData.append('title', title);
       formData.append('description', description);
       formData.append('date', date);
       if (image) {
         formData.append('image', image);
       }
       await api.post('/events', formData, {
         headers: { 'Content-Type': 'multipart/form-data' }
       });
       fetchEvents();
       setTitle(''); setDescription(''); setDate(''); setImage(null);
     } catch (err) {
       alert("Error creating event");
     }
  };

  const handleDelete = async (id) => {
     try {
       await api.delete(`/events/${id}`);
       fetchEvents();
     } catch (err) {
       alert("Error deleting");
     }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Church Events</h1>
      
      {user?.role === 'admin' && (
         <div className="mb-12 bg-white p-6 rounded-xl border shadow-sm">
           <h2 className="text-xl font-bold mb-4">Add New Event (Admin Only)</h2>
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required className="border p-2 rounded" />
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} required className="border p-2 rounded" />
              <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} className="border p-2 rounded" />
              <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required className="border p-2 rounded col-span-full" />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 col-span-full md:col-span-1">Create Event</button>
           </form>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((e) => (
          <div key={e.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <img 
              src={e.image || `https://images.unsplash.com/photo-1544427920-c49ccf08c146?auto=format&fit=crop&w=400&q=80`} 
              alt="Event" className="w-full h-48 object-cover text-transparent" 
            />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold mb-3">{e.title}</h3>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Calendar size={18} className="mr-2 text-blue-600" /> {e.date}
              </div>
              <p className="text-gray-700 flex-1">{e.description}</p>
              
              {user?.role === 'admin' && (
                 <button onClick={() => handleDelete(e.id)} className="mt-4 text-red-600 font-bold border border-red-200 bg-red-50 p-2 rounded w-full hover:bg-red-100">
                    Delete Event
                 </button>
              )}
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-center w-full col-span-full py-10 text-gray-500">There are no events scheduled.</p>}
      </div>
    </div>
  );
}
