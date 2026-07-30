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
      {badge && <span className="section-badge mb-6">{badge}</span>}
      <h2 className={`font-serif text-4xl md:text-5xl font-semibold leading-tight tracking-tight ${light ? 'text-white' : 'text-brand'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed max-w-[650px] ${light ? 'text-white/80' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const txt = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl';
  return (
    <div className="flex items-center">
      <div className="leading-none">
        <span className={`${txt} font-extrabold tracking-tight`}>
          <span className="text-brand">Stay</span><span className="text-accent">Eat</span><span className="text-sky">See</span><span className="text-accent">+</span>
        </span>
        <span className="block text-[9px] tracking-[0.25em] text-slate-500 font-medium mt-0.5">Kribi · Cameroun</span>
      </div>
    </div>
  );
}

export function WaveDivider({ color = 'white', flip = false }: { color?: string; flip?: boolean }) {
  const fills: Record<string, string> = {
    white:  '#ffffff',
    brand:  '#1A3C7A',
    sky:    '#3EABD4',
    accent: '#D4572A',
    sand:   '#F5E6D3',
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
          className={i <= Math.round(rating) ? 'text-accent' : 'text-slate-300'}
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
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>
      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto animate-fade-in-up">
        <span className="section-badge mb-5" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}>
          {badge}
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white leading-tight tracking-tight">{title}</h1>
        <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed max-w-[650px] mx-auto">{subtitle}</p>
      </div>
    </section>
  );
}