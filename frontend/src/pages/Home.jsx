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
      {/* Hero Section containing Welcome, Announcements & Events */}
      <section className="relative bg-gray-900 text-white min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Church Hero"
            className="w-full h-full object-cover opacity-40 text-transparent"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
          {/* Welcome Content */}
          <div className="text-center mb-20 mt-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Welcome to Grace Church
            </h1>
            <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto">
              A place to belong, grow, and serve. We're glad you're here.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/events" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md font-semibold transition">
                Plan a Visit
              </Link>
              <button className="bg-white text-gray-900 border border-transparent hover:bg-gray-50 px-8 py-3 rounded-md font-semibold transition">
                Watch Live
              </button>
            </div>
          </div>

          {/* Announcements & Events Side by Side */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Latest Announcements (Left) */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white border-b border-white/20 pb-4">
                Latest Announcements
              </h2>
              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-sm border border-white/20 hover:bg-white/20 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500/30 text-blue-200 rounded-full flex shrink-0 items-center justify-center">
                        <Heart size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{a.title}</h3>
                        <p className="text-gray-200 mb-2 line-clamp-2">{a.content}</p>
                        <div className="text-xs text-gray-400">{a.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && <p className="text-gray-300 italic">No recent announcements.</p>}
              </div>
            </div>

            {/* Upcoming Events (Right) */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white border-b border-white/20 pb-4">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.map((e) => (
                  <div key={e.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition flex flex-col">
                    <img 
                      src={e.image || `https://images.unsplash.com/photo-1544427920-c49ccf08c146?auto=format&fit=crop&w=400&q=80`} 
                      alt="Event" 
                      className="w-full h-40 object-cover bg-gray-800" 
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-blue-300 font-semibold mb-1">UPCOMING</div>
                      <h3 className="text-lg font-bold mb-2 truncate">{e.title}</h3>
                      <div className="flex items-center text-gray-300 text-xs mb-3">
                        <Calendar size={14} className="mr-1" /> {e.date}
                      </div>
                      <p className="text-gray-200 text-sm flex-1 line-clamp-2">{e.description}</p>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-gray-300 italic">No upcoming events.</p>}
              </div>
            </div>

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
               src="https://maps.google.com/maps?q=10.258701,123.944763&t=&z=15&ie=UTF8&iwloc=&output=embed"
               allowFullScreen
             ></iframe>
           </div>
        </div>
      </section>
    </div>
  );
}
