import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ImageSlideshow from '../gallery/ImageSlideshow';
import { getGalleryImages } from '../../services/supabaseService';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Gallery Component
 * Image gallery section with actual photos from database
 */
const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const images = await getGalleryImages();
      // Take first 3 images for the preview grid
      const previewImages = images.slice(0, 3).map(img => ({
        image: img.image_url,
        title: img.title,
      }));
      setGalleryItems(previewImages);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      // Fallback to default images if fetch fails
      setGalleryItems([
        {
          image: '/assets/images/gallery/campfire.jpg',
          title: 'Cozy Campfire',
        },
        {
          image: '/assets/images/gallery/Overhead.jpg',
          title: 'Aerial Views',
        },
        {
          image: '/assets/images/gallery/Heart.jpg',
          title: 'Nature\'s Heart',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gallery" className="section bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Gallery & <span className="gradient-text">Highlights</span>
          </h2>
          <p className="text-lg text-gray-600">
            Explore the beauty of CK Forest Gardens through these highlights from our visitors
            and activities.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" text="Loading gallery..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
            <div
              key={index}
              className="card overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg">{item.title}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Image Slideshow */}
        <ImageSlideshow />

        {/* Testimonial Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Our Visitors Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  JS
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">John Smith</h4>
                  <p className="text-sm text-gray-500">Family Visit</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "An amazing experience! The kids loved it, and the facilities were top-notch.
                The free admission for children made it very affordable for our family."
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-500">
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Corporate Event</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Perfect venue for our team building event. The natural setting created a
                relaxed atmosphere that brought our team closer together."
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-500">
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  MB
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Michael Brown</h4>
                  <p className="text-sm text-gray-500">Camping Trip</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Wonderful camping experience! Clean facilities, beautiful scenery, and
                friendly staff. Can't wait to visit again with more friends."
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent-500">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Your Own Memories?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied visitors who have experienced the magic of CK Forest
            Garden. Book your visit today!
          </p>
          <Link
            to="/pricing#pricing"
            className="btn btn-primary px-8 py-4 text-lg inline-block"
          >
            Book Your Experience
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
