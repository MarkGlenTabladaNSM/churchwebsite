import { Church, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Church className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">Grace Church</span>
            </div>
            <p className="text-gray-400">
              A community of faith, hope, and love. Join us for worship and fellowship.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-1 shrink-0" /> 
                <span>
                  Purok 4, 7W6W+F5X, Purok-4 Rd<br/>
                  Cordova, 6017 Cebu<br/>
                  Philippines
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Times</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Sunday Morning: 9:00 AM & 11:00 AM</li>
              <li>Wednesday Bible Study: 7:00 PM</li>
              <li>Youth Group: Friday 6:30 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
