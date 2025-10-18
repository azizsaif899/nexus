'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: t.footer.company.title,
      links: [
        { label: t.footer.company.about, href: '#' },
        { label: t.footer.company.careers, href: '#' },
        { label: t.footer.company.press, href: '#' },
        { label: t.footer.company.contact, href: '#' },
      ],
    },
    {
      title: t.footer.product.title,
      links: [
        { label: t.footer.product.features, href: '#features' },
        { label: t.footer.product.pricing, href: '#pricing' },
        { label: t.footer.product.security, href: '#' },
        { label: t.footer.product.updates, href: '#' },
      ],
    },
    {
      title: t.footer.resources.title,
      links: [
        { label: t.footer.resources.documentation, href: '#' },
        { label: t.footer.resources.guides, href: '#' },
        { label: t.footer.resources.blog, href: '#' },
        { label: t.footer.resources.community, href: '#' },
      ],
    },
    {
      title: t.footer.legal.title,
      links: [
        { label: t.footer.legal.privacy, href: '#' },
        { label: t.footer.legal.terms, href: '#' },
        { label: t.footer.legal.cookies, href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer id="contact" className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand & Newsletter */}
          <motion.div 
            className="lg:col-span-2 space-y-6 text-center md:text-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              <span className="font-bold text-lg">Nexus AI</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t.footer.newsletter.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.footer.newsletter.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  type="email" 
                  placeholder={t.footer.newsletter.placeholder}
                  className="flex-1 h-10"
                />
                <Button className="h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 whitespace-nowrap">
                  {t.footer.newsletter.subscribe}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <motion.div 
              key={index} 
              className="space-y-4 text-center md:text-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                      whileHover={{ 
                        x: document.documentElement.dir === 'rtl' ? -4 : 4 
                      }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-muted-foreground">{t.footer.social}</span>
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
