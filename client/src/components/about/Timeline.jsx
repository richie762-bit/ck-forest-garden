import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Timeline Component
 * Showcases the journey and development of CK Forest Gardens over the years
 */
const Timeline = () => {
  const [expandedYear, setExpandedYear] = useState(null);

  const timelineEvents = [
    {
      year: '2007',
      month: 'September',
      title: 'The Beginning',
      description: 'After an accidental burning of the poolside area, nature began its first transformation - creating what would become the very first water hole at CK Forest Gardens.',
      images: [
        {
          src: '/assets/images/timeline/2007-poolsite-before.jpg',
          caption: 'Poolside area during accidental burning'
        },
        {
          src: '/assets/images/timeline/2007-poolsite-after.jpg',
          caption: 'After the burn - became the first water hole in 2007'
        }
      ],
      color: 'from-green-600 to-emerald-700'
    },
    {
      year: '2008',
      month: 'December',
      title: 'Early Development',
      description: 'Initial infrastructure development began, laying the foundation for what would become a nature paradise.',
      images: [
        {
          src: '/assets/images/timeline/2008-development.jpg',
          caption: 'Early construction and development phase'
        },
        {
          src: '/assets/images/timeline/dining-kitchen-area.jpg',
          caption: 'Site of present dining and kitchen area'
        }
      ],
      color: 'from-green-500 to-emerald-600'
    },
    {
      year: '2012',
      month: 'February - July',
      title: 'Expansion & Access',
      description: 'Major expansion with aerial planning and boat access established to the site, marking a significant milestone in accessibility.',
      images: [
        {
          src: '/assets/images/timeline/2012-overhead.jpg',
          caption: 'Aerial view of creek area for planning'
        },
        {
          src: '/assets/images/timeline/2012-boat.jpg',
          caption: 'First boat arrives at CK - July 2012'
        }
      ],
      color: 'from-teal-600 to-green-700'
    },
    {
      year: '2015',
      month: 'October - December',
      title: 'Major Infrastructure',
      description: 'East side development with first major dig to conservancy, transforming the landscape and water management systems.',
      images: [
        {
          src: '/assets/images/timeline/2015-east-side.jpg',
          caption: 'East side development - October 2015'
        },
        {
          src: '/assets/images/timeline/2015-first-dig.jpg',
          caption: 'Timelapse after first dig to conservancy'
        }
      ],
      color: 'from-emerald-600 to-green-700'
    },
    {
      year: '2016',
      month: 'August',
      title: 'Perimeter Development',
      description: 'Eastern perimeter dam construction, enhancing water conservation and site protection.',
      images: [
        {
          src: '/assets/images/timeline/2016-perimeter-dam.jpg',
          caption: 'Digging eastern perimeter dam'
        }
      ],
      color: 'from-green-700 to-teal-700'
    },
    {
      year: '2019',
      month: '',
      title: 'Facility Enhancement',
      description: 'Container facility added to the east side, providing essential infrastructure for visitors and operations. The old obstacle course area was transformed during this period.',
      images: [
        {
          src: '/assets/images/timeline/2019-container.jpg',
          caption: 'Container installation on east side'
        },
        {
          src: '/assets/images/timeline/obstacle-course.jpg',
          caption: 'Old obstacle course area before transformation'
        }
      ],
      color: 'from-teal-700 to-emerald-700'
    },
    {
      year: 'Today',
      month: '',
      title: 'Nature\'s Paradise',
      description: 'After years of careful development and dedication, CK Forest Gardens now welcomes visitors to experience the beauty of nature in a fully-equipped eco-tourism destination.',
      images: [
        {
          src: '/assets/images/gallery/Overhead.jpg',
          caption: 'CK Forest Gardens today - a thriving nature paradise'
        }
      ],
      color: 'from-primary-500 to-accent-600'
    }
  ];

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <section className="pt-12 pb-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-lg text-gray-600">
            Follow our journey through the years
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-300 via-primary-500 to-primary-300 hidden md:block"></div>

          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className={`relative ${
                  index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${event.color} shadow-lg border-4 border-white`}></div>
                </div>

                {/* Content Card */}
                <div
                  className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-r ${event.color} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">{event.year}</div>
                        {event.month && (
                          <div className="text-sm opacity-90 mt-1">{event.month}</div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleYear(event.year)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label={expandedYear === event.year ? 'Collapse' : 'Expand'}
                      >
                        {expandedYear === event.year ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold mt-4">{event.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>

                    {/* Expanded Images */}
                    {expandedYear === event.year && (
                      <div className="mt-6 space-y-4 animate-fade-in">
                        {event.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                          >
                            <img
                              src={image.src}
                              alt={image.caption}
                              className="w-full h-64 object-cover"
                              loading="lazy"
                            />
                            <div className="bg-gray-50 px-4 py-3">
                              <p className="text-sm text-gray-600 italic">{image.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Images Button */}
                  {!expandedYear && (
                    <div className="px-6 pb-6">
                      <button
                        onClick={() => toggleYear(event.year)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
                      >
                        View {event.images.length} {event.images.length === 1 ? 'Photo' : 'Photos'}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 max-w-2xl mx-auto border-2 border-primary-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Be Part of Our Story
            </h3>
            <p className="text-gray-700 mb-6">
              Visit CK Forest Gardens and create your own memories in this transformed paradise
            </p>
            <a
              href="/pricing#pricing"
              className="btn btn-primary px-8 py-3 inline-block"
            >
              Plan Your Visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
