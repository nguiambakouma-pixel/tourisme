import { useEffect, useState } from 'react';
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

function App() {
  const [page, setPage] = useState<Page>('home');

  const handleNavigate = (p: string) => setPage(p as Page);

  useEffect(() => {
    document.title = `StayEatSee+ | ${pageTitle(page)}`;
  }, [page]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar currentPage={page} onNavigate={handleNavigate} />

      <main key={page} className="page-enter">
        {page === 'home'           && <HomePage onNavigate={handleNavigate} />}
        {page === 'about'          && <AboutPage />}
        {page === 'experiences'    && <ExperiencesPage onNavigate={handleNavigate} />}
        {page === 'accommodations' && <AccommodationsPage onNavigate={handleNavigate} />}
        {page === 'gallery'        && <GalleryPage />}
        {page === 'blog'           && <BlogPage />}
        {page === 'contact'        && <ContactPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

function pageTitle(p: Page): string {
  const titles: Record<Page, string> = {
    home: 'Explorez Kribi Autrement',
    about: 'À propos',
    experiences: 'Nos expériences',
    accommodations: 'Hébergements',
    gallery: 'Galerie',
    blog: 'Blog',
    contact: 'Contact',
  };
  return titles[p];
}

export default App;
