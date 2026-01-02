import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Menu, X, Trees, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Header Component
 * Navigation header with responsive mobile menu
 */
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/images/logo/Logo.jpg"
              alt="CK Forest Gardens Logo"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500 group-hover:ring-green-600 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">CK Forest Gardens</span>
              <span className="text-xs text-green-600">Nature's Paradise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`
              }
            >
              Activities
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`
              }
            >
              Packages
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`
              }
            >
              Gallery
            </NavLink>

            {/* Admin Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
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
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-left font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-left font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/activities"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-left font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Activities
              </NavLink>
              <NavLink
                to="/pricing"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-left font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Packages
              </NavLink>
              <NavLink
                to="/gallery"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-left font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                Gallery
              </NavLink>

              {/* Admin Links Mobile */}
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
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
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
