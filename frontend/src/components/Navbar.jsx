import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Church, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Announcements', path: '/announcements' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <Church className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Grace Church</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Admin Dashboard</Link>
                )}
                {user.role === 'treasurer' && (
                  <Link to="/treasurer" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Treasurer Dashboard</Link>
                )}
                
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 py-1.5 px-3 rounded-full">
                  <UserIcon size={16} /> <span>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 gap-1 text-sm font-medium">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Register</Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {publicLinks.map((link) => (
              <Link key={link.name} to={link.path} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
                {user.role === 'treasurer' && <Link to="/treasurer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Treasurer Dashboard</Link>}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
               <>
                 <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsOpen(false)}>Login</Link>
                 <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Register</Link>
               </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
