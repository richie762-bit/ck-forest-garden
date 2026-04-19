import useScrollReveal from '../hooks/useScrollReveal';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Activities from '../components/home/Activities';

const ActivitiesPage = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gray-900 py-20">
          <div className="container-custom text-center">
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold block mb-4">
              Explore
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Activities at CK Forest Gardens
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From camping under the stars to guided fruit forest tours — discover everything
              you can do on our 60-acre tropical retreat.
            </p>
          </div>
        </div>
        <Activities />
      </main>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
