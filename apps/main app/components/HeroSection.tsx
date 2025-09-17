import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTheme } from "./ThemeContext";

export function HeroSection() {
  const { t, language } = useTheme();
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1564157212225-38fcc211e977?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc1NjcxNTYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="AI Robot Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {t('work_less')}<br />
                <span className="text-primary">{t('automate_more')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                {t('hero_description')}
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t('start_free_trial')}
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t('watch_demo')}
              </Button>
            </div>

            <div className={`flex items-center pt-8 ${language === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1743796055664-3473eedab36e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU2NjUxOTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI Technology Workspace"
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}