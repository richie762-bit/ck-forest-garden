import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin } from 'lucide-react';
import NewBookingModal from '../booking/NewBookingModal';

/**
 * Hero Component
 * Main hero section with call-to-action
 */
const Hero = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/gallery/Overhead.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-900/90"></div>
      </div>

      <div className="relative container-custom py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Welcome to
              <span className="block mt-2 bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                CK Forest Gardens
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              Experience the pristine beauty of Guyana's nature. From peaceful forest walks to
              adventurous camping, create unforgettable memories in nature's paradise.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="btn btn-accent px-8 py-4 text-lg"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                Book Your Visit
              </button>
              <Link
                to="/about"
                className="btn btn-secondary px-8 py-4 text-lg bg-white/10 border-white/30 hover:bg-white/20 text-white"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent-400">500+</div>
                <div className="text-sm text-primary-200 mt-1">Happy Visitors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent-400">50+</div>
                <div className="text-sm text-primary-200 mt-1">Acres of Nature</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent-400">10+</div>
                <div className="text-sm text-primary-200 mt-1">Activities</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
            <div className="card bg-white/10 backdrop-blur-md p-6 border border-white/20">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-primary-100 text-sm">
                Nestled in the heart of Guyana's lush landscapes, easily accessible yet
                peacefully secluded.
              </p>
            </div>

            <div className="card bg-white/10 backdrop-blur-md p-6 border border-white/20">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Group Friendly</h3>
              <p className="text-primary-100 text-sm">
                Perfect for families, friends, and corporate events. Minimum 10 adults per
                booking.
              </p>
            </div>

            <div className="card bg-white/10 backdrop-blur-md p-6 border border-white/20">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-primary-100 text-sm">
                Simple online booking process. Reserve your spot in just a few clicks.
              </p>
            </div>

            <div className="card bg-white/10 backdrop-blur-md p-6 border border-white/20">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable Rates</h3>
              <p className="text-primary-100 text-sm">
                GYD 5,000 per adult per day. Children under 12 visit absolutely FREE!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <NewBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </section>
  );
};

export default Hero;
