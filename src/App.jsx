import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Components - Fixed paths
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import FloatingWhatsAppButton from './components/common/FloatingWhatsAppButton';

// Import Pages
import HomePage from './pages/HomePage';
import TendersPage from './pages/TendersPage';
import PostTenderPage from './pages/PostTenderPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import CategoryPage from './pages/CategoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CatalogSlugPage from './pages/CatalogSlugPage';
import WebsiteInfo from './pages/WebsiteInfo';
import LoginPage from './components/admin/Login';
import NotFoundPage from './pages/NotFoundPage';

// Import Admin Components
import AdminLogin from './components/admin/Login';
import AdminTenders from './components/admin/AdminTenders';
import AdminLayout from './components/admin/Layout';
import AdminDashboard from './components/admin/Dashboard';
import CategoriesManagement from './components/admin/CategoriesManagement';
import ServicesManagement from './components/admin/ServicesManagement';
import ServiceMediaManagement from './components/admin/ServiceMediaManagement';
import InquiriesManagement from './components/admin/InquiriesManagement';
import BlogsManagement from './components/admin/BlogsManagement';
import GalleryManagement from './components/admin/GalleryManagement';

import './App.css';

// Admin Router Component with Authentication
const AdminRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="service-media" element={<ServiceMediaManagement />} />
        <Route path="blogs" element={<BlogsManagement />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="inquiries" element={<InquiriesManagement />} />
        <Route path="/tenders" element={<AdminTenders />} />
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};
function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>

          {/* Login Pages - No Header/Footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/*" element={<AdminRouter />} />

          {/* Website Layout with Header/Footer */}
          <Route
            path="/*"
            element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />

                <Box component="main" sx={{ flex: 1, pb: { xs: '68px', md: 0 }, minWidth: 0 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tenders" element={<TendersPage />} />
                    <Route path="/post-tender" element={<PostTenderPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blogs" element={<BlogListPage />} />
                    <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:slug" element={<CatalogSlugPage />} />
                    <Route path="/services/:categorySlug/:serviceSlug" element={<ServiceDetailPage />} />
                    <Route path="/website-info" element={<WebsiteInfo />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Box>

                <Footer />
                <FloatingWhatsAppButton />
              </Box>
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
