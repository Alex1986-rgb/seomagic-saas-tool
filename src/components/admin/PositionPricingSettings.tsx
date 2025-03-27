
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Save, RefreshCw, DollarSign, Percent } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const PositionPricingSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [basePrices, setBasePrices] = useState({
    keywordPrice: 0.30,
    regionMultiplier: 1.2,
    dailyFrequencyMultiplier: 1.5,
    triWeeklyFrequencyMultiplier: 1.2,
    weeklyFrequencyMultiplier: 1.0,
    apiAccessFee: 1500,
    reportExportFee: 500
  });
  
  const [discounts, setDiscounts] = useState({
    keywords100: 0,
    keywords500: 5,
    keywords1000: 10,
    keywords5000: 15,
    keywords10000: 20,
    quarterlySubscription: 5,
    annualSubscription: 15
  });
  
  const [plans, setPlans] = useState({
    basic: {
      keywordsLimit: 100,
      regionsLimit: 1,
      frequencyPerWeek: 1,
      historyDays: 30,
      enableNotifications: false,
      enableExport: false,
      enableAPI: false,
      price: 500
    },
    standard: {
      keywordsLimit: 500,
      regionsLimit: 3,
      frequencyPerWeek: 3,
      historyDays: 60,
      enableNotifications: true,
      enableExport: true,
      enableAPI: false,
      price: 1900
    },
    professional: {
      keywordsLimit: 2000,
      regionsLimit: 10,
      frequencyPerWeek: 7,
      historyDays: 90,
      enableNotifications: true,
      enableExport: true,
      enableAPI: true,
      price: 4900
    }
  });
  
  const [additionalSettings, setAdditionalSettings] = useState({
    enableFreeTrial: true,
    freeTrialDays: 7,
    freeKeywordsLimit: 10,
    competitorAnalysisFee: 1000,
    whitelabelFee: 3000,
    enableBulkDiscounts: true
  });
  
  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Изменения в ценах позиционного мониторинга успешно сохранены"
    });
  };
  
  const handleResetToDefaults = () => {
    // Reset to default values
    toast({
      title: "Настройки сброшены",
      description: "Цены возвращены к значениям по умолчанию"
    });
  };
  
  const handleBasePriceChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBasePrices(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const handleDiscountChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setDiscounts(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const handlePlanChange = (plan: string, field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPlans(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan as keyof typeof prev],
        [field]: numValue
      }
    }));
  };
  
  const handlePlanToggle = (plan: string, field: string, value: boolean) => {
    setPlans(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const handleAdditionalSettingChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setAdditionalSettings(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const handleAdditionalSettingToggle = (field: string, value: boolean) => {
    setAdditionalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Настройки цен позиционного мониторинга</h2>
      
      <Tabs defaultValue="base-prices">
        <TabsList className="mb-6">
          <TabsTrigger value="base-prices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Базовые цены</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Тарифные планы</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span>Скидки</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Дополнительно</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="base-prices">
          <Card>
            <CardHeader>
              <CardTitle>Базовые цены</CardTitle>
              <CardDescription>
                Настройте базовые ставки для расчета стоимости мониторинга позиций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="keyword-price">Цена за ключевое слово (₽)</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="keyword-price" 
                      type="number" 
                      min="0.1"
                      step="0.1"
                      value={basePrices.keywordPrice}
                      onChange={(e) => handleBasePriceChange('keywordPrice', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Базовая стоимость за одно ключевое слово в месяц
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region-multiplier">Множитель региона</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <span className="text-muted-foreground">×</span>
                    </div>
                    <Input 
                      id="region-multiplier" 
                      type="number"
                      min="1"
                      step="0.1"
                      value={basePrices.regionMultiplier}
                      onChange={(e) => handleBasePriceChange('regionMultiplier', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Множитель для каждого дополнительного региона
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="daily-multiplier">Множитель ежедневных проверок</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <span className="text-muted-foreground">×</span>
                    </div>
                    <Input 
                      id="daily-multiplier" 
                      type="number"
                      min="1"
                      step="0.1"
                      value={basePrices.dailyFrequencyMultiplier}
                      onChange={(e) => handleBasePriceChange('dailyFrequencyMultiplier', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Множитель для ежедневных проверок (7 раз в неделю)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="triweekly-multiplier">Множитель 3 раза в неделю</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <span className="text-muted-foreground">×</span>
                    </div>
                    <Input 
                      id="triweekly-multiplier" 
                      type="number"
                      min="1"
                      step="0.1"
                      value={basePrices.triWeeklyFrequencyMultiplier}
                      onChange={(e) => handleBasePriceChange('triWeeklyFrequencyMultiplier', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Множитель для проверок 3 раза в неделю
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weekly-multiplier">Множитель еженедельных проверок</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <span className="text-muted-foreground">×</span>
                    </div>
                    <Input 
                      id="weekly-multiplier" 
                      type="number"
                      min="1"
                      step="0.1"
                      value={basePrices.weeklyFrequencyMultiplier}
                      onChange={(e) => handleBasePriceChange('weeklyFrequencyMultiplier', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Множитель для еженедельных проверок (базовый)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-fee">Плата за API доступ (₽)</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="api-fee" 
                      type="number"
                      min="0"
                      value={basePrices.apiAccessFee}
                      onChange={(e) => handleBasePriceChange('apiAccessFee', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Дополнительная плата за API доступ
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="export-fee">Плата за экспорт отчетов (₽)</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      id="export-fee" 
                      type="number"
                      min="0"
                      value={basePrices.reportExportFee}
                      onChange={(e) => handleBasePriceChange('reportExportFee', e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Дополнительная плата за возможность экспорта отчетов
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Базовый план</CardTitle>
                <CardDescription>
                  Настройки базового тарифного плана
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="basic-price">Цена (₽/месяц)</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        id="basic-price" 
                        type="number"
                        min="0"
                        value={plans.basic.price}
                        onChange={(e) => handlePlanChange('basic', 'price', e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="basic-keywords">Лимит ключевых слов</Label>
                    <Input 
                      id="basic-keywords" 
                      type="number"
                      min="0"
                      value={plans.basic.keywordsLimit}
                      onChange={(e) => handlePlanChange('basic', 'keywordsLimit', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="basic-regions">Лимит регионов</Label>
                    <Input 
                      id="basic-regions" 
                      type="number"
                      min="1"
                      value={plans.basic.regionsLimit}
                      onChange={(e) => handlePlanChange('basic', 'regionsLimit', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="basic-frequency">Проверок в неделю</Label>
                    <Input 
                      id="basic-frequency" 
                      type="number"
                      min="1"
                      max="7"
                      value={plans.basic.frequencyPerWeek}
                      onChange={(e) => handlePlanChange('basic', 'frequencyPerWeek', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="basic-history">Дней истории</Label>
                    <Input 
                      id="basic-history" 
                      type="number"
                      min="1"
                      value={plans.basic.historyDays}
                      onChange={(e) => handlePlanChange('basic', 'historyDays', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="basic-notifications">Уведомления</Label>
                    <Switch 
                      id="basic-notifications" 
                      checked={plans.basic.enableNotifications}
                      onCheckedChange={(value) => handlePlanToggle('basic', 'enableNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="basic-export">Экспорт отчетов</Label>
                    <Switch 
                      id="basic-export" 
                      checked={plans.basic.enableExport}
                      onCheckedChange={(value) => handlePlanToggle('basic', 'enableExport', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="basic-api">API доступ</Label>
                    <Switch 
                      id="basic-api" 
                      checked={plans.basic.enableAPI}
                      onCheckedChange={(value) => handlePlanToggle('basic', 'enableAPI', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Стандартный план</CardTitle>
                <CardDescription>
                  Настройки стандартного тарифного плана
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard-price">Цена (₽/месяц)</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        id="standard-price" 
                        type="number"
                        min="0"
                        value={plans.standard.price}
                        onChange={(e) => handlePlanChange('standard', 'price', e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="standard-keywords">Лимит ключевых слов</Label>
                    <Input 
                      id="standard-keywords" 
                      type="number"
                      min="0"
                      value={plans.standard.keywordsLimit}
                      onChange={(e) => handlePlanChange('standard', 'keywordsLimit', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="standard-regions">Лимит регионов</Label>
                    <Input 
                      id="standard-regions" 
                      type="number"
                      min="1"
                      value={plans.standard.regionsLimit}
                      onChange={(e) => handlePlanChange('standard', 'regionsLimit', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="standard-frequency">Проверок в неделю</Label>
                    <Input 
                      id="standard-frequency" 
                      type="number"
                      min="1"
                      max="7"
                      value={plans.standard.frequencyPerWeek}
                      onChange={(e) => handlePlanChange('standard', 'frequencyPerWeek', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="standard-history">Дней истории</Label>
                    <Input 
                      id="standard-history" 
                      type="number"
                      min="1"
                      value={plans.standard.historyDays}
                      onChange={(e) => handlePlanChange('standard', 'historyDays', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="standard-notifications">Уведомления</Label>
                    <Switch 
                      id="standard-notifications" 
                      checked={plans.standard.enableNotifications}
                      onCheckedChange={(value) => handlePlanToggle('standard', 'enableNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="standard-export">Экспорт отчетов</Label>
                    <Switch 
                      id="standard-export" 
                      checked={plans.standard.enableExport}
                      onCheckedChange={(value) => handlePlanToggle('standard', 'enableExport', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="standard-api">API доступ</Label>
                    <Switch 
                      id="standard-api" 
                      checked={plans.standard.enableAPI}
                      onCheckedChange={(value) => handlePlanToggle('standard', 'enableAPI', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Профессиональный план</CardTitle>
                <CardDescription>
                  Настройки профессионального тарифного плана
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="professional-price">Цена (₽/месяц)</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        id="professional-price" 
                        type="number"
                        min="0"
                        value={plans.professional.price}
                        onChange={(e) => handlePlanChange('professional', 'price', e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="professional-keywords">Лимит ключевых слов</Label>
                    <Input 
                      id="professional-keywords" 
                      type="number"
                      min="0"
                      value={plans.professional.keywordsLimit}
                      onChange={(e) => handlePlanChange('professional', 'keywordsLimit', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="professional-regions">Лимит регионов</Label>
                    <Input 
                      id="professional-regions" 
                      type="number"
                      min="1"
                      value={plans.professional.regionsLimit}
                      onChange={(e) => handlePlanChange('professional', 'regionsLimit', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="professional-frequency">Проверок в неделю</Label>
                    <Input 
                      id="professional-frequency" 
                      type="number"
                      min="1"
                      max="7"
                      value={plans.professional.frequencyPerWeek}
                      onChange={(e) => handlePlanChange('professional', 'frequencyPerWeek', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="professional-history">Дней истории</Label>
                    <Input 
                      id="professional-history" 
                      type="number"
                      min="1"
                      value={plans.professional.historyDays}
                      onChange={(e) => handlePlanChange('professional', 'historyDays', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="professional-notifications">Уведомления</Label>
                    <Switch 
                      id="professional-notifications" 
                      checked={plans.professional.enableNotifications}
                      onCheckedChange={(value) => handlePlanToggle('professional', 'enableNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="professional-export">Экспорт отчетов</Label>
                    <Switch 
                      id="professional-export" 
                      checked={plans.professional.enableExport}
                      onCheckedChange={(value) => handlePlanToggle('professional', 'enableExport', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="professional-api">API доступ</Label>
                    <Switch 
                      id="professional-api" 
                      checked={plans.professional.enableAPI}
                      onCheckedChange={(value) => handlePlanToggle('professional', 'enableAPI', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle>Скидки</CardTitle>
              <CardDescription>
                Настройте скидки для разных объемов ключевых слов и длительности подписки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Скидки по объему ключевых слов</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-100">До 100 ключевых слов (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-100" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.keywords100}
                          onChange={(e) => handleDiscountChange('keywords100', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-500">От 100 до 500 ключевых слов (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-500" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.keywords500}
                          onChange={(e) => handleDiscountChange('keywords500', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-1000">От 500 до 1000 ключевых слов (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-1000" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.keywords1000}
                          onChange={(e) => handleDiscountChange('keywords1000', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-5000">От 1000 до 5000 ключевых слов (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-5000" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.keywords5000}
                          onChange={(e) => handleDiscountChange('keywords5000', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-10000">Более 5000 ключевых слов (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-10000" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.keywords10000}
                          onChange={(e) => handleDiscountChange('keywords10000', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Скидки по длительности подписки</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-quarterly">Квартальная подписка (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-quarterly" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.quarterlySubscription}
                          onChange={(e) => handleDiscountChange('quarterlySubscription', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Скидка при оплате за 3 месяца вперед
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount-annual">Годовая подписка (%)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="discount-annual" 
                          type="number"
                          min="0"
                          max="100"
                          value={discounts.annualSubscription}
                          onChange={(e) => handleDiscountChange('annualSubscription', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Скидка при оплате за 12 месяцев вперед
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Дополнительные настройки</CardTitle>
              <CardDescription>
                Настройте параметры пробного периода и дополнительных услуг
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Пробный период</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-trial">Включить бесплатный период</Label>
                      <Switch 
                        id="enable-trial" 
                        checked={additionalSettings.enableFreeTrial}
                        onCheckedChange={(value) => handleAdditionalSettingToggle('enableFreeTrial', value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trial-days">Длительность пробного периода (дни)</Label>
                      <Input 
                        id="trial-days" 
                        type="number"
                        min="1"
                        value={additionalSettings.freeTrialDays}
                        onChange={(e) => handleAdditionalSettingChange('freeTrialDays', e.target.value)}
                        disabled={!additionalSettings.enableFreeTrial}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="free-keywords">Лимит ключевых слов в пробном периоде</Label>
                      <Input 
                        id="free-keywords" 
                        type="number"
                        min="1"
                        value={additionalSettings.freeKeywordsLimit}
                        onChange={(e) => handleAdditionalSettingChange('freeKeywordsLimit', e.target.value)}
                        disabled={!additionalSettings.enableFreeTrial}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Дополнительные услуги</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="competitor-fee">Анализ конкурентов (₽)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="competitor-fee" 
                          type="number"
                          min="0"
                          value={additionalSettings.competitorAnalysisFee}
                          onChange={(e) => handleAdditionalSettingChange('competitorAnalysisFee', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Дополнительная плата за сравнительный анализ конкурентов
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whitelabel-fee">White label решение (₽)</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="whitelabel-fee" 
                          type="number"
                          min="0"
                          value={additionalSettings.whitelabelFee}
                          onChange={(e) => handleAdditionalSettingChange('whitelabelFee', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Дополнительная плата за white label отчеты без упоминания сервиса
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-bulk-discounts">Включить скидки за объем</Label>
                      <Switch 
                        id="enable-bulk-discounts" 
                        checked={additionalSettings.enableBulkDiscounts}
                        onCheckedChange={(value) => handleAdditionalSettingToggle('enableBulkDiscounts', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={handleResetToDefaults} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Сбросить настройки</span>
        </Button>
        
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save className="h-4 w-4" />
          <span>Сохранить настройки</span>
        </Button>
      </div>
    </div>
  );
};

export default PositionPricingSettings;
