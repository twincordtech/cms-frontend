// ===============================
// File: App.jsx
// Description: Main application component with route configuration, authentication, and layout management.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SetPassword from './pages/auth/SetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Public Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PageContent from './pages/PageContent';

// Protected Pages
import Dashboard from './pages/dashboard/Dashboard';
import SectionsList from './pages/dashboard/SectionsList';
import SectionEditor from './pages/dashboard/SectionEditor';
import PagesList from './pages/dashboard/PagesList';
import PageForm from './pages/dashboard/PageForm';
import SectionForm from './pages/dashboard/SectionForm';
import Profile from './pages/dashboard/Profile';
import ApiPlayground from './pages/dashboard/ApiPlayground';
import UserRegistration from './pages/dashboard/UserRegistration';
import Users from './pages/dashboard/Users';
import MediaLibrary from './pages/dashboard/MediaLibrary';
import PublicPage from './pages/PublicPage';
import NewsletterDashboard from './pages/dashboard/NewsletterDashboard';
import BlogDashboard from './pages/dashboard/BlogDashboard';
import BlogForm from './pages/dashboard/BlogForm';
import DynamicComponents from './pages/dashboard/DynamicComponents';
import LayoutDashboard from './pages/dashboard/LayoutDashboard';
import ComponentBuilder from './pages/dashboard/ComponentBuilder';
import ContentDashboard from './pages/dashboard/ContentDashboard';
import ContentForm from './pages/dashboard/ContentForm';
import LayoutComponentView from './pages/dashboard/LayoutComponentView';
import LeadsManagement from './pages/dashboard/LeadsManagement';
import InquiriesManagement from './pages/dashboard/InquiriesManagement';
import ActivityHistoryPage from './pages/dashboard/ActivityHistoryPage';

// Components
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import { useAuth } from './contexts/AuthContext';
import NewsletterSubscribe from './components/NewsletterSubscribe';
import LeadForm from './components/global/LeadForm';
import InquiryForm from './components/global/InquiryForm';
import FormsList from './pages/dashboard/forms';
import FormBuilderPage from './pages/dashboard/FormBuilderPage';
import FormRenderPage from './pages/dashboard/FormRenderPage';

function useMinScreenWidth(minWidth = 800) {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsSmall(window.innerWidth < minWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth]);
  return isSmall;
}

/**
 * App is the root component for the CMS application.
 * Handles route configuration, authentication, and layout management.
 * @component
 */
function App() {
  const { user } = useAuth();
  const isSmallScreen = useMinScreenWidth(800);

  if (isSmallScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white text-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 flex flex-col items-center">
          {/* Friendly illustration/icon */}
          <svg className="mx-auto mb-4 h-14 w-14 text-blue-500" fill="none" viewBox="0 0 48 48" stroke="currentColor">
            <circle cx="24" cy="24" r="22" strokeWidth="2" fill="#e0f2fe" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M24 32v-8m0-8h.01" />
            <circle cx="24" cy="24" r="20" stroke="#3b82f6" strokeWidth="2" fill="none" />
          </svg>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome to Fentro CMS</h2>
          <p className="text-gray-600 mb-3 text-base">We're excited to have you try our modern content management platform.</p>
          <div className="mb-4 text-gray-700 text-sm">
            <span className="font-semibold text-blue-600">Fentro CMS</span> is best experienced on a device with a screen width of at least <span className="font-semibold">800px</span> (such as a laptop or desktop).<br />
            <span className="text-gray-500">Some features may not display correctly on smaller screens.</span>
          </div>
          <div className="mb-4 text-gray-500 text-sm">
            <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">Mobile & tablet support is coming soon!</span>
          </div>
          <p className="text-gray-400 text-xs">Thank you for your patience and understanding as we work to make Fentro CMS accessible on all devices.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast notifications for user feedback */}
      <ToastContainer />
      {/* AnimatePresence enables route transitions */}
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route index element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="set-password/:token" element={<SetPassword />} />
            <Route path="pages/:slug" element={<PublicPage />} />
            <Route path="newsletter/subscribe" element={<NewsletterSubscribe />} />
            <Route path="newsletter/lead-form" element={<LeadForm />} />
            <Route path="inquiries" element={<InquiryForm />} />
            <Route path="blog/:slug" element={<PublicPage />} />
          </Route>

          {/* Dashboard Routes (protected) */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<LeadsManagement />} />

              {/* Admin Routes (nested) */}
              <Route element={<AdminRoute />}>
                <Route path="sections" element={<SectionsList />} />
                <Route path="sections/new" element={<SectionForm />} />
                <Route path="sections/edit/:id" element={<SectionEditor />} />
                <Route path="pages" element={<PagesList />} />
                <Route path="pages/new" element={<PageForm />} />
                <Route path="pages/edit/:id" element={<PageForm />} />
                <Route path="blogs" element={<BlogDashboard />} />
                <Route path="blogs/new" element={<BlogForm />} />
                <Route path="blogs/edit/:id" element={<BlogForm />} />
                <Route path="leads" element={<LeadsManagement />} />
                <Route path="inquiries" element={<InquiriesManagement />} />
                <Route path="api-playground" element={<ApiPlayground />} />
                <Route path="users" element={<Users />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="newsletter" element={<NewsletterDashboard />} />
                <Route path="components" element={<DynamicComponents />} />
                <Route path="layouts" element={<LayoutDashboard />} />
                <Route path="components/new" element={<ComponentBuilder />} />
                <Route path="content" element={<ContentDashboard />} />
                <Route path="content/new" element={<ContentForm />} />
                <Route path="content/edit/:id" element={<ContentForm />} />
                <Route path="content/view/:id" element={<LayoutComponentView />} />
                <Route path="activity-history" element={<ActivityHistoryPage />} />
                <Route path="forms" element={<FormsList />} />
                <Route path="form-builder" element={<FormBuilderPage />} />
                <Route path="forms/:formId" element={<FormRenderPage />} />
                <Route
                  path="components/edit/:id"
                  element={
                    <PrivateRoute>
                      <ComponentBuilder />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Route>
          </Route>

          {/* Redirect root to dashboard for authenticated users */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
// ===============================
// End of File: App.jsx
// Description: Main application component with route configuration
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 