import { Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/assets/images/logo/Logo.jpg"
                alt="CK Forest Gardens"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-500"
              />
              <div>
                <span className="text-lg font-bold text-white block leading-tight">CK Forest Gardens</span>
                <span className="text-xs text-primary-400 font-medium">Nature's Paradise</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Guyana's premier eco-tourism destination. Sixty acres of living fruit forest
              for campers, day visitors, volunteers, and nature lovers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Activities', to: '/activities' },
                { label: 'Packages', to: '/pricing' },
                { label: 'Gallery', to: '/gallery' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  Plot A Badrima,<br />East Bank Demerara, Guyana
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-primary-500 shrink-0" />
                <a
                  href="https://wa.me/5927122534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  WhatsApp: +592 712-2534
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <a
                  href="mailto:info@ckforestgarden.com"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  info@ckforestgarden.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Book */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Follow Us</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/CKForestGardens"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5927122534"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <a
              href="https://ckforesttours.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full text-center py-3 text-sm"
            >
              Book Your Visit
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {year} CK Forest Gardens. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
