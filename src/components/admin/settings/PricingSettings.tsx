
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const PricingSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [prices, setPrices] = useState({
    basePagePrice: 500,
    metaDescriptionPrice: 50,
    metaKeywordsPrice: 30,
    altTagPrice: 20,
    underscoreUrlPrice: 10,
    duplicateContentPrice: 200,
    contentRewritePrice: 150
  });

  const handlePriceChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPrices(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSavePrices = () => {
    toast({
      title: "Настройки цен сохранены",
      description: "Новые цены будут применены к будущим аудитам"
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Настройки цен оптимизации</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Настройте стоимость различных типов оптимизации. Эти цены будут использоваться
          для расчета общей стоимости оптимизации сайта.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="base-page-price">Базовая цена за страницу (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="base-page-price" 
              type="number" 
              min="0"
              value={prices.basePagePrice}
              onChange={(e) => handlePriceChange('basePagePrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Базовая стоимость за обработку одной страницы
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-description-price">Мета-описание (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="meta-description-price" 
              type="number"
              min="0" 
              value={prices.metaDescriptionPrice}
              onChange={(e) => handlePriceChange('metaDescriptionPrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Стоимость оптимизации одного мета-тега description
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-keywords-price">Ключевые слова (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="meta-keywords-price" 
              type="number"
              min="0" 
              value={prices.metaKeywordsPrice}
              onChange={(e) => handlePriceChange('metaKeywordsPrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Стоимость оптимизации одного мета-тега keywords
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="alt-tag-price">Alt-теги изображений (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="alt-tag-price" 
              type="number"
              min="0" 
              value={prices.altTagPrice}
              onChange={(e) => handlePriceChange('altTagPrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Стоимость добавления одного alt-тега для изображения
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="underscore-url-price">Оптимизация URL (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="underscore-url-price" 
              type="number"
              min="0" 
              value={prices.underscoreUrlPrice}
              onChange={(e) => handlePriceChange('underscoreUrlPrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Стоимость оптимизации одного URL (замена подчеркиваний на дефисы)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duplicate-content-price">Исправление дублей (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="duplicate-content-price" 
              type="number"
              min="0" 
              value={prices.duplicateContentPrice}
              onChange={(e) => handlePriceChange('duplicateContentPrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Стоимость исправления одной страницы с дублирующимся контентом
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content-rewrite-price">Переписывание контента (₽)</Label>
          <div className="flex">
            <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="content-rewrite-price" 
              type="number"
              min="0" 
              value={prices.contentRewritePrice}
              onChange={(e) => handlePriceChange('contentRewritePrice', e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Стоимость переписывания контента одной страницы для SEO
          </p>
        </div>
      </div>
      
      <div className="space-y-2 pt-4 border-t">
        <h4 className="font-medium">Скидки за объем</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Более 200 страниц</p>
            <p className="text-sm text-muted-foreground">Скидка 5%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Более 500 страниц</p>
            <p className="text-sm text-muted-foreground">Скидка 10%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Более 1000 страниц</p>
            <p className="text-sm text-muted-foreground">Скидка 15%</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePrices}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Сохранить настройки цен</span>
        </Button>
      </div>
    </div>
  );
};

export default PricingSettings;
