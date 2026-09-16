
import React from 'react';
import { Link } from 'react-router-dom';
import { RESOURCE_ITEMS, COMPANY_ITEMS, FEATURES_ITEMS, SUPPORT_ITEMS } from './navbar/navConstants';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Github, Send, Youtube, Globe, FileText, Settings } from 'lucide-react';
import { SITE_CONTACTS } from '@/config/site-contacts';

/** Подбирает иконку по адресу страницы в соцсети. */
const socialIconFor = (url: string) => {
  const host = url.toLowerCase();
  if (host.includes('facebook.')) return <Facebook size={16} />;
  if (host.includes('twitter.') || host.includes('x.com')) return <Twitter size={16} />;
  if (host.includes('instagram.')) return <Instagram size={16} />;
  if (host.includes('linkedin.')) return <Linkedin size={16} />;
  if (host.includes('github.')) return <Github size={16} />;
  if (host.includes('t.me') || host.includes('telegram.')) return <Send size={16} />;
  if (host.includes('youtube.') || host.includes('youtu.be')) return <Youtube size={16} />;
  return <Globe size={16} />;
};

const Footer: React.FC = () => {
  console.log("Footer rendering");
  
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold inline-flex items-center"
            >
              <span className="text-primary">Seo</span>Market
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Комплексное решение для профессионального SEO аудита и оптимизации.
            </p>
            
            {/*
              Тут в подвале каждой страницы висели выдуманные контакты:
              почта info@seomarket.ru и телефон +7 (999) 123-45-67. По номеру
              звонили живые люди. Теперь строки берутся из SITE_CONTACTS и
              показываются только тогда, когда контакт реально есть.
            */}
            {(SITE_CONTACTS.email || SITE_CONTACTS.telephone) && (
              <div className="mt-4 flex flex-col space-y-1">
                {SITE_CONTACTS.email && (
                  <a
                    href={`mailto:${SITE_CONTACTS.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{SITE_CONTACTS.email}</span>
                  </a>
                )}
                {SITE_CONTACTS.telephone && (
                  <a
                    href={`tel:${SITE_CONTACTS.telephone.replace(/[^+\d]/g, '')}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{SITE_CONTACTS.telephone}</span>
                  </a>
                )}
              </div>
            )}

            {/*
              Иконки соцсетей вели на голые facebook.com, twitter.com и прочие
              главные страницы — у сервиса этих аккаунтов нет. Выводим только
              те ссылки, которые указаны в SITE_CONTACTS.social.
            */}
            {SITE_CONTACTS.social.length > 0 && (
              <div className="mt-4 flex space-x-3">
                {SITE_CONTACTS.social.map((url) => (
                  <SocialIcon key={url} href={url} icon={socialIconFor(url)} />
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-3">Компания</h3>
            <ul className="space-y-2">
              {COMPANY_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-3">Услуги</h3>
            <ul className="space-y-2">
              {FEATURES_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-3">Ресурсы</h3>
            <ul className="space-y-2">
              {RESOURCE_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
              <FooterLink to="/pages" className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Все страницы</span>
              </FooterLink>
              <FooterLink to="/project-details" className="flex items-center gap-1">
                <Settings className="h-3.5 w-3.5" />
                <span>Детали проекта</span>
              </FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-3">Поддержка</h3>
            <ul className="space-y-2">
              {SUPPORT_ITEMS.map((item) => (
                <FooterLink key={item.href} to={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} SeoMarket. Все права защищены.
          </p>
          
          {/* Custom attribution with stylized font */}
          <div className="mt-3 md:mt-0 font-serif italic text-primary/70">
            <p>
              При поддержке сайта <a href="https://www.myarredo.ru" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed">www.myarredo.ru</a>
            </p>
            <p className="text-center font-medium mt-1">
              Клюшников Олег Владимирович
            </p>
          </div>

          <div className="flex space-x-4 mt-3 md:mt-0">
            <FooterLegalLink to="/terms">Условия</FooterLegalLink>
            <FooterLegalLink to="/privacy">Конфиденциальность</FooterLegalLink>
            <FooterLegalLink to="/ip-info">IP-адрес</FooterLegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children, className = "" }) => (
  <li>
    <Link
      to={to}
      className={`text-muted-foreground hover:text-foreground transition-colors text-xs ${className}`}
    >
      {children}
    </Link>
  </li>
);

const FooterLegalLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
  >
    {children}
  </Link>
);

const SocialIcon = ({
  href,
  icon
}) => (
  <a
    href={href}
    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 hover:bg-background rounded-full"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Social media"
  >
    {icon}
  </a>
);

export default Footer;
