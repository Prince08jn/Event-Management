import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/_next/', '/private/'],
      },
    ],
    sitemap: 'https://eventorax.in/sitemap.xml',
    host: 'https://eventorax.in',
  }
}