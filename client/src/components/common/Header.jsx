import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Activities', to: '/activities' },
    { label: 'Gallery', to: '/gallery' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-white shadow-md'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <img
              src="/assets/images/logo/Logo.jpg"
              alt="CK Forest Gardens"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500 group-hover:ring-primary-600 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">CK Forest Gardens</span>
              <span className="text-xs text-primary-600 font-medium">Nature's Paradise</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-medium transition-colors text-sm ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium text-sm transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            <a
              href="https://ckforesttours.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary px-5 py-2.5 text-sm ml-2"
            >
              Book Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col gap-4">
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `font-medium transition-colors text-left ${
                      isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <a
                href="https://ckforesttours.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-center py-3"
                onClick={closeMobileMenu}
              >
                Book Now
              </a>

              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-colors mb-4"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={closeMobileMenu}
                    className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
