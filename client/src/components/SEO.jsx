import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

export default function SEO({ title, description, image, path = '' }) {
  const { settings } = useSettings();
  if (!settings) return null;

  const t = title ? `${title} | ${settings.siteName}` : `${settings.siteName} — ${settings.tagline}`;
  const d = description || settings.description;
  const url = (typeof window !== 'undefined' ? window.location.origin : '') + path;
  const img = image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: settings.siteName,
    description: d,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Vrindavan',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    starRating: { '@type': 'Rating', ratingValue: '4.7' },
  };

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta name="keywords" content={settings.keywords || ''} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
    </Helmet>
  );
}
