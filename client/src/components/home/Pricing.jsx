import { useState, useEffect } from 'react';
import { Check, DollarSign, Loader2, ChevronLeft, ChevronRight, Users, Baby } from 'lucide-react';
import { getPackages } from '../../services/packageService';

/**
 * Pricing Component - Dynamic Package Display
 * Displays packages from Supabase with flashcard-style image carousel
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
      const data = await getPackages(false); // Only get active packages
      setPackages(data);

      // Initialize active image index for each package
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
      <section id="pricing" className="section bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Packages</span>
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect experience for your visit to CK Forest Gardens. Transparent pricing with no hidden fees!
          </p>
        </div>

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg) => {
              const hasImages = pkg.images && pkg.images.length > 0;
              const currentImageIndex = activeImageIndices[pkg.id] || 0;

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:shadow-2xl transition-shadow"
                >
                  {/* Image Carousel */}
                  {hasImages && (
                    <div className="relative h-64 bg-gray-100">
                      {/* Main Image */}
                      <img
                        src={pkg.images[currentImageIndex].url}
                        alt={pkg.images[currentImageIndex].alt || pkg.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Image Navigation - Only show if multiple images */}
                      {pkg.images.length > 1 && (
                        <>
                          {/* Previous Button */}
                          <button
                            onClick={() => handlePrevImage(pkg.id, pkg.images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          {/* Next Button */}
                          <button
                            onClick={() => handleNextImage(pkg.id, pkg.images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          {/* Dot Indicators */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                            {pkg.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handleDotClick(pkg.id, index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? 'bg-white w-4'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Package Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>

                    {/* Price */}
                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-semibold text-sm">Price</span>
                      </div>
                      <div className="text-3xl font-bold">
                        GYD {parseFloat(pkg.price).toLocaleString()}
                      </div>
                      <div className="text-primary-100 text-sm mt-1">{pkg.price_unit}</div>

                      {/* Pricing Details */}
                      <div className="mt-3 pt-3 border-t border-white/20 space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Minimum: {pkg.min_adults} adults</span>
                        </div>
                        {pkg.children_free && (
                          <div className="flex items-center gap-2 text-accent-400">
                            <Baby className="w-4 h-4" />
                            <span className="font-semibold">Children under 12 FREE!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Highlights */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">What's Included:</h4>
                        <ul className="space-y-2">
                          {pkg.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Book Now Button */}
                    <a
                      href="https://thestormkingg.github.io/ck-forest-gardens-booking-app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full mt-4 py-3 text-center inline-block"
                    >
                      Book This Package
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packages Available</h3>
            <p className="text-gray-600">
              We're currently updating our packages. Please check back soon!
            </p>
          </div>
        )}

        {/* Welcome Sign Feature */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Visit?</h3>
            <p className="text-gray-600 mb-6">
              CK Forest Gardens welcomes you to experience nature at its finest. Our transparent pricing and family-friendly policies make it easy to plan your perfect getaway.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">All Facilities</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Clean Restrooms</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Free Parking</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">Safe & Secure</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/assets/images/gallery/Sign.jpg"
              alt="CK Forest Gardens Welcome Sign"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
