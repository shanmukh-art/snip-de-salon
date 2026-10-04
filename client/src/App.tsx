import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Global Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AdminLayout } from './components/admin/AdminLayout';

// Public & Customer Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { OffersPage } from './pages/OffersPage';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { MyAppointmentsPage } from './pages/customer/MyAppointmentsPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { ProfileSettingsPage } from './pages/customer/ProfileSettingsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCalendarPage } from './pages/admin/AdminCalendarPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-salon-gold">Verifying salon credentials...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0c0c0e]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public & Customer Routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
              <Route path="/offers" element={<PublicLayout><OffersPage /></PublicLayout>} />
              <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
              <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
              <Route path="/order-confirmation/:orderNumber" element={<PublicLayout><OrderConfirmationPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

              {/* Customer Account Routes */}
              <Route path="/my-appointments" element={<PublicLayout><MyAppointmentsPage /></PublicLayout>} />
              <Route path="/my-orders" element={<PublicLayout><MyOrdersPage /></PublicLayout>} />
              <Route path="/profile" element={<PublicLayout><ProfileSettingsPage /></PublicLayout>} />

              {/* Admin Portal Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="calendar" element={<AdminCalendarPage />} />
                <Route path="appointments" element={<AdminAppointmentsPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="staff" element={<AdminStaffPage />} />
                <Route path="offers" element={<AdminOffersPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
