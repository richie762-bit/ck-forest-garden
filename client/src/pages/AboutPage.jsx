import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import About from '../components/home/About';

/**
 * AboutPage Component
 * Dedicated page for About section
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
