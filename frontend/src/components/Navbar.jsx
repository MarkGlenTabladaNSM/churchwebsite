import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Church, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'Events', path: '/events' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Projects', path: '/project-plans' },
    { name: 'Prayer Wall', path: '/prayer-wall' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <Church className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">Grace Church</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {link.name}
              </Link>
            ))}

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200 dark:border-gray-700">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Admin Dashboard</Link>
                )}
                {user.role === 'treasurer' && (
                  <Link to="/treasurer" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Treasurer Dashboard</Link>
                )}
                {user.role === 'pastor' && (
                  <Link to="/pastor" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Pastor Dashboard</Link>
                )}
                
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 py-1.5 px-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <UserIcon size={16} /> <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 gap-1 text-sm font-medium">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">Register</Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {publicLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800" 
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>My Profile</Link>
            )}
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
                {user.role === 'treasurer' && <Link to="/treasurer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>Treasurer Dashboard</Link>}
                {user.role === 'pastor' && <Link to="/pastor" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>Pastor Dashboard</Link>}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
               <>
                 <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsOpen(false)}>Login</Link>
                 <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => setIsOpen(false)}>Register</Link>
               </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
