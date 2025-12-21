import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import About from '../components/home/About';
import Timeline from '../components/about/Timeline';

/**
 * AboutPage Component
 * Dedicated page for About section with timeline
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <About />
        <Timeline />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
