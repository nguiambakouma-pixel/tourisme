import { Compass, Eye, Heart, Users, Leaf, Award, Sparkles } from 'lucide-react';
import { PageHero, SectionTitle, WaveDivider } from '@/components/ui';
import { TEAM } from '@/data';
import { usePageMeta, useScrollReveal } from '@/hooks';

const VALUES = [
  { icon: Heart,  title: 'Authenticité', desc: "Nous préservons et valorisons la culture locale de Kribi, sans artifice." },
  { icon: Leaf,   title: 'Durabilité',   desc: "Tourisme responsable, respectueux de l'environnement et des communautés." },
  { icon: Award,  title: 'Excellence',   desc: "Une exigence sans compromis sur la qualité de chaque service." },
  { icon: Users,  title: 'Communauté',   desc: "Nous soutenons l'économie locale et les familles de pêcheurs." },
];

const TIMELINE = [
  { year: '2018', title: "L'idée germe",           desc: "Émile, originaire de Kribi, constate que sa région manque d'une offre touristique premium et authentique." },
  { year: '2019', title: 'Première expérience',    desc: 'Lancement de la première excursion aux Chutes de la Lobé avec 5 voyageurs pionniers.' },
  { year: '2020', title: 'Création de StayEatSee+',desc: "La marque voit le jour : « Stay » (loger), « Eat » (manger), « See » (voir). Le concept est né." },
  { year: '2022', title: 'Expansion',              desc: "Ouverture des hébergements et de 40+ expériences. Cap des 1000 voyageurs franchi." },
  { year: '2025', title: "Aujourd'hui",            desc: 'Plus de 1500 voyageurs satisfaits, 15 guides locaux et une référence du tourisme à Kribi.' },
];

export function AboutPage() {
  usePageMeta("À propos | StayEatSee+", "Découvrez l'histoire, la mission et l'équipe de StayEatSee+, agence touristique premium née à Kribi, Cameroun.");
  useScrollReveal();
  return (
    <div className="page-enter">
      <PageHero
        badge="Notre histoire"
        title="StayEatSee+"
        subtitle="Une agence née de l'amour pour Kribi, animée par la volonté de partager le Cameroun authentique."
        image="https://images.pexels.com/photos/2559942/pexels-photo-2559942.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Story */}
      <section className="py-22 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="reveal-left">
              <span className="section-badge mb-4">Notre histoire</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand mt-4 leading-tight">
                Né à Kribi, fait pour le monde
              </h2>
              <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
                <p>
                  StayEatSee+ est né d'un rêve simple : montrer que Kribi mérite sa place parmi les grandes destinations tropicales du monde.
                  Ses plages infinies, ses chutes qui se jettent dans l'océan, sa forêt équatoriale et sa culture vivante n'avaient qu'un manque :
                  une agence capable de les révéler avec exigence.
                </p>
                <p>
                  « Stay » pour des hébergements sélectionnés. « Eat » pour une gastronomie locale sublimée.
                  « See » pour des expériences qui ouvrent les yeux. Le « + » pour l'exigence qui nous distingue.
                </p>
                <p>
                  Sept ans plus tard, nous accompagnons des voyageurs du monde entier, avec la même conviction :
                  le luxe n'est pas dans le superflu, mais dans l'authenticité parfaitement orchestrée.
                </p>
              </div>
            </div>
            <div className="reveal-right grid grid-cols-2 gap-4">
              <div className="img-zoom rounded-3xl overflow-hidden h-72 shadow-xl2">
                <img src="https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="img-zoom rounded-3xl overflow-hidden h-72 shadow-xl2 mt-10">
                <img src="https://images.pexels.com/photos/2559942/pexels-photo-2559942.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="img-zoom rounded-3xl overflow-hidden h-72 shadow-xl2 -mt-6">
                <img src="https://images.pexels.com/photos/1148496/pexels-photo-1148496.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="img-zoom rounded-3xl overflow-hidden h-72 shadow-xl2">
                <img src="https://images.pexels.com/photos/1449729/pexels-photo-1449729.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-22 bg-brand relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-sky/25 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/15 blur-3xl"></div>
        <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal-left glass-dark rounded-3xl p-9">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky to-sky-light flex items-center justify-center mb-5">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">Notre mission</h3>
              <p className="text-white/80 leading-relaxed">
                Révéler Kribi au monde en proposant des expériences touristiques premium, authentiques et durables,
                qui valorisent les communautés locales et préservent l'environnement naturel du Cameroun.
              </p>
            </div>
            <div className="reveal-right glass-dark rounded-3xl p-9">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">Notre vision</h3>
              <p className="text-white/80 leading-relaxed">
                Faire de Kribi une destination de référence en Afrique centrale, reconnue internationalement
                pour la qualité de ses expériences et l'authenticité de sa culture, tout en restant fidèle à ses racines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-22 bg-sand-light">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle center badge="Nos valeurs" title="Ce qui nous guide" subtitle="Quatre principes au cœur de chaque décision." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="reveal-scale text-center bg-white rounded-3xl p-8 shadow-lg card-hover"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand to-sky flex items-center justify-center shadow-brand mb-5">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-22 bg-white">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <SectionTitle center badge="Notre parcours" title="Une histoire en mouvement" subtitle="Les étapes clés qui ont façonné StayEatSee+." />
          <div className="relative pt-8">
            <div className="timeline-line"></div>
            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className={`reveal flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1 text-right">
                    {i % 2 === 0 ? (
                      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                        <span className="text-3xl font-bold gradient-text">{item.year}</span>
                        <h3 className="font-serif text-lg font-bold text-brand mt-2">{item.title}</h3>
                        <p className="text-slate-600 text-sm mt-2">{item.desc}</p>
                      </div>
                    ) : <div />}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand to-sky ring-4 ring-white shadow-brand shrink-0 z-10"></div>
                  <div className="flex-1">
                    {i % 2 !== 0 ? (
                      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                        <span className="text-3xl font-bold gradient-text">{item.year}</span>
                        <h3 className="font-serif text-lg font-bold text-brand mt-2">{item.title}</h3>
                        <p className="text-slate-600 text-sm mt-2">{item.desc}</p>
                      </div>
                    ) : <div />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-22 bg-gradient-to-br from-sky-pale to-brand-pale">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle center badge="L'équipe" title="Des passionnés, pas des employés" subtitle="Quatre personnes qui font de StayEatSee+ une référence." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="reveal-scale group bg-white rounded-3xl overflow-hidden shadow-lg card-hover"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="img-zoom h-72 overflow-hidden">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif text-lg font-bold text-brand">{member.name}</h3>
                  <p className="text-sky font-semibold text-sm mt-1">{member.role}</p>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
