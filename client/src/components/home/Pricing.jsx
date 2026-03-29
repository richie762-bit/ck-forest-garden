import { useState, useEffect } from 'react';
import { Check, DollarSign, Loader2, ChevronLeft, ChevronRight, Users, Baby } from 'lucide-react';
import { getPackages } from '../../services/packageService';

/**
 * Pricing Component - Compact Dynamic Package Display
 */
const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndices, setActiveImageIndices] = useState({});

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await getPackages(false);
      setPackages(data);
      const initialIndices = {};
      data.forEach((pkg) => {
        initialIndices[pkg.id] = 0;
      });
      setActiveImageIndices(initialIndices);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = (packageId, totalImages) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [packageId]: prev[packageId] === 0 ? totalImages - 1 : prev[packageId] - 1
    }));
  };

  const handleNextImage = (packageId, totalImages) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [packageId]: (prev[packageId] + 1) % totalImages
    }));
  };

  const handleDotClick = (packageId, index) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [packageId]: index
    }));
  };

  if (loading) {
    return (
      <section id="pricing" className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Our <span className="gradient-text">Packages</span>
          </h2>
          <p className="text-gray-600">Choose your perfect forest garden experience</p>
        </div>

        {/* Compact Packages Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg) => {
              const hasImages = pkg.images && pkg.images.length > 0;
              const currentImageIndex = activeImageIndices[pkg.id] || 0;

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                >
                  {/* Compact Image Carousel */}
                  {hasImages && (
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={pkg.images[currentImageIndex].url}
                        alt={pkg.images[currentImageIndex].alt || pkg.title}
                        className="w-full h-full object-cover"
                      />
                      {pkg.images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePrevImage(pkg.id, pkg.images.length)}
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleNextImage(pkg.id, pkg.images.length)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
                            aria-label="Next"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                            {pkg.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handleDotClick(pkg.id, index)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? 'bg-white w-3'
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                                aria-label={`Image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Compact Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>

                    {/* Compact Price */}
                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg p-3 text-white">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-2xl font-bold">
                            GYD {parseFloat(pkg.price).toLocaleString()}
                          </div>
                          <div className="text-xs text-primary-100 mt-0.5">{pkg.price_unit}</div>
                        </div>
                        <DollarSign className="w-5 h-5 opacity-70" />
                      </div>
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/20 text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Min: {pkg.min_adults}</span>
                        </div>
                        {pkg.children_free && (
                          <div className="flex items-center gap-1 text-accent-400">
                            <Baby className="w-3.5 h-3.5" />
                            <span className="font-semibold">Kids FREE</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compact Highlights */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-semibold text-gray-900">Includes:</h4>
                        <ul className="space-y-1">
                          {pkg.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <Check className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-700 leading-tight">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Book Button */}
                    <a
                      href="https://ckforesttours.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full py-2.5 text-sm text-center inline-block mt-3"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Packages Available</h3>
            <p className="text-sm text-gray-600">Check back soon for updates!</p>
          </div>
        )}

        {/* Welcome Sign & Facilities */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Visit?</h3>
            <p className="text-gray-600 mb-6">
              CK Forest Gardens welcomes you to experience nature at its finest. Our transparent pricing and family-friendly policies make it easy to plan your perfect getaway.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">All Facilities</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">Clean Restrooms</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">Free Parking</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">Safe & Secure</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/assets/images/gallery/Sign.jpg"
              alt="CK Forest Gardens Welcome Sign"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
