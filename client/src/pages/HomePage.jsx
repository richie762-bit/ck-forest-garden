import useScrollReveal from '../hooks/useScrollReveal';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Activities from '../components/home/Activities';
import Gallery from '../components/home/Gallery';
import VisitorInfo from '../components/home/VisitorInfo';
import VolunteerSection from '../components/home/VolunteerSection';
import ContactSection from '../components/home/ContactSection';

const HomePage = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Activities />
        <Gallery />
        <VisitorInfo />
        <VolunteerSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
