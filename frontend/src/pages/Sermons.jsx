import { useState, useEffect } from 'react';
import { Play, Mic, FileText, Calendar, User, Trash2 } from 'lucide-react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [notesUrl, setNotesUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fetchSermons = async () => {
    try {
      const res = await api.get('/sermons');
      setSermons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sermons', {
        title,
        speaker,
        date,
        description,
        video_url: videoUrl,
        audio_url: audioUrl,
        notes_url: notesUrl,
        thumbnail_url: thumbnailUrl
      });
      fetchSermons();
      // Reset form
      setTitle(''); setSpeaker(''); setDate(''); setDescription('');
      setVideoUrl(''); setAudioUrl(''); setNotesUrl(''); setThumbnailUrl('');
      alert("Sermon added successfully!");
    } catch (err) {
      alert("Error adding sermon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sermon?")) return;
    try {
      await api.delete(`/sermons/${id}`);
      fetchSermons();
    } catch (err) {
      alert("Error deleting sermon");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen transition-colors duration-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Sermon Archive</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Catch up on our latest teachings and messages.</p>
      </div>

      {(user?.role === 'admin' || user?.role === 'pastor') && (
        <div className="mb-12 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Add New Sermon</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Sermon Title</label>
              <input type="text" placeholder="The Power of Faith" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Speaker Name</label>
              <input type="text" placeholder="Pastor John Doe" value={speaker} onChange={e=>setSpeaker(e.target.value)} required className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Date of Service</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} required className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Video Link (YouTube/Vimeo)</label>
              <input type="url" placeholder="https://youtube.com/..." value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Audio Link</label>
              <input type="url" placeholder="https://..." value={audioUrl} onChange={e=>setAudioUrl(e.target.value)} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Notes Link (PDF)</label>
              <input type="url" placeholder="https://..." value={notesUrl} onChange={e=>setNotesUrl(e.target.value)} className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium dark:text-gray-300">Description</label>
              <textarea placeholder="Write a brief summary of the sermon..." value={description} onChange={e=>setDescription(e.target.value)} rows="3" className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
              Publish Sermon
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={s.thumbnail_url || `https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=600&q=80`} 
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {s.video_url && (
                  <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <Play fill="currentColor" size={32} />
                    </div>
                  </a>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {s.title}
                  </h3>
                  {(user?.role === 'admin' || user?.role === 'pastor') && (
                    <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User size={16} className="mr-2 text-blue-500" />
                    {s.speaker}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="mr-2 text-blue-500" />
                    {new Date(s.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 italic">
                  "{s.description || 'No description available for this message.'}"
                </p>

                <div className="flex gap-3 mt-auto">
                  {s.audio_url && (
                    <a href={s.audio_url} target="_blank" rel="noopener noreferrer" title="Listen to Audio" className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors border dark:border-gray-700">
                      <Mic size={16} /> <span className="text-xs font-semibold">Audio</span>
                    </a>
                  )}
                  {s.notes_url && (
                    <a href={s.notes_url} target="_blank" rel="noopener noreferrer" title="Download Notes" className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors border dark:border-gray-700">
                      <FileText size={16} /> <span className="text-xs font-semibold">Notes</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sermons.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed dark:border-gray-800">
          <Play size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold dark:text-white">No sermons found</h3>
          <p className="text-gray-500 dark:text-gray-400">We'll be uploading our latest messages soon.</p>
        </div>
      )}
    </div>
  );
}
