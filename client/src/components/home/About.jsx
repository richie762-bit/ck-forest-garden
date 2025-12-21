import { TreePine, Heart, Shield, Sprout } from 'lucide-react';

/**
 * About Component
 * About section with mission and values
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
            A sanctuary where nature and adventure come together to create unforgettable
            experiences for visitors of all ages.
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

          {/* Right - Description */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Gateway to Nature's Beauty
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              CK Forest Gardens is more than just a destination—it's an experience. Located in
              the heart of Guyana, our 50+ acre paradise offers a perfect blend of natural
              beauty, recreational activities, and peaceful relaxation.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Whether you're planning a family outing, a corporate retreat, or an adventurous
              camping trip with friends, we provide a safe, clean, and welcoming environment
              for all our guests.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <TreePine className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Natural Environment</h4>
                  <p className="text-sm text-gray-600">
                    Immerse yourself in pristine nature with diverse flora and fauna
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Safe & Secure</h4>
                  <p className="text-sm text-gray-600">
                    Well-maintained facilities with safety as our top priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community Focused</h3>
            <p className="text-gray-600">
              We believe in creating spaces that bring people together and foster meaningful
              connections with nature and each other.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
            <p className="text-gray-600">
              Committed to sustainable practices and environmental conservation to preserve
              our natural beauty for future generations.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TreePine className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Nature First</h3>
            <p className="text-gray-600">
              Every decision we make prioritizes the preservation and celebration of the
              natural environment around us.
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
