import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';

/**
 * HomePage Component
 * Main landing page with Hero section
 */
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero — full-bleed with slideshow */}
        <Hero />

        {/* Spacer section — gives visual breathing room below the hero */}
        <div className="py-20 bg-gray-50">
          <div className="container-custom text-center max-w-2xl mx-auto px-6">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-4">
              A place like no other
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug mb-6">
              Sixty acres of forest, fruit, and fresh air
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              CK Forest Garden is a working fruit farm and nature retreat in Guyana.
              We opened our gates to visitors so that more people could experience
              what it feels like to slow down inside a living, breathing forest.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
