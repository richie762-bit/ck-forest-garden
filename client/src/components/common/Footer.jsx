import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Site footer with contact info and social links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/images/logo/Logo.jpg"
                alt="CK Forest Gardens Logo"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">CK Forest Gardens</span>
                <span className="text-xs text-green-400">Nature's Paradise</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Experience the beauty of nature in Guyana's premier eco-tourism destination.
              Book your adventure today!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/activities"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Georgetown, Guyana
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a
                  href="tel:+5927122534"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  +592 712 2534
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a
                  href="https://wa.me/5927122534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  WhatsApp: +592 712 2534
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a
                  href="mailto:info@ckforestgarden.com"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  info@ckforestgarden.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/CKForestGardens"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Stay connected for updates, special offers, and nature insights.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} CK Forest Gardens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
