'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Play, Pause } from 'lucide-react';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const router = useRouter();
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInSection, setIsMouseInSection] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setMousePosition({ x: e.clientX, y: e.clientY });
          setIsMouseInSection(true);
        } else {
          setIsMouseInSection(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsMouseInSection(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-end justify-center overflow-hidden pb-20 md:pb-24"
    >
      {/* Background - Gradient fallback with optional video */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-blue-950 to-blue-900">
        {/* Video Background (optional - only shows if video loads) */}
        {/* Using compressed video for production (5.49MB), original for localhost (195MB) */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source 
            src={
              process.env.NODE_ENV === 'production' 
                ? "/videos/video-hero-banner_tpzrhea8.mp4"  // Compressed for Vercel (5.49MB)
                : "/videos/video_hero_banner.mp4"            // Original for localhost (195MB)
            }
            type="video/mp4" 
          />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-950/50 to-blue-900/40" />
        
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-blue-900/30 to-black/30 animate-gradient-x" />
      </div>

      {/* Video Controls */}
      <button
        onClick={toggleVideo}
        className="absolute bottom-8 right-8 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
        aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
      >
        {isVideoPlaying ? (
          <Pause className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Custom cursor dot */}
      {isMouseInSection && (
        <div 
          className="custom-cursor-dot"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Year Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
          <span className="text-sm font-semibold">2025</span>
          <span className="text-sm opacity-80">{t('badge')}</span>
        </div>

        {/* Hero Text */}
        <div className="mb-12 fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight whitespace-pre-line">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90 text-gray-200">
            {t('subtitle')}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center gap-4 mb-16">
          <button 
            onClick={() => router.push(`/${locale}/contact`)}
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
          >
            <span className="flex items-center gap-2">
              {t('cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Property Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/20 to-black/20 backdrop-blur-lg rounded-3xl p-2 border border-white/10 shadow-2xl">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950 to-black">
              <img 
                src="/api/placeholder/800/450"
                alt="Luxury Property"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
}