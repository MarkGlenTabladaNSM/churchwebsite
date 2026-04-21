import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import { Heart, Send, Lock, Globe } from 'lucide-react';

export default function PrayerWall() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Track which requests we've prayed for locally
  const [prayedFor, setPrayedFor] = useState(() => {
    const saved = localStorage.getItem('prayedForRequests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/prayer-requests');
      setRequests(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch prayer requests', err);
      setError('Failed to load prayer requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post('/prayer-requests', {
        content,
        is_public: isPublic
      });
      // Add the new request to the top of the list
      setRequests([response.data, ...requests]);
      setContent('');
      setIsPublic(true); // reset
    } catch (err) {
      console.error('Failed to submit prayer request', err);
      alert('Failed to submit prayer request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrayClick = async (id) => {
    if (prayedFor.includes(id)) return;

    try {
      // Optimistically update the UI
      setRequests(requests.map(req => 
        req.id === id ? { ...req, pray_count: req.pray_count + 1 } : req
      ));
      
      const newPrayedFor = [...prayedFor, id];
      setPrayedFor(newPrayedFor);
      localStorage.setItem('prayedForRequests', JSON.stringify(newPrayedFor));

      // Call API
      await api.post(`/prayer-requests/${id}/pray`);
    } catch (err) {
      console.error('Failed to increment pray count', err);
      // Revert optimistic update on failure
      setRequests(requests.map(req => 
        req.id === id ? { ...req, pray_count: req.pray_count - 1 } : req
      ));
      const filtered = prayedFor.filter(pid => pid !== id);
      setPrayedFor(filtered);
      localStorage.setItem('prayedForRequests', JSON.stringify(filtered));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Prayer Wall</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Bear one another's burdens, and so fulfill the law of Christ. (Galatians 6:2)
        </p>
      </div>

      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Share a Prayer Request</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 border dark:bg-gray-700 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
              rows="3"
              placeholder="What can we pray for?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isPublic 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Globe size={16} />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    !isPublic 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Lock size={16} />
                  <span>Private (Pastors Only)</span>
                </button>
              </div>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                <span>{submitting ? 'Sharing...' : 'Share Prayer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-center border border-blue-100 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300">
            Please log in to submit a prayer request. You can still pray for public requests below!
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          No prayer requests right now. Be the first to share one!
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 transition-all ${
                !request.is_public ? 'border-purple-200 dark:border-purple-900/50 relative overflow-hidden' : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              {!request.is_public && (
                 <div className="absolute top-0 right-0 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                   <Lock size={12} /> Private Request
                 </div>
              )}
              
              <div className="flex items-start justify-between mb-4 mt-2">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {request.user?.name ? request.user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {request.user?.name || 'Anonymous'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(request.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg whitespace-pre-wrap">
                {request.content}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {request.pray_count} {request.pray_count === 1 ? 'person is' : 'people are'} praying
                </div>
                
                <button
                  onClick={() => handlePrayClick(request.id)}
                  disabled={prayedFor.includes(request.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    prayedFor.includes(request.id)
                      ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 cursor-default'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 active:scale-95'
                  }`}
                >
                  <Heart 
                    size={18} 
                    className={prayedFor.includes(request.id) ? 'fill-current' : ''} 
                  />
                  <span>{prayedFor.includes(request.id) ? 'Prayed' : 'I Prayed For This'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
