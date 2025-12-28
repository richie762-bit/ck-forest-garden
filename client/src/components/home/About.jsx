import { MapPin, Wifi, Home, Car } from 'lucide-react';

/**
 * About Component
 * About section with location and experience information
 */
const About = () => {
  return (
    <section id="about" className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="gradient-text">CK Forest Gardens</span>
          </h2>
          <p className="text-lg text-gray-600">
            Your exclusive off-grid retreat in the heart of Guyana's natural beauty
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Featured Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/gallery/Overhead.jpg"
                alt="CK Forest Gardens Aerial View"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent-500/20 rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary-500/20 rounded-2xl -z-10"></div>
          </div>

          {/* Right - Location & Description */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Exclusive Retreat
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Located just off the new Silica City development site along the Linden-Soesdyke Highway,
              we're situated near the road to Laluni—a historic agricultural village that once grew
              tobacco for the Demerara Tobacco Company. Our retreat is approximately 2.5 miles down
              an unpaved road of sand and red loam.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Think of our space as a blank canvas where you and your group can create your own memories.
              You'll have the entire place exclusively to yourselves. Whether you want to play loud music
              or simply enjoy the serenity of nature, it's entirely up to you—this is your space to make
              it what you want.
            </p>
          </div>
        </div>

        {/* Experience Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Getting Here</h3>
            <p className="text-sm text-gray-600">
              While road conditions vary seasonally, we recommend four-wheel drive vehicles.
              The road is currently sturdy enough for cars thanks to recent rain.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Detox</h3>
            <p className="text-sm text-gray-600">
              Operating completely off-grid with no electricity and only intermittent cell service.
              Designated spots available for emergency contact if needed.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Accommodations</h3>
            <p className="text-sm text-gray-600">
              Four A-frame camping pods (4 people each), plus a main dining/lounge area.
              Bring your own gear or use our inflatable mattresses.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bring Your Gear</h3>
            <p className="text-sm text-gray-600">
              We operate on a bring-your-own-gear basis, which is why we don't charge for
              overnight stays. Make it your adventure!
            </p>
          </div>
        </div>

        {/* Transition to Timeline */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 py-2 text-gray-500 text-sm font-medium">
                Our Story
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">
            What you see today didn't happen overnight. CK Forest Gardens has been transformed
            through years of dedication, hard work, and a vision to create a nature paradise.
            Discover how we evolved from raw land to the thriving eco-tourism destination we are today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
