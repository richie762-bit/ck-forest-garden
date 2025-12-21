import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * ImageSlideshow Component
 * Full-screen image slideshow with navigation
 */
const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // All images used on the site
  const allImages = [
    // Gallery images
    { src: '/assets/images/gallery/Overhead.jpg', title: 'Aerial View of CK Forest Gardens' },
    { src: '/assets/images/gallery/Heart.jpg', title: 'Nature\'s Heart' },
    { src: '/assets/images/gallery/campfire.jpg', title: 'Cozy Campfire Evenings' },
    { src: '/assets/images/gallery/photography.jpg', title: 'Photography Paradise' },
    { src: '/assets/images/gallery/PicnicArea.jpg', title: 'Picnic Areas' },
    { src: '/assets/images/gallery/StreamActivities.jpg', title: 'Stream Activities' },
    { src: '/assets/images/gallery/groupEvents.jpg', title: 'Group Events' },
    { src: '/assets/images/gallery/Hiking.jpg', title: 'Hiking Trails' },
    { src: '/assets/images/gallery/Relaxation.jpg', title: 'Peaceful Relaxation' },
    { src: '/assets/images/gallery/Advert.jpg', title: 'Nature\'s Paradise' },
    { src: '/assets/images/gallery/Sign.jpg', title: 'Welcome to CK Forest Gardens' },

    // Timeline images
    { src: '/assets/images/timeline/2007-poolsite-before.jpg', title: '2007 - Poolside During Accidental Burning' },
    { src: '/assets/images/timeline/2007-poolsite-after.jpg', title: '2007 - First Water Hole' },
    { src: '/assets/images/timeline/2008-development.jpg', title: '2008 - Early Development Phase' },
    { src: '/assets/images/timeline/dining-kitchen-area.jpg', title: '2008 - Future Dining & Kitchen Area' },
    { src: '/assets/images/timeline/2012-overhead.jpg', title: '2012 - Aerial Planning View' },
    { src: '/assets/images/timeline/2012-boat.jpg', title: '2012 - First Boat Arrives' },
    { src: '/assets/images/timeline/2015-east-side.jpg', title: '2015 - East Side Development' },
    { src: '/assets/images/timeline/2015-first-dig.jpg', title: '2015 - First Dig to Conservancy' },
    { src: '/assets/images/timeline/2016-perimeter-dam.jpg', title: '2016 - Eastern Perimeter Dam' },
    { src: '/assets/images/timeline/2019-container.jpg', title: '2019 - Container Installation' },
    { src: '/assets/images/timeline/obstacle-course.jpg', title: '2019 - Old Obstacle Course Area' }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isOpen || !autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isOpen, autoPlay, allImages.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setAutoPlay(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setAutoPlay(false);
  };

  const openSlideshow = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setAutoPlay(true);
  };

  const closeSlideshow = () => {
    setIsOpen(false);
    setAutoPlay(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeSlideshow();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Photo <span className="gradient-text">Slideshow</span>
        </h3>
        <p className="text-gray-600">
          Click on any image to start the slideshow and explore all {allImages.length} photos from CK Forest Gardens
        </p>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allImages.map((image, index) => (
          <div
            key={index}
            onClick={() => openSlideshow(index)}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative hover:shadow-xl transition-all duration-300"
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white text-sm font-semibold text-center px-2">View</p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Slideshow Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeSlideshow}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close slideshow"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white font-semibold">
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>

          {/* Auto-play Toggle */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <p className="text-white text-sm font-semibold">
              {autoPlay ? '⏸ Pause' : '▶ Play'}
            </p>
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Main Image */}
          <div className="max-w-7xl max-h-[90vh] mx-auto px-4">
            <img
              src={allImages[currentIndex].src}
              alt={allImages[currentIndex].title}
              className="w-full h-full object-contain"
            />
            <div className="bg-black/50 px-6 py-3 rounded-lg mt-4 text-center">
              <p className="text-white text-lg font-semibold">
                {allImages[currentIndex].title}
              </p>
            </div>
          </div>

          {/* Keyboard Hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white/70 text-sm">
              Use arrow keys or click buttons to navigate • ESC to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
