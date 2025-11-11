import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import PropertiesHeader from '@/components/properties/PropertiesHeader';
import PropertiesFilters from '@/components/properties/PropertiesFilters';
import PropertiesGrid from '@/components/properties/PropertiesGrid';
import PropertiesLoading from '@/components/properties/PropertiesLoading';

interface PropertiesPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params: { locale } }: PropertiesPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'properties' });

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/properties`,
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      images: ['/og-properties.jpg'],
    },
  };
}

export default function PropertiesPage({ params: { locale }, searchParams }: PropertiesPageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PropertiesHeader locale={locale} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
                <PropertiesFilters locale={locale} searchParams={searchParams} />
              </Suspense>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<PropertiesLoading />}>
              <PropertiesGrid locale={locale} searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
