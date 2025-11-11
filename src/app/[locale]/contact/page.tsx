import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import OfficeLocation from '@/components/contact/OfficeLocation';

interface ContactPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params: { locale } }: ContactPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: 'Contact Lion Capital Real Estate for luxury properties in Mallorca. Expert consultation and personalized service.',
    alternates: {
      canonical: `/${locale}/contact`,
    },
    openGraph: {
      title: t('title'),
      description: 'Contact Lion Capital Real Estate for luxury properties in Mallorca. Expert consultation and personalized service.',
      images: ['/og-contact.jpg'],
    },
  };
}

export default async function ContactPage({ params: { locale }, searchParams }: ContactPageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Ready to find your dream property in Mallorca? Our expert team is here to help you 
              every step of the way. Get in touch today for personalized service and exclusive access 
              to the finest properties on the island.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm locale={locale} searchParams={searchParams} />
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <ContactInfo locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* Office Location */}
      <OfficeLocation locale={locale} />
    </div>
  );
}
