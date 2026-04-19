import { MapPin, Wifi, Home, Car, Leaf } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Getting Here',
    text: 'A 4x4 is recommended for the 2.5-mile unpaved road, though regular cars manage in dry weather. Follow the sand and red loam road and you will find us.',
  },
  {
    icon: Wifi,
    title: 'Unplug and Recharge',
    text: 'Completely off-grid — no mains electricity, limited signal. A few spots do catch a bar or two if you need to check in with the outside world.',
  },
  {
    icon: Home,
    title: 'Sleep Under the Trees',
    text: 'Four A-frame pods sleep around 4 people each. Bring your own camping gear, or rent our inflatable mattresses.',
  },
  {
    icon: Car,
    title: 'Bring Your Own Gear',
    text: 'Pack your camping essentials — that is why overnight stays are free. Your adventure, your way. We provide the forest.',
  },
];

const About = () => {
  return (
    <section id="about" className="section bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="section-label">Our Story</span>
          <h2 className="section-heading">
            Welcome to{' '}
            <span className="gradient-text">CK Forest Garden</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            A 60-acre fruit forest farm where nature meets adventure
          </p>
        </div>

        {/* Cinematic intro image */}
        <div className="max-w-5xl mx-auto mb-20 reveal">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/assets/images/gallery/Advert.jpg"
              alt="CK Forest Gardens — Nature's Paradise in Guyana"
              className="w-full h-72 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
              <div className="p-8 md:p-12">
                <blockquote className="text-white text-xl md:text-2xl font-display font-semibold leading-relaxed max-w-2xl">
                  "Started as a citrus farm, grown into something extraordinary — a living fruit forest
                  with over 30 tropical varieties."
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
          {/* Left: aerial photo */}
          <div className="relative reveal">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/gallery/Overhead.jpg"
                alt="Aerial view of CK Forest Gardens — 60 acres of tropical forest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-primary-100 rounded-2xl -z-10" />
            <div className="absolute -top-5 -left-5 w-40 h-40 bg-accent-100 rounded-2xl -z-10" />
          </div>

          {/* Right: text */}
          <div className="reveal reveal-delay-2">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-5">
              Make It Your Own
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-primary-600">Camp Kabouyak (CK) Forest Gardens</strong> sits
                near Kurukururu and Laluni on the Linden-Soesdyke Highway — about 45 minutes from
                Timehri-Soesdyke Junction. You will travel 2.5 miles down an unpaved road of sand and
                red loam to reach us.
              </p>
              <p>
                When you come to CK, the whole place is yours. Bring your crew, crank up the music
                if that is your vibe, or just soak in the peace and quiet. We are here to share our
                fruit forest with you — not to tell you how to enjoy it.
              </p>
            </div>

            <div className="mt-6 bg-primary-50 border-l-4 border-primary-500 rounded-r-xl p-5">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary-500" />
                What you can do here
              </h4>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {[
                  'Take a dip in our man-made natural pool',
                  'Try your luck fishing in the ponds',
                  'Play volleyball, cricket, or football',
                  'Take a guided tour through 30+ fruit varieties',
                  'Escape notifications and reconnect with nature',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className={`card p-6 reveal reveal-delay-${i + 1}`}>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
