import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import SellHero from '@/components/sell/SellHero';
import SellProcess from '@/components/sell/SellProcess';
import ValuationForm from '@/components/sell/ValuationForm';
import WhyChooseUs from '@/components/sell/WhyChooseUs';
import TestimonialsSection from '@/components/sell/TestimonialsSection';

interface SellPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: SellPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'sell' });

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/sell`,
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      images: ['/og-sell.jpg'],
    },
  };
}

export default async function SellPage({ params: { locale } }: SellPageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <SellHero locale={locale} />

      {/* Process Steps */}
      <SellProcess locale={locale} />

      {/* Valuation Form */}
      <ValuationForm locale={locale} />

      {/* Why Choose Us */}
      <WhyChooseUs locale={locale} />

      {/* Testimonials */}
      <TestimonialsSection locale={locale} />
    </div>
  );
}
