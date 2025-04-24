
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  active: boolean;
  url: string;
}

const MarketingEditor: React.FC = () => {
  const { toast } = useToast();
  
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([
    {
      id: '1',
      name: 'Летняя акция',
      description: 'Скидка 20% на все тарифы до конца августа',
      active: true,
      url: '/promo/summer'
    },
    {
      id: '2',
      name: 'Для новых клиентов',
      description: 'Первый месяц бесплатно',
      active: false,
      url: '/promo/new-users'
    }
  ]);
  
  const handleSave = (data: any) => {
    console.log('Saving marketing data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Маркетинговые материалы успешно обновлены"
    });
  };
  
  const addCampaign = () => {
    const newCampaign: MarketingCampaign = {
      id: Date.now().toString(),
      name: 'Новая кампания',
      description: 'Описание кампании',
      active: false,
      url: '/promo/new'
    };
    
    setCampaigns([...campaigns, newCampaign]);
    
    toast({
      title: "Кампания добавлена",
      description: "Новая маркетинговая кампания создана"
    });
  };
  
  const removeCampaign = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    
    toast({
      title: "Кампания удалена",
      description: "Маркетинговая кампания успешно удалена"
    });
  };
  
  const updateCampaign = (id: string, field: string, value: string | boolean) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, [field]: value } : campaign
    ));
  };

  return (
    <>
      <Helmet>
        <title>Маркетинговые материалы | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Маркетинговые материалы"
        description="Управление акциями, промо-страницами и маркетинговыми кампаниями"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Настройки попапов</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок попапа</label>
                  <Input 
                    defaultValue="Получите бесплатный аудит сайта" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Текст попапа</label>
                  <Textarea 
                    defaultValue="Оставьте email и получите бесплатный SEO-аудит вашего сайта" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Показывать попап</label>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Задержка перед показом (сек)</label>
                  <Input 
                    type="number"
                    defaultValue="15" 
                    className="bg-black/20 border-white/10 w-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Маркетинговые кампании</h3>
                <Button onClick={addCampaign} className="bg-primary hover:bg-primary/90" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Добавить кампанию
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="border-white/10 bg-black/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-3">
                        <div className="flex-grow">
                          <label className="block text-xs font-medium mb-1">Название кампании</label>
                          <Input 
                            value={campaign.name}
                            onChange={(e) => updateCampaign(campaign.id, 'name', e.target.value)}
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        <div className="flex items-start ml-4">
                          <div className="flex items-center mr-4">
                            <Switch
                              checked={campaign.active}
                              onCheckedChange={(checked) => updateCampaign(campaign.id, 'active', checked)}
                            />
                            <span className="ml-2 text-sm">{campaign.active ? 'Активна' : 'Неактивна'}</span>
                          </div>
                          <Button 
                            onClick={() => removeCampaign(campaign.id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1">Описание</label>
                        <Textarea 
                          value={campaign.description}
                          onChange={(e) => updateCampaign(campaign.id, 'description', e.target.value)}
                          className="bg-black/20 border-white/10"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">URL кампании</label>
                        <Input 
                          value={campaign.url}
                          onChange={(e) => updateCampaign(campaign.id, 'url', e.target.value)}
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {campaigns.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
                    <p className="text-gray-400">Кампании не найдены. Создайте новую маркетинговую кампанию.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Баннеры</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок главного баннера</label>
                  <Input 
                    defaultValue="Оптимизация сайта за 3 дня" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание баннера</label>
                  <Textarea 
                    defaultValue="Мы проведем полный аудит и оптимизацию вашего сайта всего за 3 дня" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL кнопки баннера</label>
                  <Input 
                    defaultValue="/services/express" 
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Показывать главный баннер</label>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseContentEditor>
    </>
  );
};

export default MarketingEditor;
