import { MapPin, Clock, Car, Package, Users, Info } from 'lucide-react';

const infoCards = [
  {
    icon: Clock,
    title: 'Opening Hours',
    text: 'Open year-round, seven days a week for day visits. Overnight camping is available by prior arrangement. Contact us to confirm availability before you make the trip.',
  },
  {
    icon: MapPin,
    title: 'Location',
    text: 'Plot A Badrima, near Laluni village, East Bank Demerara. Off the Linden-Soesdyke Highway, about 45 minutes from Timehri-Soesdyke Junction, just off the new Silica City development.',
  },
  {
    icon: Car,
    title: 'Getting There',
    text: 'Travel 2.5 miles down an unpaved sand and red loam road. A 4x4 is recommended, especially after rain. Regular cars manage during dry weather. Free parking is available on-site.',
  },
  {
    icon: Users,
    title: 'Group Size',
    text: 'We host groups of 10 adults or more. Children are welcome and kids visit free with most packages. Contact us about school groups and educational tours.',
  },
];

const whatToBring = [
  'Comfortable clothing and sturdy footwear',
  'Sun protection — hat, sunscreen, sunglasses',
  'Insect repellent',
  'Swimwear for the natural pool',
  'Food and drinks (no on-site restaurant)',
  'Camping gear if staying overnight',
  'Fishing gear if you plan to fish',
  'A portable power bank — we are off-grid',
];

const VisitorInfo = () => {
  return (
    <section id="visit" className="section bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="section-label">Plan Your Trip</span>
          <h2 className="section-heading">
            Visitor <span className="gradient-text">Information</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Everything you need to know before you arrive
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: info cards */}
          <div className="space-y-5">
            {infoCards.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className={`flex gap-5 p-6 bg-gray-50 rounded-2xl hover:bg-primary-50 hover:border-primary-100 border border-transparent transition-colors duration-300 reveal reveal-delay-${i + 1}`}>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: welcome photo + what to bring */}
          <div className="space-y-6 reveal reveal-delay-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/assets/images/gallery/Sign.jpg"
                alt="Welcome sign at CK Forest Gardens"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-display font-semibold text-xl">
                  Welcome to CK Forest Gardens
                </p>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                What to Bring
              </h3>
              <ul className="space-y-2.5">
                {whatToBring.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                CK Forest Gardens is completely off-grid with no mains electricity and limited
                mobile signal. This is what makes it magical — pack accordingly and embrace the disconnect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitorInfo;
