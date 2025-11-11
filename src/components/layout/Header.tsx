'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-black/90 backdrop-blur-md py-2 shadow-lg border-b border-gray-800'
            : 'bg-transparent py-3'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between lg:justify-center relative">
            {/* Centered Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href={`/${locale}`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-white/90 hover:text-white"
                )}
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-white/90 hover:text-white"
                )}
              >
                {t('about')}
              </Link>

              {/* Logo in the center of nav */}
              <Link href={`/${locale}`} className="flex items-center gap-2 group mx-8">
                <Image
                  src="/images/logo3.png"
                  alt="Property Icon Logo"
                  width={320}
                  height={107}
                  className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </Link>

              <Link
                href={`/${locale}/portfolio`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-white/90 hover:text-white"
                )}
              >
                {t('portfolio')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-white/90 hover:text-white"
                )}
              >
                {t('contact')}
              </Link>
              <Link
                href={`/${locale}/faq`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-white/90 hover:text-white"
                )}
              >
                {t('faq')}
              </Link>
            </nav>

            {/* Logo for mobile */}
            <Link href={`/${locale}`} className="flex lg:hidden items-center gap-2 group">
              <Image
                src="/images/logo3.png"
                alt="Property Icon Logo"
                width={240}
                height={80}
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            {/* Get In Touch button - positioned absolutely on desktop */}
            <Link 
              href={`/${locale}/contact`}
              className="hidden lg:block absolute right-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/40"
            >
              Get In Touch
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors",
                isScrolled 
                  ? "hover:bg-gray-800 text-white"
                  : "hover:bg-white/10 text-white"
              )}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 max-w-full bg-gray-900 shadow-xl">
            <div className="p-6 pt-20">
              <nav className="space-y-6">
                <Link
                  href={`/${locale}`}
                  className="block text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="block text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('about')}
                </Link>
                <Link
                  href={`/${locale}/portfolio`}
                  className="block text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('portfolio')}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="block text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  className="block text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('faq')}
                </Link>
                <div className="pt-6">
                  <Link 
                    href={`/${locale}/contact`}
                    className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get In Touch
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}