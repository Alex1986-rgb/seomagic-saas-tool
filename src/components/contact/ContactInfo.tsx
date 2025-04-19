
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <Card className="neo-card">
        <CardContent className="p-6 flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Телефон</h3>
            <p className="text-muted-foreground text-sm mb-2">Пн-Пт с 9:00 до 18:00 (МСК)</p>
            <a href="tel:+78001234567" className="font-medium text-lg hover:text-primary transition-colors">
              +7 (800) 123-45-67
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="neo-card">
        <CardContent className="p-6 flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Email</h3>
            <p className="text-muted-foreground text-sm mb-2">Мы отвечаем в течение 24 часов</p>
            <a href="mailto:info@seomarket.ru" className="font-medium hover:text-primary transition-colors">
              info@seomarket.ru
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="neo-card">
        <CardContent className="p-6 flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Адрес</h3>
            <p className="text-muted-foreground text-sm mb-2">Центральный офис</p>
            <address className="not-italic">
              Москва, ул. Примерная, д. 123,<br />
              БЦ "Технополис", офис 456
            </address>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg overflow-hidden h-48 neo-card">
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Карта загружается...</p>
            <p className="text-sm text-primary mt-2">Интерактивная карта проезда</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
