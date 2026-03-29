import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Activities from '../components/home/Activities';
import Gallery from '../components/home/Gallery';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Activities />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
