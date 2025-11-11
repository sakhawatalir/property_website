import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AboutSnippet from '@/components/home/AboutSnippet';
import CallToAction from '@/components/home/CallToAction';
import AreaHighlights from '@/components/home/AreaHighlights';
import Newsletter from '@/components/home/Newsletter';

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'de': '/de',
        'es': '/es',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      images: ['/og-home.jpg'],
    },
  };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Blue Gradient Background */}
      <HeroSection locale={locale} />

      {/* Featured Properties */}
      <FeaturedProperties locale={locale} />

      {/* About Company Snapshot */}
      <AboutSnippet locale={locale} />

      {/* Call to Action - Hiring or Sell/Rent */}
      <CallToAction locale={locale} variant="sell" />

      {/* Area Highlights */}
      <AreaHighlights locale={locale} />

      {/* Newsletter Signup */}
      <Newsletter locale={locale} />
    </div>
  );
}
