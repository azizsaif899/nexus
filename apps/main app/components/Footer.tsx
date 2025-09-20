import { Separator } from "./ui/separator";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function Footer() {
  const { t, language } = useTheme();
  
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">AI</span>
              </div>
              <span className="text-xl font-bold">AIIO</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('footer_description')}
            </p>
            <div className={`flex ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('features')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('pricing')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Integrations</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">API</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Security</a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('documentation')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Tutorials</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Blog</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Case Studies</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Community</a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('support')}</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('help_center')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('contact_us')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Status Page</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('privacy_policy')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">{t('terms_of_service')}</a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className={`flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
          <p className="text-muted-foreground text-sm">
            © 2025 AIIO. {t('all_rights_reserved')}.
          </p>
          <div className={`flex ${language === 'ar' ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}