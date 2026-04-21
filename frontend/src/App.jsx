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
import MemberDirectory from './pages/MemberDirectory';
import Profile from './pages/Profile';
import PastorDashboard from './pages/PastorDashboard';
import PrayerWall from './pages/PrayerWall';

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
          <Route path="/directory" element={<MemberDirectory />} />
          <Route path="/prayer-wall" element={<PrayerWall />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/treasurer" element={<TreasurerDashboard />} />
          <Route path="/pastor" element={<PastorDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
