import { useState } from 'react';
import { Check, Users, Baby } from 'lucide-react';

const packages = [
  {
    id: 1,
    title: 'Day Visit Package',
    description: 'A full day exploring the fruit forest, swimming in the natural pool, fishing, and enjoying the outdoors with your group.',
    price: '5,000',
    price_unit: 'per adult, per day',
    min_adults: 10,
    children_free: true,
    images: [
      { url: '/assets/images/gallery/PicnicArea.jpg', alt: 'Picnic areas at CK Forest Gardens' },
      { url: '/assets/images/gallery/StreamActivities.jpg', alt: 'Stream activities' },
    ],
    highlights: [
      'Access to all 60 acres of fruit forest',
      'Guided tour of 30+ tropical fruits',
      'Swimming in the natural pool',
      'Fishing in the ponds',
      'Sports facilities — volleyball, cricket, football',
      'Use of picnic areas and shelter',
    ],
  },
  {
    id: 2,
    title: 'Camping Package',
    description: 'Stay overnight in our A-frame pods or bring your own camping gear. Sleep under the stars and wake up surrounded by the forest.',
    price: '3,000',
    price_unit: 'per adult, per night',
    min_adults: 10,
    children_free: true,
    images: [
      { url: '/assets/images/gallery/campfire.jpg', alt: 'Campfire evenings at CK Forest Gardens' },
      { url: '/assets/images/gallery/Relaxation.jpg', alt: 'Relaxation in the forest' },
    ],
    highlights: [
      'Overnight access to the full site',
      'A-frame pod accommodation (4 people each)',
      'Campfire area',
      'Stargazing in the forest',
      'Morning fruit forest walk',
      'Bring your own gear for free overnight stays',
    ],
  },
  {
    id: 3,
    title: 'Group Event Package',
    description: 'Exclusive use of CK Forest Gardens for corporate retreats, team-building days, family reunions, or school excursions.',
    price: '4,500',
    price_unit: 'per adult, per day',
    min_adults: 20,
    children_free: true,
    images: [
      { url: '/assets/images/gallery/groupEvents.jpg', alt: 'Group events at CK Forest Gardens' },
      { url: '/assets/images/gallery/Advert.jpg', alt: "CK Forest Gardens Nature's Paradise" },
    ],
    highlights: [
      'Exclusive full-site access for your group',
      'Guided fruit forest experience',
      'Team-building activities available',
      'Sports and recreational facilities',
      'Flexible catering arrangements',
      'Ideal for 20+ people',
    ],
  },
];

const PackageCard = ({ pkg }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
      {/* Image */}
      <div className="relative h-52 bg-gray-100">
        <img
          src={pkg.images[activeImage].url}
          alt={pkg.images[activeImage].alt}
          className="w-full h-full object-cover"
        />
        {pkg.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {pkg.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`rounded-full transition-all ${
                  i === activeImage ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="font-display text-xl font-bold text-gray-900">{pkg.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>

        {/* Price block */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-4 text-white">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">GYD {pkg.price}</div>
              <div className="text-xs text-primary-100 mt-0.5">{pkg.price_unit}</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Min: {pkg.min_adults}
              </div>
              {pkg.children_free && (
                <div className="flex items-center gap-1 text-accent-300 font-semibold">
                  <Baby className="w-3.5 h-3.5" />
                  Kids FREE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Includes:</h4>
          <ul className="space-y-1.5">
            {pkg.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 leading-tight">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://ckforesttours.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-full py-3 text-sm text-center inline-block mt-2"
        >
          Book Now
        </a>
      </div>
    </div>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12 reveal">
          <span className="section-label">Packages</span>
          <h2 className="section-heading">
            Our <span className="gradient-text">Packages</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Choose your perfect forest garden experience. All packages require a minimum of
            10 adults. Children visit free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className={`reveal reveal-delay-${i + 1}`}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>

        {/* Ready to Visit */}
        <div className="mt-14 grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto reveal">
          <div className="order-2 md:order-1">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">Ready to Visit?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              CK Forest Gardens welcomes you to experience nature at its finest. Our
              transparent pricing and family-friendly policies make it easy to plan your
              perfect getaway. For exact pricing and availability, book via ckforesttours.com.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Full Site Access', 'Clean Restrooms', 'Free Parking', 'Safe and Secure'].map((f) => (
                <div key={f} className="bg-primary-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/assets/images/gallery/Sign.jpg"
              alt="Welcome to CK Forest Gardens"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
