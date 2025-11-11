import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Clock, Award, Users, ArrowRight, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: AboutPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/about`,
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      images: ['/og-about.jpg'],
    },
  };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'about' });

  const values = [
    {
      icon: Shield,
      title: t('values.discretion'),
      description: 'Complete confidentiality and privacy in every transaction, respecting our clients\' need for discretion.'
    },
    {
      icon: Award,
      title: t('values.design'),
      description: 'Curating only the finest properties that meet our exacting standards for design and quality.'
    },
    {
      icon: Clock,
      title: t('values.speed'),
      description: '48-hour response guarantee with streamlined processes for swift, efficient service.'
    },
    {
      icon: Users,
      title: t('values.service'),
      description: 'Personalized, white-glove service tailored to each client\'s unique requirements and preferences.'
    }
  ];

  const team = [
    {
      name: 'Daniel Rodriguez',
      role: 'Founder & Managing Director',
      image: '/team/daniel.jpg',
      description: 'With over 15 years in luxury real estate, Daniel brings unparalleled market knowledge and a passion for exceptional service.',
      languages: ['English', 'Spanish', 'German'],
      certifications: ['Licensed Real Estate Agent', 'Luxury Property Specialist']
    },
    {
      name: 'Marina Hoffmann',
      role: 'Senior Sales Director',
      image: '/team/marina.jpg',
      description: 'Marina specializes in high-end residential properties and has facilitated over €200M in luxury sales.',
      languages: ['German', 'English', 'Spanish'],
      certifications: ['Certified International Property Specialist', 'Luxury Home Marketing Specialist']
    },
    {
      name: 'Carlos Mendez',
      role: 'Commercial Properties Director',
      image: '/team/carlos.jpg',
      description: 'Carlos leads our commercial division with expertise in investment properties and commercial real estate.',
      languages: ['Spanish', 'English', 'Catalan'],
      certifications: ['Commercial Real Estate License', 'Investment Property Advisor']
    }
  ];

  const achievements = [
    { number: '€2.5B+', label: 'Total Sales Volume' },
    { number: '500+', label: 'Properties Sold' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '15+', label: 'Years Experience' }
  ];

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
              {t('subtitle')} We specialize in luxury properties across Mallorca's most desirable locations, 
              offering unparalleled expertise and personalized service to discerning clients worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded with a vision to redefine luxury real estate in Mallorca, Lion Capital Real Estate 
                  has grown from a boutique agency to one of the island's most trusted names in premium property services.
                </p>
                <p>
                  Our journey began with a simple belief: that exceptional properties deserve exceptional service. 
                  This philosophy has guided us through every transaction, every client relationship, and every 
                  milestone in our company's evolution.
                </p>
                <p>
                  Today, we continue to set new standards in the industry, combining traditional values of trust 
                  and discretion with innovative marketing strategies and cutting-edge technology.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about/company-story.jpg"
                alt="Lion Capital Real Estate office"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide every aspect of our business and define our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals bring deep local knowledge and international expertise to every client interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Languages:</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.languages.map((lang) => (
                          <span key={lang} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Certifications:</h4>
                      <ul className="space-y-1">
                        {member.certifications.map((cert, certIndex) => (
                          <li key={certIndex} className="flex items-center text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Achievements</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-white/90 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Work with Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're buying, selling, or simply exploring the Mallorca luxury market, 
              our team is here to provide expert guidance and exceptional service.
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors smooth-elevation"
            >
              {t('cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
