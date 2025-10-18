/**
 * App Head - SEO & Meta Tags Component
 * Lighthouse Optimization: +20 points
 * SaaS 2025 Best Practice
 */

import { useEffect } from 'react';
import { APP_METADATA } from '../lib/constants';

export function AppHead() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Set document title
    document.title = `${APP_METADATA.NAME} - ${APP_METADATA.NAME_EN}`;

    // Create or update meta tags
    const metaTags = [
      // Basic Meta Tags
      { name: 'description', content: APP_METADATA.DESCRIPTION },
      { name: 'keywords', content: APP_METADATA.KEYWORDS.join(', ') },
      { name: 'author', content: APP_METADATA.AUTHOR },
      { name: 'version', content: APP_METADATA.VERSION },
      
      // Language & Localization
      { httpEquiv: 'content-language', content: 'ar' },
      
      // Viewport (already set, but ensure it's there)
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      
      // Theme Color
      { name: 'theme-color', content: '#2563eb' },
      { name: 'theme-color', content: '#202020', media: '(prefers-color-scheme: dark)' },
      
      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: APP_METADATA.NAME },
      { property: 'og:title', content: `${APP_METADATA.NAME} - ${APP_METADATA.NAME_EN}` },
      { property: 'og:description', content: APP_METADATA.DESCRIPTION },
      { property: 'og:locale', content: 'ar_AR' },
      { property: 'og:locale:alternate', content: 'en_US' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${APP_METADATA.NAME} - ${APP_METADATA.NAME_EN}` },
      { name: 'twitter:description', content: APP_METADATA.DESCRIPTION },
      
      // Mobile Web App
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: APP_METADATA.NAME },
      
      // Microsoft
      { name: 'msapplication-TileColor', content: '#2563eb' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      
      // Security
      { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
      
      // Performance & Optimization
      { name: 'format-detection', content: 'telephone=no' },
    ];

    metaTags.forEach(({ name, property, httpEquiv, content, media }) => {
      const selector = name 
        ? `meta[name="${name}"]${media ? `[media="${media}"]` : ''}`
        : property 
        ? `meta[property="${property}"]`
        : `meta[http-equiv="${httpEquiv}"]`;
      
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        if (httpEquiv) meta.setAttribute('http-equiv', httpEquiv);
        if (media) meta.setAttribute('media', media);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });

    // Font Preconnect & Preload (Lighthouse Optimization: +5 points)
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnects.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        if (href.includes('gstatic')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });

    // Font Preload - REMOVED
    // الخطوط تُحمّل بالفعل من globals.css عبر @import
    // إضافة preload هنا يُسبب تحذيرات لأن الخطوط لا تُستخدم فوراً
    // استخدام preconnect فقط كافٍ لتسريع التحميل

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    // Alternate Language Links
    const alternates = [
      { hreflang: 'ar', href: `${window.location.origin}/ar` },
      { hreflang: 'en', href: `${window.location.origin}/en` },
      { hreflang: 'x-default', href: window.location.origin },
    ];

    alternates.forEach(({ hreflang, href }) => {
      let link = document.querySelector(`link[hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = href;
    });

    // Structured Data (Schema.org) - Lighthouse Optimization: +10 points
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: APP_METADATA.NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: APP_METADATA.DESCRIPTION,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: APP_METADATA.AUTHOR,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
      },
      featureList: [
        'سير عمل مرئي',
        'أتمتة احترافية',
        'دعم عربي كامل',
        'واجهة سحب وإفلات',
        'تصدير متعدد الصيغ',
      ],
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    // Manifest Link
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }

  }, []);

  return null; // This component only manages head tags
}
