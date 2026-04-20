import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import { User as UserIcon, Camera, Send, Phone, Save } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../components/SocialIcons';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profile_photo: '',
    facebook_url: '',
    twitter_url: '',
    telegram_url: '',
    instagram_url: '',
    phone: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profile_photo: user.profile_photo || '',
        facebook_url: user.facebook_url || '',
        twitter_url: user.twitter_url || '',
        telegram_url: user.telegram_url || '',
        instagram_url: user.instagram_url || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/profile', formData);
      // We need to update the local user state in AuthContext
      // Note: AuthContext might need a way to update the user object
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.location.reload(); // Refresh to sync auth state or update manual user state
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Column: Avatar */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative group mb-4">
                <div className="h-40 w-40 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                  {formData.profile_photo ? (
                    <img src={formData.profile_photo} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-20 w-20 text-gray-300 dark:text-gray-700" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white h-8 w-8" />
                </div>
              </div>
              <input 
                type="text" 
                name="profile_photo"
                placeholder="Profile Photo URL" 
                value={formData.profile_photo}
                onChange={handleChange}
                className="text-xs w-full p-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded mt-4"
              />
              <p className="text-[10px] text-gray-400 mt-1">Paste a URL here to change your avatar</p>
            </div>

            {/* Right Column: Inputs */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <div className="flex items-center">
                     <span className="p-2.5 bg-gray-50 dark:bg-gray-800 border border-r-0 dark:border-gray-700 rounded-l-lg text-gray-400"><Phone size={18} /></span>
                     <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-r-lg focus:ring-2 focus:ring-blue-500" placeholder="+1..." />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Social Links</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                     <span className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-r-0 dark:border-gray-700 rounded-l-lg text-blue-600 dark:text-blue-400"><FacebookIcon size={18} /></span>
                     <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange} className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-r-lg focus:ring-2 focus:ring-blue-500" placeholder="Facebook URL" />
                  </div>
                  <div className="flex items-center">
                     <span className="p-2.5 bg-sky-50 dark:bg-sky-900/20 border border-r-0 dark:border-gray-700 rounded-l-lg text-sky-500 dark:text-sky-400"><TwitterIcon size={18} /></span>
                     <input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-r-lg focus:ring-2 focus:ring-blue-500" placeholder="Twitter URL" />
                  </div>
                  <div className="flex items-center">
                     <span className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-r-0 dark:border-gray-700 rounded-l-lg text-blue-500 dark:text-blue-400"><Send size={18} /></span>
                     <input type="url" name="telegram_url" value={formData.telegram_url} onChange={handleChange} className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-r-lg focus:ring-2 focus:ring-blue-500" placeholder="Telegram URL" />
                  </div>
                  <div className="flex items-center">
                     <span className="p-2.5 bg-pink-50 dark:bg-pink-900/20 border border-r-0 dark:border-gray-700 rounded-l-lg text-pink-600 dark:text-pink-400"><InstagramIcon size={18} /></span>
                     <input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange} className="w-full p-2.5 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-r-lg focus:ring-2 focus:ring-blue-500" placeholder="Instagram URL" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t dark:border-gray-800">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
