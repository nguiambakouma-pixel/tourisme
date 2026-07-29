import { createClient } from '@supabase/supabase-js';

// ─── Chargement des variables depuis .env.local ───────────────────────────────
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error(
    'VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.\n' +
    'Vérifie ton fichier .env.local à la racine du projet.'
  );
}

const supabase = createClient(supabaseUrl, serviceKey);

// ─── Données inlinées (évite les imports Vite incompatibles avec Node) ────────
const EXPERIENCES = [
  { title: 'Balade en Quad', description: 'Traversez les pistes côtières et la forêt dense à bord de nos quads puissants. Aventure et sensations fortes garanties.', price: '25 000', duration: '3h', category: 'Aventure', badge: 'Populaire', badge_color: 'bg-orange-500', image: '/images/experiences/1.jpg' },
  { title: 'Excursion en Jet-Ski', description: "Fendez les vagues de l'Océan Atlantique à pleine vitesse. Une expérience inoubliable sur l'eau turquoise de Kribi.", price: '35 000', duration: '1h', category: 'Nautique', badge: 'Best-seller', badge_color: 'bg-ocean', image: '/images/experiences/2.jpg' },
  { title: 'Chutes de la Lobé', description: "Découvrez les seules chutes d'eau au monde qui se jettent directement dans l'océan. Un spectacle naturel unique.", price: '15 000', duration: 'Demi-journée', category: 'Nature', badge: 'Incontournable', badge_color: 'bg-forest', image: '/images/experiences/3.jpg' },
  { title: 'Dégustation Fruits de Mer', description: 'Savourez les meilleurs fruits de mer grillés au charbon, directement sur la plage. Une expérience gastronomique authentique.', price: '20 000', duration: '2h', category: 'Gastronomie', badge: 'Coup de cœur', badge_color: 'bg-gold', image: '/images/experiences/4.jpg' },
  { title: 'Visite du village des autochtones', description: 'Decouvrer et Visiter les peuples de la Foret.', price: '18 000', duration: '4h', category: 'Culture', badge: 'Authentique', badge_color: 'bg-teal-600', image: '/images/experiences/5.jpg' },
  { title: 'Balade en Pirogue', description: 'Glissez silencieusement sur la rivière Lobé en pirogue traditionnelle. Rencontrez la faune et la flore locales.', price: '12 000', duration: '2h', category: 'Nature', badge: 'Zen', badge_color: 'bg-cyan-600', image: '/images/experiences/6.jpg' },
  { title: 'Camping sur la Plage', description: 'Dormez sous les étoiles, bercé par le son des vagues. Feu de camp, musique et nature au rendez-vous.', price: '30 000', duration: '1 nuit', category: 'Aventure', badge: 'Exclusif', badge_color: 'bg-purple-600', image: '/images/experiences/7.jpg' },
  { title: 'Randonnée en Forêt', description: "Explorez la forêt équatoriale avec un guide expert. Découvrez les plantes médicinales et la biodiversité unique.", price: '14 000', duration: '4h', category: 'Nature', badge: 'Éco', badge_color: 'bg-green-700', image: '/images/experiences/8.jpg' },
  { title: 'Déguster les noix de coco', description: 'Savourer les produits de la cote de Kribi dans un cadre Premium', price: '22 000', duration: 'Soirée', category: 'Nature', badge: 'Rare', badge_color: 'bg-emerald-700', image: '/images/experiences/9.jpg' },
  { title: 'Villages de Pêcheurs', description: 'Immergez-vous dans la vie quotidienne des communautés de kribi. Une rencontre humaine authentique et émouvante.', price: '16 000', duration: 'Journée', category: 'Culture', badge: 'Humain', badge_color: 'bg-amber-600', image: '/images/experiences/10.jpg' },
  { title: 'Soirée Feu de Camp', description: "Musique, danse traditionnelle et récits autour d'un feu sur la plage. La magie de la culture Kribienne.", price: '10 000', duration: 'Soirée', category: 'Culture', badge: 'Convivial', badge_color: 'bg-red-600', image: '/images/experiences/11.jpg' },
  { title: 'Croisière Coucher de Soleil', description: 'Naviguez au large de Kribi pendant le coucher du soleil. Champagne, musique et panorama à couper le souffle.', price: '45 000', duration: '2h', category: 'Romantique', badge: 'Premium', badge_color: 'bg-gold', image: '/images/experiences/12.jpg' },
];

const ACCOMMODATIONS = [
  { title: 'Studio Vue Mer', type: 'Studio', price: '20 000', rating: 4.7, reviews: 124, features: ['wifi', 'clim', 'vue_mer'], image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', description: "Studio moderne et lumineux avec vue directe sur l'Océan Atlantique." },
  { title: 'Appartement Deluxe', type: 'Appartement', price: '35 000', rating: 4.9, reviews: 87, features: ['wifi', 'clim', 'vue_mer', 'parking'], image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800', description: 'Appartement spacieux 2 chambres avec terrasse et vue panoramique sur la mer.' },
  { title: 'Villa Tropicale', type: 'Villa', price: '75 000', rating: 5.0, reviews: 42, features: ['wifi', 'clim', 'vue_mer', 'parking', 'piscine'], image: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=800', description: 'Villa de luxe avec piscine privée, jardin tropical et accès direct à la plage.' },
  { title: 'Résidence Sécurisée', type: 'Résidence', price: '45 000', rating: 4.8, reviews: 63, features: ['wifi', 'clim', 'parking'], image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', description: 'Résidence moderne 24h/24 avec gardiennage, proche du centre-ville de Kribi.' },
];

const BLOG_POSTS = [
  { title: 'Les 10 Plus Belles Plages de Kribi', excerpt: "De la plage de Kribi-Centre aux criques secrètes près de Campo Ma'an, découvrez les joyaux côtiers cachés du Cameroun.", category: 'Destinations', date: '15 janvier 2025', read_time: '6 min', image: '/images/blog/1.jpg', author: 'Sarah Mbida' },
  { title: 'Top 10 Activités Incontournables à Kribi', excerpt: 'Des chutes de la Lobé au jet-ski en passant par la pêche artisanale, voici les expériences qui définissent Kribi.', category: 'Activités', date: '8 janvier 2025', read_time: '8 min', image: '/images/blog/2.jpg', author: 'Paul Atangana' },
  { title: 'Que Manger à Kribi ? Guide Gastronomique', excerpt: 'Barracuda grillé, ndolé, beignets de plantain... La cuisine de Kribi est une aventure à elle seule.', category: 'Gastronomie', date: '2 janvier 2025', read_time: '5 min', image: '/images/blog/3.jpg', author: 'Rose Ekanga' },
  { title: 'Comment Préparer Son Séjour à Kribi ?', excerpt: 'Visa, meilleure saison, budget, transports... Notre guide complet pour organiser votre voyage à Kribi.', category: 'Conseils', date: '28 décembre 2024', read_time: '10 min', image: '/images/blog/4.jpg', author: 'Marc Nkembi' },
  { title: 'Les Chutes de la Lobé : Merveille Naturelle', excerpt: "Ce phénomène géologique unique au monde est le joyau de Kribi. Tout ce qu'il faut savoir pour y aller.", category: 'Nature', date: '20 décembre 2024', read_time: '7 min', image: '/images/blog/5.jpg', author: 'Sarah Mbida' },
  { title: 'Culture Bagyeli : Rencontres Authentiques', excerpt: 'Les villages des peuples autochtones de Kribi gardent vivantes des traditions millénaires. Plongez dans la culture locale.', category: 'Culture', date: '12 décembre 2024', read_time: '6 min', image: '/images/blog/6.jpg', author: 'Paul Atangana' },
];

// ─── Migration ─────────────────────────────────────────────────────────────────
async function migrate() {
  console.log('\n🚀 Début de la migration...\n');

  console.log('📌 Migration des expériences...');
  const { error: expError } = await supabase.from('experiences').insert(EXPERIENCES);
  if (expError) throw new Error(`experiences: ${expError.message}`);
  console.log(`✅ ${EXPERIENCES.length} expériences insérées.`);

  console.log('📌 Migration des hébergements...');
  const { error: accError } = await supabase.from('accommodations').insert(ACCOMMODATIONS);
  if (accError) throw new Error(`accommodations: ${accError.message}`);
  console.log(`✅ ${ACCOMMODATIONS.length} hébergements insérés.`);

  console.log('📌 Migration des articles de blog...');
  const { error: blogError } = await supabase.from('blog_posts').insert(BLOG_POSTS);
  if (blogError) throw new Error(`blog_posts: ${blogError.message}`);
  console.log(`✅ ${BLOG_POSTS.length} articles insérés.`);

  console.log('\n🎉 Migration terminée avec succès !');
}

migrate().catch((err) => {
  console.error('\n❌ Erreur pendant la migration :', err.message ?? err);
  process.exit(1);
});