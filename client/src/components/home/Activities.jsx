const activities = [
  {
    image: '/assets/images/gallery/campfire.jpg',
    title: 'Camping',
    description: 'Sleep under the stars in our A-frame pods or pitch your own tent. Gather round a campfire and let the forest night soundtrack carry you to sleep.',
  },
  {
    image: '/assets/images/gallery/PicnicArea.jpg',
    title: 'Day Visits',
    description: 'Arrive with family or friends for a full day in the forest. Use our shaded picnic areas, cook your own food, and spend the day exactly as you like.',
  },
  {
    image: '/assets/images/gallery/StreamActivities.jpg',
    title: 'Swimming and Streams',
    description: 'Cool off in our man-made natural pool or explore the streams and ponds scattered across the property. Perfect for a hot Guyanese afternoon.',
  },
  {
    image: '/assets/images/gallery/groupEvents.jpg',
    title: 'Group Events',
    description: 'Host corporate retreats, school trips, family reunions, or team-building days. The entire 60 acres is yours when you book as a group.',
  },
  {
    image: '/assets/images/gallery/Hiking.jpg',
    title: 'Guided Forest Tours',
    description: 'Walk with our guides through the fruit forest and learn about 30+ tropical varieties — from exotic citrus to rare Amazonian species.',
  },
  {
    image: '/assets/images/gallery/photography.jpg',
    title: 'Photography',
    description: 'Capture lush jungle landscapes, exotic fruit trees, wildlife, and the colours of a Guyanese sunrise. Every corner is a shot waiting to happen.',
  },
];

const Activities = () => {
  return (
    <section id="activities" className="section bg-gray-50">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="section-label">For Everyone</span>
          <h2 className="section-heading">
            What You Can <span className="gradient-text">Do Here</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Whether you are a camper, a day visitor, a nature lover, or bringing a group —
            CK Forest Gardens has something for you.
          </p>
        </div>

        {/* Activities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`card overflow-hidden hover:shadow-xl transition-all duration-300 group reveal reveal-delay-${(index % 3) + 1}`}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-display font-bold text-white">
                  {activity.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-16 reveal">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/assets/images/gallery/Relaxation.jpg"
              alt="Peaceful relaxation at CK Forest Gardens"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/40 to-transparent flex items-end">
              <div className="p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    Ready for Your Adventure?
                  </h3>
                  <p className="text-white/80 text-lg max-w-xl">
                    Book your visit and experience all that CK Forest Gardens has to offer.
                    Perfect for groups of 10 or more.
                  </p>
                </div>
                <a
                  href="https://ckforesttours.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-8 py-4 text-lg whitespace-nowrap shrink-0"
                >
                  View Packages
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
