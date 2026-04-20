import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../api/axios';

export default function AddMemberModal({ isOpen, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    profile_photo: '',
    bio: '',
    facebook_url: '',
    twitter_url: '',
    telegram_url: '',
    instagram_url: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/users', formData);
      onAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl mt-20 md:mt-0 p-6 relative border dark:border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Directory Member</h2>
        
        {error && <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
              <input 
                required 
                type="text" 
                name="role" 
                list="roles" 
                value={formData.role} 
                onChange={handleChange} 
                placeholder="e.g. pastor, treasurer, member"
                className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" 
              />
              <datalist id="roles">
                <option value="member" />
                <option value="pastor" />
                <option value="treasurer" />
                <option value="admin" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture URL</label>
            <input type="url" name="profile_photo" value={formData.profile_photo} onChange={handleChange} placeholder="https://..." className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
              <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter URL</label>
              <input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telegram URL</label>
              <input type="url" name="telegram_url" value={formData.telegram_url} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
              <input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange} className="w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2 border" />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-5 py-2 text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
