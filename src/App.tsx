import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LoginPage } from '@/pages/admin/LoginPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { ExperiencesAdminPage } from '@/pages/admin/ExperiencesAdminPage';
import { AccommodationsAdminPage } from '@/pages/admin/AccommodationsAdminPage';
import { BlogAdminPage } from '@/pages/admin/BlogAdminPage';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ExperiencesPage } from '@/pages/ExperiencesPage';
import { AccommodationsPage } from '@/pages/AccommodationsPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { BlogPage } from '@/pages/BlogPage';
import { ContactPage } from '@/pages/ContactPage';
import { CartDrawer } from '@/components/CartDrawer';

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
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="experiences" element={<ExperiencesAdminPage />} />
            <Route path="accommodations" element={<AccommodationsAdminPage />} />
            <Route path="blog" element={<BlogAdminPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    );
  }

  /* ── Site public : Navbar, main, Footer ── */
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar currentPage={page} onNavigate={handleNavigate} />
      <CartDrawer />
      <main className="page-enter">
        <Routes>
          <Route path="/"               element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/experiences"    element={<ExperiencesPage onNavigate={handleNavigate} />} />
          <Route path="/accommodations" element={<AccommodationsPage onNavigate={handleNavigate} />} />
          <Route path="/gallery"        element={<GalleryPage />} />
          <Route path="/blog"           element={<BlogPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;