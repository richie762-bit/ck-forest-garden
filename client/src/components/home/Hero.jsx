import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';

/**
 * Hero Component
 * Main hero section with background slideshow and call-to-action
 */
const Hero = () => {
  const images = [
    '/assets/images/gallery/Overhead.jpg',
    '/assets/images/gallery/Hiking.jpg',
    '/assets/images/gallery/PicnicArea.jpg',
    '/assets/images/gallery/StreamActivities.jpg',
    '/assets/images/gallery/Relaxation.jpg',
    '/assets/images/gallery/campfire.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="relative text-white overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Light, airy overlay — lets the photography breathe */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-primary-900/50"></div>
      </div>

      <div className="relative container-custom py-24 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <p className="text-sm uppercase tracking-widest text-white/90 font-medium mb-4">
              Guyana's hidden retreat
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-md">
              Come as you are.{' '}
              <span className="block mt-2">
                Leave refreshed.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-sm">
              Sixty acres of living forest in the heart of Guyana. Wander among 30 varieties
              of tropical fruit, cool off in the stream, gather around a fire, and let the
              outside world wait.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://ckforesttours.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent px-8 py-4 text-lg shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                Plan Your Visit
              </a>
              <Link
                to="/about"
                className="btn btn-secondary px-8 py-4 text-lg bg-white/20 border-white/40 hover:bg-white/35 text-white backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/30">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white drop-shadow">500+</div>
                <div className="text-sm text-white/80 mt-1">Happy Visitors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white drop-shadow">50+</div>
                <div className="text-sm text-white/80 mt-1">Acres of Nature</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white drop-shadow">10+</div>
                <div className="text-sm text-white/80 mt-1">Things to Do</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-gray-800 text-lg font-semibold mb-2">Easy to Reach</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Nestled in the lush Guyanese countryside — close enough to get to,
                far enough to feel like a true escape.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-gray-800 text-lg font-semibold mb-2">Groups Welcome</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bring the family, invite your friends, or plan a team getaway.
                We host groups of 10 adults or more.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-gray-800 text-lg font-semibold mb-2">Simple Booking</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Reserve your spot online in just a few steps. We keep the process
                as unhurried as the garden itself.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-primary-600"
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
              <h3 className="text-gray-800 text-lg font-semibold mb-2">Honest Pricing</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                GYD 5,000 per adult per day. Children under 12 are always free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
