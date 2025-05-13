
import React from 'react';
import { Link } from 'react-router-dom';
import { RESOURCE_ITEMS, COMPANY_ITEMS, FEATURES_ITEMS, SUPPORT_ITEMS } from './navbar/navConstants';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  console.log("Footer rendering");
  
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="md:col-span-1 lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold inline-flex items-center"
            >
              <span className="text-primary">Seo</span>Market
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Комплексное решение для профессионального SEO аудита и оптимизации. 
              Повышайте позиции в поисковой выдаче и увеличивайте целевой трафик на ваш сайт.
            </p>
            
            <div className="mt-6 flex flex-col space-y-2">
              <ContactItem icon={<Mail className="h-4 w-4" />} text="info@seomarket.ru" />
              <ContactItem icon={<Phone className="h-4 w-4" />} text="+7 (999) 123-45-67" />
              <ContactItem icon={<MapPin className="h-4 w-4" />} text="Москва, ул. Примерная, 123" />
            </div>

            <div className="mt-6 flex space-x-4">
              <SocialIcon href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialIcon href="https://twitter.com" icon={<Twitter size={18} />} />
              <SocialIcon href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialIcon href="https://linkedin.com" icon={<Linkedin size={18} />} />
              <SocialIcon href="https://github.com" icon={<Github size={18} />} />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-3">
              {COMPANY_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Услуги</h3>
            <ul className="space-y-3">
              {FEATURES_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Ресурсы</h3>
            <ul className="space-y-3">
              {RESOURCE_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Поддержка</h3>
            <ul className="space-y-3">
              {SUPPORT_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">
              &copy; {new Date().getFullYear()} SeoMarket. Все права защищены.
            </p>
            <p className="text-xs text-muted-foreground">
              Разработчик и веб-дизайнер: Kyrlan Alexandr
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterLegalLink to="/terms">Условия использования</FooterLegalLink>
            <FooterLegalLink to="/privacy">Политика конфиденциальности</FooterLegalLink>
            <FooterLegalLink to="/ip-info">IP-адрес</FooterLegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <li>
    <Link
      to={to}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  </li>
);

const FooterLegalLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Link
    to={to}
    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
  >
    {children}
  </Link>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    {icon}
    <span className="text-sm">{text}</span>
  </div>
);

const SocialIcon: React.FC<{
  href: string;
  icon: React.ReactNode;
}> = ({ href, icon }) => (
  <a
    href={href}
    className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-background rounded-full"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Social media"
  >
    {icon}
  </a>
);

export default Footer;
