import { useState, useEffect } from 'react';
import { Calendar, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Slideshow state
  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);

  const galleryImages = [
    "https://images.unsplash.com/photo-1437604473264-b6a9c7b4f5aa?auto=format&fit=crop&w=1200&q=80", // Worship hands
    "https://images.unsplash.com/photo-1544427920-c49ccf08c146?auto=format&fit=crop&w=1200&q=80", // Group gathering
    "https://images.unsplash.com/photo-1543616991-87a229a4ae48?auto=format&fit=crop&w=1200&q=80", // People studying bible
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80"  // Celebration/Event
  ];

  useEffect(() => {
     api.get('/events').then(res => setEvents(res.data.slice(0, 4))).catch(console.error);
     api.get('/announcements').then(res => setAnnouncements(res.data.slice(0, 3))).catch(console.error);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
     const timer = setInterval(() => {
        setCurrentGallerySlide((prev) => (prev + 1) % galleryImages.length);
     }, 5000);
     return () => clearInterval(timer);
  }, [galleryImages.length]);

  const prevSlide = () => {
      setCurrentGallerySlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
      setCurrentGallerySlide((prev) => (prev + 1) % galleryImages.length);
  };


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

      {/* Picture Slide Show / Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-center mb-4">Life at Grace Church</h2>
           <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Take a glimpse into our community, our worship, and the beautiful moments we share together.</p>
           
           <div className="relative w-full max-w-5xl mx-auto h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
             {/* Slider Images */}
             {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Grace Church Life ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentGallerySlide ? 'opacity-100' : 'opacity-0'}`}
                />
             ))}
             
             {/* Slider Indicators */}
             <div className="absolute inset-x-0 bottom-0 pb-6 flex justify-center gap-3">
                {galleryImages.map((_, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => setCurrentGallerySlide(idx)}
                     className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentGallerySlide ? 'bg-blue-600 scale-125' : 'bg-white/70 hover:bg-white saturate-0 focus:outline-none'}`}
                     aria-label={`Go to image ${idx + 1}`}
                   ></button>
                ))}
             </div>
             
             {/* Prev/Next Navigation Controls */}
             <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 focus:outline-none focus:opacity-100"
                aria-label="Previous image"
             >
                <ChevronLeft size={28} />
             </button>
             <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 focus:outline-none focus:opacity-100"
                aria-label="Next image"
             >
                <ChevronRight size={28} />
             </button>
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
