import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

// Define all routes with their priorities and change frequencies
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/shop', changefreq: 'daily', priority: 0.9 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/cart', changefreq: 'always', priority: 0.5 },
  // Product pages
  { url: '/product/1', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/2', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/3', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/4', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/5', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/6', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/7', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/8', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/9', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/10', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/11', changefreq: 'weekly', priority: 0.8 },
  { url: '/product/12', changefreq: 'weekly', priority: 0.8 },
];

const hostname = 'https://somthing.com';

async function generateSitemap() {
  try {
    const stream = new SitemapStream({ hostname });
    
    const links = routes.map(route => ({
      url: route.url,
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: new Date().toISOString(),
    }));

    const xml = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then((data) => data.toString());

    const publicPath = path.resolve(process.cwd(), 'public');
    
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }

    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml);
    
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
