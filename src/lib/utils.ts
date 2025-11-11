import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, locale: string = 'en'): string {
  const formatters = {
    en: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    de: new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    es: new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  };
  
  return formatters[locale as keyof typeof formatters].format(price);
}

export function formatNumber(number: number, locale: string = 'en'): string {
  const formatters = {
    en: new Intl.NumberFormat('en-US'),
    de: new Intl.NumberFormat('de-DE'),
    es: new Intl.NumberFormat('es-ES'),
  };
  
  return formatters[locale as keyof typeof formatters].format(number);
}

export function createPropertySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createSearchParams(filters: Record<string, any>): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value.toString());
      }
    }
  });
  
  return params.toString();
}

export function parseSearchParams(searchParams: URLSearchParams): Record<string, any> {
  const filters: Record<string, any> = {};

  searchParams.forEach((value, key) => {
    if (filters[key]) {
      if (Array.isArray(filters[key])) {
        filters[key].push(value);
      } else {
        filters[key] = [filters[key], value];
      }
    } else {
      filters[key] = value;
    }
  });

  return filters;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function generateSEOTitle(
  propertyTitle: string,
  area: string,
  price: number,
  locale: string = 'en'
): string {
  const formattedPrice = formatPrice(price, locale);
  return `${propertyTitle} in ${area} – ${formattedPrice} | Lion Capital Real Estate`;
}

export function generateSEODescription(
  type: string,
  area: string,
  beds?: number,
  baths?: number,
  size?: number
): string {
  let description = `Luxury ${type.toLowerCase()} in ${area}`;
  
  if (beds || baths || size) {
    description += ' featuring';
    if (beds) description += ` ${beds} bedrooms`;
    if (baths) description += beds ? ` and ${baths} bathrooms` : ` ${baths} bathrooms`;
    if (size) description += ` spanning ${size}m²`;
  }
  
  description += '. Contact Lion Capital Real Estate for exclusive viewing.';
  return description;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

export function generateWhatsAppURL(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export function generateEmailURL(email: string, subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}
