import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Gallery from '../components/home/Gallery';

/**
 * GalleryPage Component
 * Dedicated page for Gallery section
 */
const GalleryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
