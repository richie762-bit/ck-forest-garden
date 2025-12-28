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
            Welcome to <span className="gradient-text">Camp Kabouyak</span>
          </h2>
          <p className="text-lg text-gray-600">
            A 60-acre fruit forest farm where nature meets adventure
          </p>
        </div>

        {/* Introduction Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-bold text-primary-600">Camp Kabouyak (CK) Forest Gardens</span> started out as a citrus farm
              and has blossomed into something pretty special—a 60-acre fruit forest farm tucked away near Kurukururu and Laluni
              on the Linden-Soesdyke Highway, about 45 minutes from Timehri-Soesdyke Junction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Over the years, we've transformed this land into a living fruit forest with <span className="font-semibold">over 30 different
              types of tropical fruits</span>. It's become the perfect place to unplug from the digital world, explore nature,
              and maybe learn a thing or two about tropical fruits along the way. We offer tours of the fruit forest and
              welcome groups who want to experience the outdoors in their own way.
            </p>
          </div>
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

          {/* Right - Location & Experience */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Make It Your Own
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We're tucked away just off the new Silica City development on the Linden-Soesdyke Highway, near
              Laluni—a little village with history (it used to grow tobacco for the Demerara Tobacco Company!).
              You'll travel about 2.5 miles down an unpaved road of sand and red loam to reach us.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Here's the thing—when you come to CK, the whole place is yours. Bring your crew, crank up the music
              if that's your vibe, or just soak in the peace and quiet. It's your space to make what you want of it.
              We're here to share our fruit forest with you, not tell you how to enjoy it.
            </p>
            <div className="bg-primary-50 p-4 rounded-lg border-l-4 border-primary-500">
              <h4 className="font-bold text-gray-900 mb-2">What You Can Do Here:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Take a dip in our man-made natural pool</li>
                <li>• Try your luck fishing in the ponds scattered around</li>
                <li>• Play volleyball, cricket, or football in the open spaces</li>
                <li>• Join a guided tour through our 30+ fruit forest</li>
                <li>• Escape the notifications and reconnect with nature</li>
              </ul>
            </div>
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
              The road's a bit rough—we recommend a 4x4, but regular cars can make it when the weather's good.
              Just follow the sand and red loam, and you'll find us!
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unplug & Recharge</h3>
            <p className="text-sm text-gray-600">
              We're completely off-grid—no electricity, spotty cell service. Perfect for getting away from it all.
              Don't worry, there are spots with signal if you need to check in.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sleep Under the Trees</h3>
            <p className="text-sm text-gray-600">
              We've got four A-frame pods that fit about 4 people each, plus a main area for hanging out.
              Bring your camping gear, or borrow our inflatable mattresses.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">BYOG (Bring Your Own Gear)</h3>
            <p className="text-sm text-gray-600">
              Pack your own camping stuff—that's why staying overnight is free! Your adventure,
              your way. We'll provide the fruit forest.
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
                How We Got Here
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">
            Rome wasn't built in a day, and neither was CK Forest Gardens. This place has been a labor of love—
            years of clearing, planting, digging, and dreaming. What started as raw bush land has grown into
            the fruit forest you see today. Want to know how it all happened? Let's walk through it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
