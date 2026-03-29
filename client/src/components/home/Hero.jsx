import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="bg-white">
      {/* Top hero — split layout */}
      <div className="container-custom py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-500 font-semibold mb-4">
              Guyana's hidden retreat
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Come as you are.{' '}
              <span className="text-primary-600">Leave refreshed.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg">
              Sixty acres of living forest in the heart of Guyana. Wander among 30 varieties
              of tropical fruit, cool off in the stream, gather around a fire, and let the
              outside world wait.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://ckforesttours.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-8 py-4 text-lg text-center"
              >
                Plan Your Visit
              </a>
              <Link
                to="/about"
                className="btn btn-secondary px-8 py-4 text-lg text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500 mt-1">Happy Visitors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">60</div>
                <div className="text-sm text-gray-500 mt-1">Acres of Forest</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">30+</div>
                <div className="text-sm text-gray-500 mt-1">Tropical Fruits</div>
              </div>
            </div>
          </div>

          {/* Right: Hero image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="/assets/images/gallery/Overhead.jpg"
                alt="CK Forest Gardens aerial view"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
              <div className="text-2xl font-bold text-primary-600">GYD 5,000</div>
              <div className="text-sm text-gray-500">per adult · kids under 12 free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards strip */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="container-custom py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Easy to Reach</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  45 minutes from Timehri-Soesdyke Junction, off the Linden-Soesdyke Highway.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Groups Welcome</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Bring the family, friends, or your team. We host groups of 10 adults or more.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Simple Booking</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Reserve your spot online in just a few steps — as unhurried as the garden itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
