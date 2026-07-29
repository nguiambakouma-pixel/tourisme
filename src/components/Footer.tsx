import { useState } from 'react';
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter, Youtube, Send, Heart } from 'lucide-react';
import { NAV_LINKS, socials } from '@/data';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand text-white relative overflow-hidden">
      {/* Orbes de fond */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky/25 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-0 mb-5">
              <div>
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="text-brand">Stay</span><span className="text-accent">Eat</span><span className="text-sky">See</span><span className="text-accent">+</span>
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-white/60 mt-0.5">Kribi · Cameroun</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Votre agence touristique premium à Kribi. Vivez le Cameroun authentique entre mer, forêt et culture locale.
            </p>
            <div className="flex gap-3">
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-sky hover:to-brand flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-sky hover:to-brand flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-sky hover:to-brand flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-sky hover:to-brand flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-base font-bold mb-5 text-accent-light">Liens rapides</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-light/60 group-hover:bg-accent-light group-hover:scale-150 transition-all"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold mb-5 text-accent-light">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-sky-light shrink-0 mt-0.5" />
                <span>Avenue du Port, Kribi, Cameroun</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-sky-light shrink-0" />
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">contact@stayeatsee.cm</a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-sky-light shrink-0" />
                <a href={`tel:+237688150361`} className="hover:text-white transition-colors">+237 6 88 15 03 61</a>
              </li>
              <li className="text-white/70">
                <span className="block font-medium text-white/90 mb-1">Horaires</span>
                Lun - Dim : 7h30 - 21h00
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-bold mb-5 text-accent-light">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">
              Recevez nos meilleures offres et inspirations de voyage directement par email.
            </p>
            {subscribed ? (
              <div className="glass-card rounded-2xl p-4 text-brand text-sm font-medium animate-scale-in">
                Merci ! Vous êtes maintenant abonné(e) à notre newsletter.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-accent-light focus:bg-white/15 transition-all"
                />
                <button type="submit" className="btn-sky-shimmer text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  S'abonner <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-white/60">© 2025 StayEatSee+. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-white/60">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">CGV</a>
          </div>
          <p className="text-white/60 flex items-center gap-1.5">
            Fait avec <Heart className="w-3.5 h-3.5 text-accent-light fill-accent-light" /> à Kribi
          </p>
        </div>
      </div>
    </footer>
  );
}
