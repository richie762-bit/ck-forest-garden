import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const allImages = [
  { src: '/assets/images/gallery/Overhead.jpg', title: 'Aerial View of CK Forest Gardens' },
  { src: '/assets/images/gallery/Heart.jpg', title: "Nature's Heart" },
  { src: '/assets/images/gallery/campfire.jpg', title: 'Cozy Campfire Evenings' },
  { src: '/assets/images/gallery/photography.jpg', title: 'Photography Paradise' },
  { src: '/assets/images/gallery/PicnicArea.jpg', title: 'Picnic Areas' },
  { src: '/assets/images/gallery/StreamActivities.jpg', title: 'Stream Activities' },
  { src: '/assets/images/gallery/groupEvents.jpg', title: 'Group Events' },
  { src: '/assets/images/gallery/Hiking.jpg', title: 'Hiking Trails' },
  { src: '/assets/images/gallery/Relaxation.jpg', title: 'Peaceful Relaxation' },
  { src: '/assets/images/gallery/Advert.jpg', title: "Nature's Paradise" },
  { src: '/assets/images/gallery/Sign.jpg', title: 'Welcome to CK Forest Gardens' },
];

const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!isOpen || !autoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, autoPlay]);

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
        <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
          Photo <span className="gradient-text">Slideshow</span>
        </h3>
        <p className="text-gray-600">
          Click any image to open the full slideshow — {allImages.length} photos total
        </p>
      </div>

      {/* Thumbnail grid */}
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

      {/* Slideshow modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={closeSlideshow}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close slideshow"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <div className="absolute top-4 left-4 z-10 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white font-semibold">
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <p className="text-white text-sm font-semibold">
              {autoPlay ? 'Pause' : 'Play'}
            </p>
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          <div className="max-w-7xl max-h-[90vh] mx-auto px-16">
            <img
              src={allImages[currentIndex].src}
              alt={allImages[currentIndex].title}
              className="w-full h-full object-contain max-h-[80vh]"
            />
            <div className="bg-black/50 px-6 py-3 rounded-lg mt-4 text-center">
              <p className="text-white text-lg font-semibold">
                {allImages[currentIndex].title}
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white/70 text-sm">
              Arrow keys or buttons to navigate &mdash; Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
