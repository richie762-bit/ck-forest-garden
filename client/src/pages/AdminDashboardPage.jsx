import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, LogOut, Trees, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { getGreeting } from '../utils/helpers';

/**
 * AdminDashboardPage Component
 * Admin dashboard layout with collapsible sidebar navigation
 */
const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItems = [
    {
      path: '/admin/packages',
      icon: Package,
      label: 'Packages',
    },
    {
      path: '/admin/gallery',
      icon: Image,
      label: 'Gallery',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/logo/Logo.jpg"
              alt="CK Forest Gardens Logo"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CK Forest Gardens</h1>
              <p className="text-xs text-green-600">Admin Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{getGreeting()}!</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-sm min-h-[calc(100vh-73px)] sticky top-[73px] transition-all duration-300 relative`}>
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors z-10"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Back to Home */}
            <Link
              to="/"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors`}
              title={sidebarCollapsed ? 'View Website' : ''}
            >
              <Trees className="w-5 h-5" />
              {!sidebarCollapsed && <span>View Website</span>}
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
