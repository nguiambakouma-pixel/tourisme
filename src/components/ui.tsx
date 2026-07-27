import { Compass } from 'lucide-react';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export function SectionTitle({ badge, title, subtitle, center, light }: SectionTitleProps) {
  return (
    <div className={`reveal ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-xl'} mb-12`}>
      {badge && <span className="section-badge mb-4">{badge}</span>}
      <h2 className={`font-serif text-4xl md:text-5xl font-bold mt-4 leading-tight ${light ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/80' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const txt = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl';
  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} rounded-2xl bg-gradient-to-br from-ocean to-forest flex items-center justify-center shadow-ocean`}>
        <Compass className="w-1/2 h-1/2 text-white" />
      </div>
      <div className="leading-none">
        <span className={`${txt} font-extrabold text-navy tracking-tight`}>StayEatSee<span className="text-gold">+</span></span>
        <span className="block text-[9px] tracking-[0.25em] text-slate-500 font-medium mt-0.5">Kribi · Cameroun</span>
      </div>
    </div>
  );
}

export function WaveDivider({ color = 'white', flip = false }: { color?: string; flip?: boolean }) {
  const fills: Record<string, string> = {
    white: '#ffffff',
    navy: '#0A2540',
    ocean: '#0E5E8C',
    forest: '#E8F5EE',
    sand: '#F5E6D3',
  };
  return (
    <div className="wave-container" style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16 md:h-24">
        <path fill={fills[color] || color} d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z"></path>
      </svg>
    </div>
  );
}

interface StarRatingProps { rating: number; size?: number }
export function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(rating) ? 'text-gold-light' : 'text-slate-300'}
          style={{ fontSize: size }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
}

export function PageHero({ badge, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-ocean opacity-80"></div>
      </div>
      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto animate-fade-in-up">
        <span className="section-badge mb-5" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}>
          {badge}
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight">{title}</h1>
        <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}
