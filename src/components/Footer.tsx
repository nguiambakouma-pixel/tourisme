import { useState } from 'react';
import { Compass, MapPin, Mail, Phone, Instagram, Facebook, Twitter, Youtube, Send, Heart } from 'lucide-react';
import { NAV_LINKS } from '@/data';

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
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ocean/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-forest/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean to-forest flex items-center justify-center">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold">StayEatSee<span className="text-gold-light">+</span></span>
                <span className="block text-[10px] tracking-[0.25em] text-white/60 mt-0.5">Kribi · Cameroun</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Votre agence touristique premium à Kribi. Vivez le Cameroun authentique entre mer, forêt et culture locale.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-ocean hover:to-forest flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-base font-bold mb-5 text-gold-light">Liens rapides</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-light/60 group-hover:bg-gold-light group-hover:scale-150 transition-all"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold mb-5 text-gold-light">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-ocean-light shrink-0 mt-0.5" />
                <span>Avenue du Port, Kribi, Cameroun</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-ocean-light shrink-0" />
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">contact@stayeatsee.cm</a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-ocean-light shrink-0" />
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">+237 6 80 12 34 56</a>
              </li>
              <li className="text-white/70">
                <span className="block font-medium text-white/90 mb-1">Horaires</span>
                Lun - Dim : 7h30 - 21h00
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-bold mb-5 text-gold-light">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">
              Recevez nos meilleures offres et inspirations de voyage directement par email.
            </p>
            {subscribed ? (
              <div className="glass-card rounded-2xl p-4 text-navy text-sm font-medium animate-scale-in">
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
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-gold-light focus:bg-white/15 transition-all"
                />
                <button type="submit" className="btn-green-shimmer text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
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
            Fait avec <Heart className="w-3.5 h-3.5 text-gold-light fill-gold-light" /> à Kribi
          </p>
        </div>
      </div>
    </footer>
  );
}
