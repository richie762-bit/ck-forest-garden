import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Activities from '../components/home/Activities';

/**
 * ActivitiesPage Component
 * Dedicated page for Activities section
 */
const ActivitiesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Activities />
      </main>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
