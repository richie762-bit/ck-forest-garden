import useScrollReveal from '../hooks/useScrollReveal';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Pricing from '../components/home/Pricing';

const PricingPage = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gray-900 py-20">
          <div className="container-custom text-center">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold block mb-4">
              Pricing
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Visit Packages
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Transparent pricing for unforgettable forest experiences.
              All packages welcome groups of 10 adults or more.
            </p>
          </div>
        </div>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
