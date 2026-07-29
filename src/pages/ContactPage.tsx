import { useState } from 'react';
import { MapPin, Mail, Phone, Clock, MessageCircle, Send, CheckCircle2, Instagram, Facebook, Twitter } from 'lucide-react';
import { PageHero, SectionTitle } from '@/components/ui';
import { usePageMeta, useScrollReveal } from '@/hooks';

export function ContactPage() {
  usePageMeta('Contact | StayEatSee+', 'Contactez StayEatSee+ pour organiser votre séjour à Kribi : réservations, questions, devis personnalisés.');
  useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'ae59c96b-b736-451a-b331-69545f1763f8',
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: 'Nouvelle demande depuis le site StayEatSee+',
          from_name: 'StayEatSee+ Website',
          message: form.message,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        setError(true);
        setTimeout(() => setError(false), 5000);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const CONTACT_INFO = [
    { icon: MapPin,  label: 'Adresse',   value: 'Avenue du Port, Kribi, Cameroun' },
    { icon: Mail,    label: 'Email',     value: 'contact@stayeatsee.cm' },
    { icon: Phone,   label: 'Téléphone', value: '+237 6 80 12 34 56' },
    { icon: Clock,   label: 'Horaires',  value: 'Lun - Dim : 7h30 - 21h00' },
  ];

  return (
    <div className="page-enter">
      <PageHero
        badge="Contact"
        title="Parlons de votre voyage"
        subtitle="Une question, une idée, un projet ? Notre équipe vous répond avec plaisir et réactivité."
        image="https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <section className="py-22 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="reveal-left">
              <span className="section-badge mb-4">Écrivez-nous</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mt-4 mb-8 leading-tight">
                Envoyez-nous un message
              </h2>

              {sent ? (
                <div className="bg-forest-pale border border-forest/30 rounded-3xl p-10 text-center animate-scale-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-forest flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-9 h-9 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-navy mb-2">Message envoyé !</h3>
                  <p className="text-slate-600">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-300 rounded-2xl p-5 text-center animate-scale-in">
                      <p className="text-red-700 font-semibold">Une erreur est survenue, merci de réessayer ou de nous contacter directement par téléphone.</p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Nom complet" required>
                      <input type="text" required value={form.name} onChange={update('name')} placeholder="Votre nom" className={inputCls} />
                    </Field>
                    <Field label="Email" required>
                      <input type="email" required value={form.email} onChange={update('email')} placeholder="vous@email.com" className={inputCls} />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Téléphone">
                      <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+237 ..." className={inputCls} />
                    </Field>
                    <Field label="Sujet" required>
                      <input type="text" required value={form.subject} onChange={update('subject')} placeholder="Objet du message" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Message" required>
                    <textarea required value={form.message} onChange={update('message')} rows={5} placeholder="Votre message..." className={`${inputCls} resize-none`}></textarea>
                  </Field>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-shimmer text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 shadow-ocean group w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Envoi...' : (<>Envoyer le message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>)}
                  </button>
                </form>
              )}
            </div>

            {/* Info + map */}
            <div className="reveal-right space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {CONTACT_INFO.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <div key={i} className="bg-gradient-to-br from-ocean-pale to-forest-pale rounded-2xl p-6 card-hover">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ocean to-forest flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{info.label}</p>
                      <p className="text-navy font-semibold mt-1">{info.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-forest rounded-2xl p-6 text-white hover:shadow-forest transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold">WhatsApp direct</p>
                  <p className="text-white/85 text-sm">Discutez avec nous en temps réel</p>
                </div>
              </a>

              {/* Fictive map */}
              <div className="rounded-3xl overflow-hidden shadow-xl2 h-64 relative bg-ocean-pale">
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-pale to-forest-pale"></div>
                <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-30">
                  <path d="M0,180 Q100,160 200,170 T400,180 L400,300 L0,300 Z" fill="#0E5E8C" />
                  <path d="M0,190 Q100,175 200,185 T400,195" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
                  <line x1="50" y1="0" x2="50" y2="300" stroke="#fff" strokeWidth="1" opacity="0.2" />
                  <line x1="150" y1="0" x2="150" y2="300" stroke="#fff" strokeWidth="1" opacity="0.2" />
                  <line x1="250" y1="0" x2="250" y2="300" stroke="#fff" strokeWidth="1" opacity="0.2" />
                  <line x1="350" y1="0" x2="350" y2="300" stroke="#fff" strokeWidth="1" opacity="0.2" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#fff" strokeWidth="1" opacity="0.2" />
                  <line x1="0" y1="160" x2="400" y2="160" stroke="#fff" strokeWidth="1" opacity="0.2" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-ocean to-forest flex items-center justify-center animate-pulse-ring shadow-xl2">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p className="mt-3 font-serif text-lg font-bold text-navy">Kribi, Cameroun</p>
                  <p className="text-slate-600 text-sm">Avenue du Port</p>
                </div>
              </div>

              {/* Social */}
              <div className="flex items-center gap-3">
                <span className="text-slate-600 font-medium text-sm">Suivez-nous :</span>
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-gradient-to-br hover:from-ocean hover:to-forest flex items-center justify-center transition-all hover:scale-110 hover:text-white text-navy"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-navy placeholder-slate-400 focus:outline-none focus:border-ocean focus:bg-white focus:ring-2 focus:ring-ocean/20 transition-all';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy mb-2">
        {label} {required && <span className="text-ocean">*</span>}
      </span>
      {children}
    </label>
  );
}
