import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyDetails from '@/components/property/PropertyDetails';
import PropertyFeatures from '@/components/property/PropertyFeatures';
import PropertyLocation from '@/components/property/PropertyLocation';
import PropertyAgent from '@/components/property/PropertyAgent';
import RelatedProperties from '@/components/property/RelatedProperties';
import { generateSEOTitle, generateSEODescription } from '@/lib/utils';
import { Property } from '@/types';

interface PropertyPageProps {
  params: { locale: string; slug: string };
}

// Mock function to get property by slug - in a real app, this would fetch from API/database
async function getPropertyBySlug(slug: string): Promise<Property | null> {
  // Mock data - in a real app, this would fetch from your database
  const mockProperty: Property = {
    id: '1',
    title: 'Luxury Villa with Sea Views',
    slug: 'luxury-villa-sea-views-portals-nous',
    status: 'buy',
    type: 'villa',
    area: 'Portals Nous',
    price: 2800000,
    beds: 5,
    baths: 4,
    interiorSize: 450,
    plotSize: 800,
    yearBuilt: 2019,
    description: `This stunning contemporary villa offers the perfect blend of luxury and comfort, positioned in one of Mallorca's most prestigious locations. With panoramic sea views stretching to the horizon, this exceptional property represents the epitome of Mediterranean living.

The villa features a sophisticated open-plan design that seamlessly connects indoor and outdoor spaces. Floor-to-ceiling windows flood the interiors with natural light while framing the spectacular vistas beyond. The gourmet kitchen, equipped with premium appliances, serves as the heart of the home.

Five generously proportioned bedrooms, including a master suite with private terrace, provide comfortable accommodation. The property is completed by beautifully landscaped gardens, an infinity pool, and multiple terraces perfect for entertaining or quiet contemplation.`,
    features: [
      'Swimming Pool',
      'Sea Views',
      'Garage',
      'Garden',
      'Terrace',
      'Air Conditioning',
      'Underfloor Heating',
      'Wine Cellar',
      'Guest House',
      'Gym',
      'Home Cinema',
      'Smart Home System'
    ],
    images: [
      { id: '1', url: '/properties/villa-1.jpg', alt: 'Villa exterior with sea views', caption: 'Stunning exterior with infinity pool', order: 1 },
      { id: '2', url: '/properties/villa-1-2.jpg', alt: 'Villa living room', caption: 'Open-plan living area', order: 2 },
      { id: '3', url: '/properties/villa-1-3.jpg', alt: 'Villa kitchen', caption: 'Modern gourmet kitchen', order: 3 },
      { id: '4', url: '/properties/villa-1-4.jpg', alt: 'Villa master bedroom', caption: 'Master bedroom with sea views', order: 4 },
      { id: '5', url: '/properties/villa-1-5.jpg', alt: 'Villa pool area', caption: 'Infinity pool and outdoor dining', order: 5 },
    ],
    videoUrl: 'https://example.com/property-video.mp4',
    matterportUrl: 'https://example.com/matterport-tour',
    location: { 
      lat: 39.5267, 
      lng: 2.5584, 
      address: 'Calle Example, Portals Nous, 07181 Calvià, Mallorca' 
    },
    agent: {
      id: '1',
      name: 'Daniel Rodriguez',
      email: 'daniel@lioncapitala.com',
      phone: '+34 123 456 789',
      whatsapp: '+34 123 456 789',
      avatar: '/agents/daniel.jpg',
      languages: ['en', 'es', 'de']
    },
    referenceId: 'LCR-001',
    availability: 'available',
    seo: {
      title: 'Luxury Villa with Sea Views in Portals Nous - €2,800,000',
      description: 'Stunning 5-bedroom villa with panoramic sea views, infinity pool, and premium finishes in prestigious Portals Nous. Contact Lion Capital Real Estate for exclusive viewing.'
    }
  };

  // Simple slug matching - in a real app, you'd query your database
  if (slug === mockProperty.slug) {
    return mockProperty;
  }

  return null;
}

export async function generateMetadata({ params: { locale, slug } }: PropertyPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(slug);
  
  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  const seoTitle = generateSEOTitle(property.title, property.area, property.price, locale);
  const seoDescription = generateSEODescription(
    property.type, 
    property.area, 
    property.beds,
    property.baths,
    property.interiorSize
  );

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `/${locale}/properties/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: property.images.map(img => ({
        url: img.url,
        alt: img.alt,
      })),
      type: 'article',
    },
    other: {
      'property:type': property.type,
      'property:price': property.price.toString(),
      'property:bedrooms': property.beds?.toString() || '',
      'property:bathrooms': property.baths?.toString() || '',
      'property:area': property.area,
    },
  };
}

export default async function PropertyPage({ params: { locale, slug } }: PropertyPageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const property = await getPropertyBySlug(slug);
  
  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Gallery */}
      <PropertyGallery property={property} locale={locale} />

      {/* Property Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <PropertyDetails property={property} locale={locale} />
            <PropertyFeatures property={property} locale={locale} />
            <PropertyLocation property={property} locale={locale} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <PropertyAgent property={property} locale={locale} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      <RelatedProperties property={property} locale={locale} />
    </div>
  );
}
