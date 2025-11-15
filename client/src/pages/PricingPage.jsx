import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Pricing from '../components/home/Pricing';

/**
 * PricingPage Component
 * Dedicated page for Pricing section
 */
const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
