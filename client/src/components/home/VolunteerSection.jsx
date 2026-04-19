import { Heart, Leaf, Sun, Users, Mail, MessageCircle } from 'lucide-react';

const roles = [
  {
    icon: Leaf,
    title: 'Tree Planting',
    description: 'Help expand our fruit forest by planting and nurturing new tropical species alongside our experienced team.',
  },
  {
    icon: Sun,
    title: 'Trail Maintenance',
    description: 'Keep the forest accessible and beautiful by clearing and maintaining walking trails and recreational areas.',
  },
  {
    icon: Users,
    title: 'Visitor Guiding',
    description: 'Share your passion for nature by guiding visitors through the forest and teaching them about tropical fruits.',
  },
  {
    icon: Heart,
    title: 'Conservation Work',
    description: 'Assist with water management, pond maintenance, and the general ecological stewardship of the land.',
  },
];

const VolunteerSection = () => {
  return (
    <section id="volunteer" className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image collage using timeline photos */}
          <div className="grid grid-cols-2 gap-4 reveal">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                <img
                  src="/assets/images/timeline/2015-first-dig.jpg"
                  alt="Land clearing work at CK Forest Gardens"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                <img
                  src="/assets/images/timeline/2008-development.jpg"
                  alt="Early development at CK Forest Gardens"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
                <img
                  src="/assets/images/timeline/2019-container.jpg"
                  alt="Facility installation at CK Forest Gardens"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                <img
                  src="/assets/images/timeline/2016-perimeter-dam.jpg"
                  alt="Perimeter dam construction"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="reveal reveal-delay-2">
            <span className="section-label">Get Involved</span>
            <h2 className="section-heading mb-6">
              Volunteer With <span className="gradient-text">Us</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              CK Forest Gardens was built through years of dedication, hard work, and a shared love
              of the natural world. We welcome volunteers who want to roll up their sleeves,
              connect with the land, and help us keep this living forest thriving for future generations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-10">
              Whether you are a nature enthusiast, a student seeking hands-on experience, or simply
              someone who wants to give back to the environment, there is a meaningful role for you here.
            </p>

            {/* Roles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {roles.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:info@ckforestgarden.com"
                className="btn btn-primary px-8 py-3 inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
              <a
                href="https://wa.me/5927122534"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary px-8 py-3 inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
