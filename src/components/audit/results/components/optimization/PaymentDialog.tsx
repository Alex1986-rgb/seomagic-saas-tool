
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PaymentDialogProps {
  url: string;
  optimizationCost: number;
  onPayment: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  url, 
  optimizationCost, 
  onPayment,
  isDialogOpen,
  setIsDialogOpen
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Введите корректный номер карты (16 цифр)');
      return;
    }
    
    if (expiryDate.length !== 5) {
      setError('Введите корректную дату (ММ/ГГ)');
      return;
    }
    
    if (cvv.length !== 3) {
      setError('CVV должен содержать 3 цифры');
      return;
    }
    
    if (!cardName) {
      setError('Введите имя владельца карты');
      return;
    }
    
    // Simulate payment processing
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      onPayment();
      setIsDialogOpen(false);
      
      // Reset form
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardName('');
    }, 1500);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Оплата оптимизации</DialogTitle>
          <DialogDescription>
            Оплата услуги оптимизации сайта {url}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Сумма к оплате:</span>
              <span className="font-bold">{optimizationCost.toLocaleString('ru-RU')} ₽</span>
            </div>
          </Card>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Номер карты</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Срок действия</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  maxLength={3}
                  type="password"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Имя владельца</Label>
              <Input
                id="cardName"
                placeholder="IVAN IVANOV"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-red-600 text-sm gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Обработка...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Оплатить
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
