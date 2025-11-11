import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Award, Building2 } from 'lucide-react';

interface PortfolioPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PortfolioPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'portfolio' });

  return {
    title: 'Portfolio - Property Icon',
    description: 'View our portfolio of successful real estate transactions and investments.',
    alternates: {
      canonical: `/${locale}/portfolio`,
    },
    openGraph: {
      title: 'Portfolio - Property Icon',
      description: 'View our portfolio of successful real estate transactions and investments.',
      images: ['/og-portfolio.jpg'],
    },
  };
}

export default async function PortfolioPage({ params: { locale } }: PortfolioPageProps) {
  // Enable static rendering
  setRequestLocale(locale);

  const portfolioItems = [
    {
      id: 1,
      title: 'Luxury Villa in Son Vida',
      category: 'Residential',
      value: '€8.5M',
      image: '/portfolio/villa-son-vida.jpg',
      description: 'Exclusive 6-bedroom villa with panoramic views',
      year: '2024',
      status: 'Sold'
    },
    {
      id: 2,
      title: 'Penthouse in Port Andratx',
      category: 'Residential',
      value: '€4.2M',
      image: '/portfolio/penthouse-port.jpg',
      description: 'Modern penthouse with sea views and private terrace',
      year: '2024',
      status: 'Sold'
    },
    {
      id: 3,
      title: 'Commercial Building in Palma',
      category: 'Commercial',
      value: '€12M',
      image: '/portfolio/commercial-palma.jpg',
      description: 'Prime location office building in city center',
      year: '2023',
      status: 'Leased'
    },
    {
      id: 4,
      title: 'Boutique Hotel in Deià',
      category: 'Hospitality',
      value: '€15M',
      image: '/portfolio/hotel-deia.jpg',
      description: 'Luxury boutique hotel with 20 suites',
      year: '2023',
      status: 'Under Management'
    },
    {
      id: 5,
      title: 'Development Land in Calvià',
      category: 'Land',
      value: '€6M',
      image: '/portfolio/land-calvia.jpg',
      description: '50,000 sqm development opportunity',
      year: '2023',
      status: 'In Development'
    },
    {
      id: 6,
      title: 'Waterfront Apartment in Portixol',
      category: 'Residential',
      value: '€2.8M',
      image: '/portfolio/apartment-portixol.jpg',
      description: '3-bedroom luxury apartment with direct beach access',
      year: '2024',
      status: 'Sold'
    }
  ];

  const stats = [
    { icon: TrendingUp, value: '€250M+', label: 'Total Portfolio Value' },
    { icon: Building2, value: '150+', label: 'Properties Managed' },
    { icon: Award, value: '98%', label: 'Client Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              A showcase of our successful transactions and managed properties across Mallorca's most prestigious locations.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-gradient-to-br from-gray-800/50 to-blue-900/30 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white">
                      <p className="text-sm opacity-90">{item.year}</p>
                      <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <button className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Invest?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join our exclusive portfolio of premium real estate investments. Contact our team to explore current opportunities.
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/50"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

