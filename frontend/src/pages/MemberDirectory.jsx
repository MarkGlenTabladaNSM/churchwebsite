import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send, Phone, User as UserIcon, Mail, Plus } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from '../components/SocialIcons';
import AddMemberModal from '../components/AddMemberModal';

export default function MemberDirectory() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    api.get('/members')
      .then(res => setMembers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 transition-colors duration-200">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Member Directory</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Meet our church community members. Connect with us through social media or reach out for fellowship.
        </p>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition font-medium"
          >
            <Plus size={20} />
            Quick Add Member
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {members.map((member) => (
            <div key={member.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {member.profile_photo ? (
                  <img src={member.profile_photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-20 w-20 text-gray-300 dark:text-gray-700" />
                )}
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {member.role}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h2>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-4">
                  <Mail size={12} className="mr-1" /> {member.email}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3 italic">
                  "{member.bio || 'No bio provided yet.'}"
                </p>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  {/* Social Links */}
                  <div className="flex gap-3">
                    {member.facebook_url && (
                      <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                        <FacebookIcon size={20} />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 dark:text-sky-400 transition-colors">
                        <TwitterIcon size={20} />
                      </a>
                    )}
                    {member.telegram_url && (
                      <a href={member.telegram_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors">
                        <Send size={20} className="rotate-[-20deg]" />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 transition-colors">
                        <InstagramIcon size={20} />
                      </a>
                    )}
                  </div>
                  
                  {member.phone && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs gap-1">
                      <Phone size={14} className="text-green-500" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && members.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">No members found in the directory.</p>
        </div>
      )}

      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={(newMember) => setMembers(prev => [...prev, newMember])}
      />
    </div>
  );
}
