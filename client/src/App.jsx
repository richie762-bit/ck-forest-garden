import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ActivitiesPage from './pages/ActivitiesPage';
import PricingPage from './pages/PricingPage';
import GalleryPage from './pages/GalleryPage';
import TermsPage from './pages/TermsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Admin Components
import PackagesList from './components/admin/PackagesList';
import GalleryManager from './components/admin/GalleryManager';

/**
 * App Component
 * Main application component with routing
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Redirect /admin to /admin/packages */}
            <Route index element={<Navigate to="/admin/packages" replace />} />
            <Route path="packages" element={<PackagesList />} />
            <Route path="gallery" element={<GalleryManager />} />
          </Route>

          {/* 404 - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Vercel Analytics */}
        <Analytics />
      </Router>
    </AuthProvider>
  );
}

export default App;
