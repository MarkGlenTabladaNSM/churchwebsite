import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import ProjectPlans from './pages/ProjectPlans';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TreasurerDashboard from './pages/TreasurerDashboard';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/project-plans" element={<ProjectPlans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/treasurer" element={<TreasurerDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
