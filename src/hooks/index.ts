import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

export function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      ref.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [speed]);
  return ref;
}

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, [title, description]);
}

export function useExperiences() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('experiences')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        setData((data ?? []).map((e) => ({
          id: e.id, title: e.title, description: e.description, price: e.price,
          duration: e.duration, category: e.category, badge: e.badge,
          badgeColor: e.badge_color, image: e.image,
        })));
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useAccommodations() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('accommodations')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        setData((data ?? []).map((a) => ({
          id: a.id, title: a.title, type: a.type, price: a.price, rating: a.rating,
          reviews: a.reviews, features: a.features ?? [], image: a.image, description: a.description,
        })));
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useBlogPosts() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        setData((data ?? []).map((b) => ({
          id: b.id, title: b.title, excerpt: b.excerpt, content: b.content,
          category: b.category, date: b.date, readTime: b.read_time, image: b.image, author: b.author,
        })));
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}