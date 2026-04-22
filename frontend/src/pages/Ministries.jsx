import { useState, useEffect } from 'react';
import { Users, Mail, User, Trash2, Plus } from 'lucide-react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchMinistries = async () => {
    try {
      const res = await api.get('/ministries');
      setMinistries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ministries', {
        name,
        description,
        leader_name: leaderName,
        contact_email: contactEmail,
        image_url: imageUrl
      });
      fetchMinistries();
      // Reset form
      setName(''); setDescription(''); setLeaderName(''); setContactEmail(''); setImageUrl('');
      alert("Ministry added successfully!");
    } catch (err) {
      alert("Error adding ministry");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ministry?")) return;
    try {
      await api.delete(`/ministries/${id}`);
      fetchMinistries();
    } catch (err) {
      alert("Error deleting ministry");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen transition-colors duration-200">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Ministries</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover the different ways you can get involved, grow in your faith, and serve our community.</p>
      </div>

      {(user?.role === 'admin' || user?.role === 'pastor') && (
        <div className="mb-16 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Create New Ministry</h2>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Ministry Name</label>
              <input type="text" placeholder="e.g., Youth Ministry" value={name} onChange={e=>setName(e.target.value)} required className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Leader Name</label>
              <input type="text" placeholder="e.g., Jane Doe" value={leaderName} onChange={e=>setLeaderName(e.target.value)} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Contact Email</label>
              <input type="email" placeholder="youth@church.com" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Image URL</label>
              <input type="url" placeholder="https://..." value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Description</label>
              <textarea placeholder="Describe the purpose and activities of this ministry..." value={description} onChange={e=>setDescription(e.target.value)} required rows="4" className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20">
              Create Ministry
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ministries.map((m) => (
            <div key={m.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={m.image_url || `https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80`} 
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{m.name}</h3>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                  {m.description}
                </p>

                <div className="space-y-4 pt-6 border-t dark:border-gray-800">
                  {m.leader_name && (
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                        <User size={16} />
                      </div>
                      <span className="text-gray-500 dark:text-gray-500 mr-2">Leader:</span> {m.leader_name}
                    </div>
                  )}
                  {m.contact_email && (
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                        <Mail size={16} />
                      </div>
                      <a href={`mailto:${m.contact_email}`} className="hover:text-blue-600 transition-colors underline decoration-blue-500/30 underline-offset-4">{m.contact_email}</a>
                    </div>
                  )}
                </div>

                {(user?.role === 'admin' || user?.role === 'pastor') && (
                  <button onClick={() => handleDelete(m.id)} className="mt-8 flex items-center justify-center gap-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors py-2 px-4 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-bold">
                    <Trash2 size={16} /> Delete Ministry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ministries.length === 0 && !loading && (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border-2 border-dashed dark:border-gray-800">
          <Users size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-6" />
          <h3 className="text-2xl font-bold dark:text-white mb-2">No ministries yet</h3>
          <p className="text-gray-500 dark:text-gray-400">We are currently organizing our ministries. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
