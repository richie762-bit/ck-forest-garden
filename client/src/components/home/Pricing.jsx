import { useState } from 'react';
import { Check, Users, Baby, Calendar, DollarSign } from 'lucide-react';
import BookingModal from '../booking/BookingModal';

/**
 * Pricing Component
 * Displays pricing information and booking options
 */
const Pricing = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const bookingTypes = [
    {
      name: 'Day Visit',
      description: 'Perfect for a day trip with family or friends',
      features: [
        'Access to all facilities',
        'Picnic areas',
        'Nature trails',
        'Stream activities',
        'Photography spots',
      ],
    },
    {
      name: 'Weekend Camping',
      description: 'Overnight camping experience (2-3 days)',
      features: [
        'Everything in Day Visit',
        'Camping sites',
        'Bonfire areas',
        'Extended trail access',
        'Night sky viewing',
      ],
    },
    {
      name: 'Corporate Event',
      description: 'Team building and corporate retreats',
      features: [
        'Private group areas',
        'Event coordination',
        'Custom activities',
        'Flexible scheduling',
        'Group amenities',
      ],
    },
  ];

  return (
    <section id="pricing" className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple & <span className="gradient-text">Affordable Pricing</span>
          </h2>
          <p className="text-lg text-gray-600">
            Transparent pricing with no hidden fees. Book your perfect nature getaway today!
          </p>
        </div>

        {/* Pricing Card - Main */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-2 mb-4">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">Single Rate Pricing</span>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                GYD 5,000
                <span className="text-2xl font-normal text-primary-100"> /person/day</span>
              </div>
              <p className="text-xl text-primary-100">For adults (13 years and above)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Adults */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Adults</h3>
                    <p className="text-sm text-primary-100">Ages 13+</p>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">GYD 5,000</div>
                <p className="text-primary-100">per person, per day</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm font-semibold mb-2">Minimum Requirement:</p>
                  <p className="text-primary-100 text-sm">10 adults per booking</p>
                </div>
              </div>

              {/* Children */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Children</h3>
                    <p className="text-sm text-primary-100">Under 12 years</p>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2 text-accent-400">FREE!</div>
                <p className="text-primary-100">No charge for kids</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm font-semibold mb-2">Family Friendly:</p>
                  <p className="text-primary-100 text-sm">Bring the whole family!</p>
                </div>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Example Calculation:
              </h4>
              <div className="space-y-2 text-sm text-primary-100">
                <div className="flex justify-between">
                  <span>15 adults × GYD 5,000 × 2 days</span>
                  <span className="font-semibold text-white">GYD 150,000</span>
                </div>
                <div className="flex justify-between">
                  <span>5 children × FREE × 2 days</span>
                  <span className="font-semibold text-accent-400">GYD 0</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20 text-base">
                  <span className="font-bold text-white">Total:</span>
                  <span className="font-bold text-accent-400">GYD 150,000</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="btn btn-accent w-full mt-8 py-3 text-base"
            >
              Book Your Visit Now
            </button>
          </div>
        </div>

        {/* Booking Types */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Choose Your Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bookingTypes.map((type, index) => (
              <div key={index} className="card p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h4>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Sign Feature */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Visit?</h3>
            <p className="text-gray-600 mb-6">
              CK Forest Garden welcomes you to experience nature at its finest. Our transparent pricing and family-friendly policies make it easy to plan your perfect getaway.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">All Facilities</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Clean Restrooms</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Free Parking</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Safe & Secure</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/assets/images/gallery/Sign.jpg"
              alt="CK Forest Garden Welcome Sign"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </section>
  );
};

export default Pricing;
