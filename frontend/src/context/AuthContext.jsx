import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    
    if (res.data.user.role === 'admin') navigate('/admin');
    else if (res.data.user.role === 'treasurer') navigate('/treasurer');
    else navigate('/');
    return true;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    navigate('/');
    return true;
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('token')) {
        await api.post('/logout');
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
