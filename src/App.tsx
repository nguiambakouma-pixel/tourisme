import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ExperiencesPage } from '@/pages/ExperiencesPage';
import { AccommodationsPage } from '@/pages/AccommodationsPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { BlogPage } from '@/pages/BlogPage';
import { ContactPage } from '@/pages/ContactPage';

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

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar currentPage={page} onNavigate={handleNavigate} />

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
