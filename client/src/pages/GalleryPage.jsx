import useScrollReveal from '../hooks/useScrollReveal';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Gallery from '../components/home/Gallery';
import ImageSlideshow from '../components/gallery/ImageSlideshow';

const GalleryPage = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gray-900 py-20">
          <div className="container-custom text-center">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold block mb-4">
              Photos
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Gallery
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore CK Forest Gardens through the lens of our visitors and the seasons.
            </p>
          </div>
        </div>
        <Gallery />
        <section className="section bg-white">
          <div className="container-custom">
            <ImageSlideshow />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
