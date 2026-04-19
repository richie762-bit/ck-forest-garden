import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { src: '/assets/images/gallery/Overhead.jpg', title: 'Aerial View', gridClass: 'md:col-span-2 md:row-span-2' },
  { src: '/assets/images/gallery/campfire.jpg', title: 'Campfire Evenings', gridClass: '' },
  { src: '/assets/images/gallery/Heart.jpg', title: "Nature's Heart", gridClass: '' },
  { src: '/assets/images/gallery/Hiking.jpg', title: 'Hiking Trails', gridClass: '' },
  { src: '/assets/images/gallery/PicnicArea.jpg', title: 'Picnic Areas', gridClass: '' },
  { src: '/assets/images/gallery/StreamActivities.jpg', title: 'Stream Activities', gridClass: 'md:col-span-2' },
  { src: '/assets/images/gallery/groupEvents.jpg', title: 'Group Events', gridClass: '' },
  { src: '/assets/images/gallery/photography.jpg', title: 'Photography', gridClass: '' },
  { src: '/assets/images/gallery/Relaxation.jpg', title: 'Relaxation', gridClass: '' },
  { src: '/assets/images/gallery/Advert.jpg', title: "Nature's Paradise", gridClass: 'md:col-span-2' },
  { src: '/assets/images/gallery/Sign.jpg', title: 'Welcome Sign', gridClass: '' },
];

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i + 1) % galleryImages.length);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % galleryImages.length);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  return (
    <section id="gallery" className="section bg-gray-50">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="section-label">Photos</span>
          <h2 className="section-heading">
            Gallery &amp; <span className="gradient-text">Highlights</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Explore CK Forest Gardens through the lens of our visitors and the seasons.
            Click any image to view it full screen.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4 reveal">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${img.gridClass}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-end p-4">
                <p className="text-white font-semibold text-sm translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center reveal">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Own Memories?
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Join hundreds of satisfied visitors who have experienced the magic of CK Forest Garden.
            Book your visit today.
          </p>
          <a
            href="https://ckforesttours.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-10 py-4 text-lg inline-block"
          >
            Book Your Experience
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/25 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-7 h-7 text-white" />
          </button>

          <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white text-sm font-semibold">
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          </div>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto block"
            />
            <p className="text-white text-center mt-4 font-semibold text-lg">
              {galleryImages[lightboxIndex].title}
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white/60 text-xs">
              Arrow keys to navigate &mdash; Esc to close
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
