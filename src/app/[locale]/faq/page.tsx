import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { ChevronDown } from 'lucide-react';

interface FAQPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: FAQPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: 'FAQ - Property Icon',
    description: 'Frequently asked questions about our real estate services in Mallorca.',
    alternates: {
      canonical: `/${locale}/faq`,
    },
    openGraph: {
      title: 'FAQ - Property Icon',
      description: 'Frequently asked questions about our real estate services in Mallorca.',
      images: ['/og-faq.jpg'],
    },
  };
}

export default async function FAQPage({ params: { locale } }: FAQPageProps) {
  // Enable static rendering
  setRequestLocale(locale);

  const faqs = [
    {
      category: 'Buying Process',
      questions: [
        {
          question: 'What documents do I need to buy property in Mallorca?',
          answer: 'To purchase property in Mallorca, you will need a valid passport or ID, NIE number (Spanish tax identification number), proof of funds, and bank references. We assist our clients in obtaining all necessary documentation throughout the process.'
        },
        {
          question: 'Can foreigners buy property in Spain?',
          answer: 'Yes, foreigners can freely buy property in Spain. EU citizens have the same rights as Spanish nationals, while non-EU citizens may need to meet certain requirements. We guide international clients through all legal requirements.'
        },
        {
          question: 'What are the typical closing costs?',
          answer: 'Closing costs in Mallorca typically range from 10-12% of the purchase price, including transfer tax (8-10%), notary fees, registry fees, and legal fees. We provide detailed cost breakdowns for each property.'
        }
      ]
    },
    {
      category: 'Selling Process',
      questions: [
        {
          question: 'How long does it take to sell a property?',
          answer: 'The average selling time varies depending on property type, location, and pricing. Luxury properties in prime locations typically sell within 3-6 months with proper marketing and pricing strategy.'
        },
        {
          question: 'What is your commission structure?',
          answer: 'Our commission structure is competitive and varies based on property value and services required. We offer transparent pricing with no hidden fees. Contact us for a personalized quote.'
        },
        {
          question: 'Do you provide property valuation services?',
          answer: 'Yes, we offer comprehensive property valuations conducted by certified appraisers. Our valuations consider market trends, property condition, location, and comparable sales.'
        }
      ]
    },
    {
      category: 'Investment',
      questions: [
        {
          question: 'What are the best areas for investment in Mallorca?',
          answer: 'Prime investment areas include Palma Old Town, Son Vida, Port Andratx, and Deià. Each area offers unique advantages depending on your investment goals - rental yield, capital appreciation, or personal use.'
        },
        {
          question: 'What is the rental yield in Mallorca?',
          answer: 'Rental yields vary by location and property type. Premium properties in tourist areas can achieve 4-6% annual yields with vacation rentals potentially yielding higher returns during peak season.'
        },
        {
          question: 'Do you manage rental properties?',
          answer: 'Yes, we offer comprehensive property management services including tenant screening, maintenance, rent collection, and legal compliance. Our team ensures your investment is well-maintained and profitable.'
        }
      ]
    },
    {
      category: 'Legal & Tax',
      questions: [
        {
          question: 'What taxes apply to property ownership?',
          answer: 'Property owners in Mallorca pay annual IBI (property tax), and non-residents pay income tax on deemed rental income. We work with tax advisors to optimize your tax position legally.'
        },
        {
          question: 'Do I need a Spanish bank account?',
          answer: 'While not mandatory for purchase, a Spanish bank account is highly recommended for paying utilities, taxes, and maintenance fees. We can introduce you to banking partners.'
        },
        {
          question: 'What is the Golden Visa program?',
          answer: 'The Golden Visa grants residency to non-EU citizens who invest €500,000 or more in Spanish real estate. It provides visa-free travel within the Schengen area and can lead to permanent residency.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Find answers to common questions about buying, selling, and investing in Mallorca real estate.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gradient-to-br from-gray-800/50 to-blue-900/30 rounded-2xl p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <details 
                      key={faqIndex}
                      className="group bg-gray-900/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                    >
                      <summary className="flex items-center justify-between cursor-pointer p-6">
                        <h3 className="text-lg font-medium text-white pr-4">
                          {faq.question}
                        </h3>
                        <ChevronDown className="w-5 h-5 text-blue-400 transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Our expert team is here to provide personalized answers to your specific real estate questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/50"
              >
                Contact Us
              </a>
              <a
                href="tel:+34971123456"
                className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Call Now: +34 971 123 456
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

