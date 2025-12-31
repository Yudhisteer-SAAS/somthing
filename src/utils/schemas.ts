// JSON-LD Schema Generator for SEO

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Somthing',
  description: 'Premium wall art posters and prints for modern homes',
  url: 'https://somthing.com',
  logo: 'https://somthing-ten.vercel.app/logo.png',
  sameAs: [
    'https://www.facebook.com/somthing',
    'https://www.instagram.com/somthing',
    'https://twitter.com/somthing',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@somthing.com',
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Somthing',
  description: 'Art Posters That Speak to Your Walls',
  url: 'https://somthing.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://somthing-ten.vercel.app/shop?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const productSchema = (product: {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: `https://somthing.com${product.image}`,
  description: product.description,
  sku: `POSTER-${product.id}`,
  mpn: `${product.id}`,
  brand: {
    '@type': 'Brand',
    name: 'Somthing',
  },
  offers: {
    '@type': 'Offer',
    url: `https://somthing-ten.vercel.app/product/${product.id}`,
    priceCurrency: 'USD',
    price: product.price.toFixed(2),
    availability: `https://schema.org/${product.availability || 'InStock'}`,
    seller: {
      '@type': 'Organization',
      name: 'Somthing',
    },
  },
  category: product.category,
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Somthing',
  image: 'https://somthing-ten.vercel.app/logo.png',
  '@id': 'https://somthing.com',
  url: 'https://somthing.com',
  telephone: '+1-555-0123',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Art Street',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10001',
    addressCountry: 'US',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
};
