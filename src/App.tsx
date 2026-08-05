import { lazy, Suspense } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

// Lazy-loaded page components - code split at route level
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ExperiencesPage = lazy(() => import('@/pages/ExperiencesPage').then(m => ({ default: m.ExperiencesPage })));
const AccommodationsPage = lazy(() => import('@/pages/AccommodationsPage').then(m => ({ default: m.AccommodationsPage })));
const GalleryPage = lazy(() => import('@/pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const CartDrawer = lazy(() => import('@/components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const CustomerProtectedRoute = lazy(() => import('@/components/CustomerProtectedRoute').then(m => ({ default: m.CustomerProtectedRoute })));
const MyReservationsPage = lazy(() => import('@/pages/account/MyReservationsPage').then(m => ({ default: m.MyReservationsPage })));

// Admin pages - lazy loaded
const LoginPage = lazy(() => import('@/pages/admin/LoginPage').then(m => ({ default: m.LoginPage })));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })));
const ExperiencesAdminPage = lazy(() => import('@/pages/admin/ExperiencesAdminPage').then(m => ({ default: m.ExperiencesAdminPage })));
const AccommodationsAdminPage = lazy(() => import('@/pages/admin/AccommodationsAdminPage').then(m => ({ default: m.AccommodationsAdminPage })));
const BlogAdminPage = lazy(() => import('@/pages/admin/BlogAdminPage').then(m => ({ default: m.BlogAdminPage })));
const GalleryAdminPage = lazy(() => import('@/pages/admin/GalleryAdminPage').then(m => ({ default: m.GalleryAdminPage })));
const CustomersAdminPage = lazy(() => import('@/pages/admin/CustomersAdminPage').then(m => ({ default: m.CustomersAdminPage })));
const ProtectedRoute = lazy(() => import('@/components/admin/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));

// Minimal loading fallback - just a blank div with background color to avoid layout shift
function PageFallback() {
  return <div className="min-h-screen bg-white" />;
}

function AdminFallback() {
  return <div className="min-h-screen bg-slate-50" />;
}

export type Page =
  | 'home' | 'about' | 'experiences'
  | 'accommodations' | 'gallery' | 'blog' | 'contact';

function currentPageFromPath(pathname: string): Page {
  const seg = pathname.replace(/^\//, '');
  return (seg === '' ? 'home' : seg) as Page;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const page = currentPageFromPath(location.pathname);
  const handleNavigate = (p: string) => navigate(p === 'home' ? '/' : `/${p}`);

  const isAdmin = location.pathname.startsWith('/admin');

  /* ── Admin layout : sans Navbar, sans Footer, sans <main> public ── */
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="experiences" element={<ExperiencesAdminPage />} />
              <Route path="accommodations" element={<AccommodationsAdminPage />} />
              <Route path="blog" element={<BlogAdminPage />} />
              <Route path="gallery" element={<GalleryAdminPage />} />
              <Route path="customers" element={<CustomersAdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  /* ── Site public : Navbar, main, Footer ── */
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar currentPage={page} onNavigate={handleNavigate} />
      <Suspense fallback={<PageFallback />}>
        <CartDrawer />
        <AuthModal />
        <main className="page-enter">
          <Routes>
            <Route path="/"               element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/about"          element={<AboutPage />} />
            <Route path="/experiences"    element={<ExperiencesPage onNavigate={handleNavigate} />} />
            <Route path="/accommodations" element={<AccommodationsPage onNavigate={handleNavigate} />} />
            <Route path="/gallery"        element={<GalleryPage />} />
            <Route path="/blog"           element={<BlogPage />} />
            <Route path="/contact"        element={<ContactPage />} />
            <Route path="/compte" element={<CustomerProtectedRoute><MyReservationsPage /></CustomerProtectedRoute>} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Suspense>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;