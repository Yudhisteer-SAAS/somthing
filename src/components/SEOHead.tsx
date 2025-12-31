import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object;
}

const SEOHead = ({
  title = 'Somthing | Art Posters That Speak to Your Walls',
  description = 'Discover unique wall art posters that transform your space. From abstract to botanical prints, find the perfect piece for every room. Premium quality, vibrant colors.',
  keywords = 'wall posters, art prints, home decor, abstract art, botanical prints, wall art, poster shop',
  ogImage = '/og-image.png',
  canonical,
  type = 'website',
  schema,
}: SEOHeadProps) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://somthing.com';
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : typeof window !== 'undefined' ? window.location.href : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Somthing" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Somthing" />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
