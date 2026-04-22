import { useState, useEffect } from 'react';
import { Heart, MessageSquare, User, Trash2, Send, Quote } from 'lucide-react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');

  const fetchTestimonies = async () => {
    try {
      const res = await api.get('/testimonies');
      setTestimonies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies();
    if (user) {
      setAuthorName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/testimonies', {
        author_name: authorName,
        content
      });
      fetchTestimonies();
      setContent('');
      alert("Testimony shared! Praise God.");
    } catch (err) {
      alert("Error sharing testimony");
    }
  };

  const handleAmen = async (id) => {
    try {
      await api.post(`/testimonies/${id}/amen`);
      setTestimonies(prev => prev.map(t => t.id === id ? { ...t, amen_count: t.amen_count + 1 } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimony?")) return;
    try {
      await api.delete(`/testimonies/${id}`);
      fetchTestimonies();
    } catch (err) {
      alert("Error deleting testimony");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen transition-colors duration-200">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-yellow-400 dark:to-amber-500 mb-4">Testimonies Wall</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium italic">"And they overcame him by the blood of the Lamb and by the word of their testimony..." - Rev 12:11</p>
      </div>

      <div className="mb-16 bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 rounded-3xl shadow-xl border border-amber-100 dark:border-amber-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Quote size={80} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
           Share a Praise Report
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
            <input 
              type="text" 
              value={authorName} 
              onChange={e=>setAuthorName(e.target.value)} 
              required 
              className="w-full border-2 border-amber-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:border-amber-500 outline-none transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">What has God done for you?</label>
            <textarea 
              placeholder="Share your story of faith, healing, or provision..." 
              value={content} 
              onChange={e=>setContent(e.target.value)} 
              required 
              rows="4" 
              className="w-full border-2 border-amber-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:border-amber-500 outline-none transition-colors" 
            />
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 text-lg">
            <Send size={20} /> Share Testimony
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {testimonies.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all relative group border-l-8 border-l-amber-400 dark:border-l-amber-600">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">{t.author_name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(t.created_at).toLocaleDateString()} at {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                {(user?.role === 'admin' || user?.role === 'pastor' || user?.id === t.user_id) && (
                  <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              
              <div className="relative mb-8">
                <Quote size={24} className="absolute -left-2 -top-4 text-amber-200 dark:text-amber-800 opacity-50" />
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  {t.content}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleAmen(t.id)} 
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all border border-amber-200 dark:border-amber-900/50"
                >
                  <Heart size={18} fill={t.amen_count > 0 ? "currentColor" : "none"} />
                  Amen! ({t.amen_count})
                </button>
                <div className="text-gray-400 dark:text-gray-600 flex items-center gap-1 text-sm">
                  <MessageSquare size={16} /> 
                  Praise Report
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {testimonies.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed dark:border-gray-800">
          <Heart size={48} className="mx-auto text-amber-200 dark:text-amber-800 mb-4" />
          <h3 className="text-xl font-bold dark:text-white">No testimonies yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to share what God has done in your life!</p>
        </div>
      )}
    </div>
  );
}
