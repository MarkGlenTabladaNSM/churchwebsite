import { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
     api.get('/events').then(res => setEvents(res.data.slice(0, 4))).catch(console.error);
     api.get('/announcements').then(res => setAnnouncements(res.data.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Church Hero"
            className="w-full h-full object-cover opacity-40 text-transparent"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to Grace Church
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl">
            A place to belong, grow, and serve. We're glad you're here.
          </p>
          <div className="flex gap-4">
            <Link to="/events" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition">
              Plan a Visit
            </Link>
            <button className="bg-white text-gray-900 border border-transparent hover:bg-gray-50 px-6 py-3 rounded-md font-semibold transition">
              Watch Live
            </button>
          </div>
        </div>
      </section>

      {/* Announcements Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {announcements.map((a) => (
              <div key={a.id} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition border">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Heart size={20} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{a.content}</p>
                <div className="text-xs text-gray-400 mt-2">{a.date}</div>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-gray-500 text-center col-span-3">No recent announcements.</p>}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((e) => (
              <div key={e.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
                <img 
                  src={e.image || `https://images.unsplash.com/photo-1544427920-c49ccf08c146?auto=format&fit=crop&w=400&q=80`} 
                  alt="Event" 
                  className="w-full h-48 object-cover bg-gray-200 text-transparent" 
                />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-sm text-blue-600 font-semibold mb-1">UPCOMING</div>
                  <h3 className="text-lg font-bold mb-2">{e.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={16} className="mr-2" /> {e.date}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">{e.description}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="text-gray-500 text-center col-span-4">No upcoming events.</p>}
          </div>
        </div>
      </section>

      {/* Location / Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-center mb-12">Where to Find Us</h2>
           <div className="h-96 w-full rounded-xl overflow-hidden shadow-md bg-gray-100">
             <iframe
               title="Church Location"
               width="100%"
               height="100%"
               frameBorder="0"
               style={{ border: 0 }}
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1560416972000!5m2!1sen!2sus"
               allowFullScreen
             ></iframe>
           </div>
        </div>
      </section>
    </div>
  );
}
