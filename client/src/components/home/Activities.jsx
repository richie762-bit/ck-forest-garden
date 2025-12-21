import { Link } from 'react-router-dom';

/**
 * Activities Component
 * Showcases available activities
 */
const Activities = () => {
  const activities = [
    {
      image: '/assets/images/gallery/photography.jpg',
      title: 'Photography',
      description: 'Capture stunning landscapes and wildlife in picture-perfect settings.',
    },
    {
      image: '/assets/images/gallery/PicnicArea.jpg',
      title: 'Picnic Areas',
      description: 'Enjoy meals in designated picnic spots with tables and shelter.',
    },
    {
      image: '/assets/images/gallery/StreamActivities.jpg',
      title: 'Stream Activities',
      description: 'Cool off in natural streams and enjoy water-based recreation.',
    },
    {
      image: '/assets/images/gallery/groupEvents.jpg',
      title: 'Group Events',
      description: 'Host corporate retreats, family reunions, or team-building activities.',
    },
    {
      image: '/assets/images/gallery/Hiking.jpg',
      title: 'Hiking',
      description: 'Challenge yourself with various hiking trails for all skill levels.',
    },
    {
      image: '/assets/images/gallery/Relaxation.jpg',
      title: 'Relaxation',
      description: 'Unwind in peaceful surroundings with hammocks and quiet zones.',
    },
  ];

  return (
    <section id="activities" className="section bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Activities & <span className="gradient-text">Experiences</span>
          </h2>
          <p className="text-lg text-gray-600">
            From peaceful relaxation to exciting adventures, there's something for everyone at
            CK Forest Gardens.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => {
            return (
              <div
                key={index}
                className="card overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {activity.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{activity.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready for Your Adventure?
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Book your visit today and experience all the amazing activities CK Forest Gardens
              has to offer. Perfect for groups of 10 or more!
            </p>
            <Link
              to="/pricing#pricing"
              className="btn btn-accent px-8 py-4 text-lg inline-block"
            >
              View Packages & Book Now
            </Link>
          </div>
        </div>

        {/* Featured Banner */}
        <div className="mt-16">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/assets/images/gallery/Advert.jpg"
              alt="CK Forest Gardens Experience"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex items-end">
              <div className="p-8 md:p-12 w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Nature's Paradise Awaits
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  Create unforgettable memories in Guyana's premier eco-tourism destination
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
