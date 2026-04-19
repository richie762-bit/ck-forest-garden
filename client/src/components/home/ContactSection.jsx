import { MapPin, Mail, MessageCircle, Facebook } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="section bg-gray-900 text-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-xs md:text-sm uppercase tracking-widest font-semibold text-primary-400 mb-3 block">
            Find Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-400">
            Ready to visit? Have a question? We would love to hear from you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <a
            href="https://wa.me/5927122534"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center p-8 bg-gray-800 hover:bg-primary-600 rounded-2xl transition-colors duration-300 reveal"
          >
            <div className="w-14 h-14 bg-primary-600 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-5 transition-colors">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">WhatsApp</h3>
            <p className="text-gray-400 group-hover:text-white/80 text-sm transition-colors">
              +592 712-CKFG (2534)
            </p>
            <p className="text-primary-400 group-hover:text-white/60 text-xs mt-2 transition-colors">
              Tap to open WhatsApp
            </p>
          </a>

          <a
            href="mailto:info@ckforestgarden.com"
            className="group flex flex-col items-center text-center p-8 bg-gray-800 hover:bg-primary-600 rounded-2xl transition-colors duration-300 reveal reveal-delay-2"
          >
            <div className="w-14 h-14 bg-primary-600 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-5 transition-colors">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <p className="text-gray-400 group-hover:text-white/80 text-sm transition-colors">
              info@ckforestgarden.com
            </p>
            <p className="text-primary-400 group-hover:text-white/60 text-xs mt-2 transition-colors">
              We reply within 24 hours
            </p>
          </a>

          <div className="flex flex-col items-center text-center p-8 bg-gray-800 rounded-2xl reveal reveal-delay-3">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-5">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Address</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plot A Badrima,<br />
              East Bank Demerara,<br />
              Guyana
            </p>
          </div>
        </div>

        {/* Directions block with image */}
        <div className="bg-gray-800 rounded-3xl overflow-hidden reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative">
              <img
                src="/assets/images/timeline/2012-overhead.jpg"
                alt="Aerial view showing the approach to CK Forest Gardens"
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/80 hidden lg:block" />
            </div>
            <div className="p-8 md:p-12">
              <h3 className="font-display text-2xl font-bold text-white mb-6">Directions</h3>
              <ol className="space-y-4 text-gray-400 text-sm">
                {[
                  'Head to Timehri-Soesdyke Junction on the East Bank Demerara.',
                  'Take the Linden-Soesdyke Highway heading towards Laluni.',
                  'Look for the turnoff near the new Silica City development.',
                  'Follow the sand and red loam road for approximately 2.5 miles — we are at the end.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://ckforesttours.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-6 py-3 text-center"
                >
                  Book Your Visit
                </a>
                <a
                  href="https://www.facebook.com/CKForestGardens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border-2 border-gray-600 text-gray-300 hover:border-primary-500 hover:text-primary-400 px-6 py-3 inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Follow on Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
