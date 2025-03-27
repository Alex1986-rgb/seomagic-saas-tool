
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from 'lucide-react';

const PaymentSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Валюта</Label>
          <Input id="currency" defaultValue="RUB" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stripe-key">Ключ Stripe</Label>
          <Input id="stripe-key" defaultValue="sk_test_*********************" type="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paypal-client">PayPal Client ID</Label>
          <Input id="paypal-client" defaultValue="client-id-*************" type="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tax-rate">Ставка налога (%)</Label>
          <Input id="tax-rate" defaultValue="20" type="number" min="0" max="100" />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="test-mode" defaultChecked />
        <Label htmlFor="test-mode">Тестовый режим платежей</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="invoice-notification" defaultChecked />
        <Label htmlFor="invoice-notification">Отправлять уведомления о счетах</Label>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          <span>Сохранить настройки платежей</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;
