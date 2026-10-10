import { MetadataRoute } from 'next';
import { initialProducts } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourpickpay.com';

  const productEntries = initialProducts
    .filter(p => p.status === 'published')
    .map(p => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...productEntries,
  ];
}
