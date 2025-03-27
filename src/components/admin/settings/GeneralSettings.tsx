
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const GeneralSettings: React.FC = () => {
  const [siteName, setSiteName] = useState("SeoMarket");
  const [siteUrl, setSiteUrl] = useState("https://seomarket.ru");
  const [adminEmail, setAdminEmail] = useState("admin@seomarket.ru");
  const [contactEmail, setContactEmail] = useState("support@seomarket.ru");
  const [description, setDescription] = useState("SeoMarket - платформа для SEO-аудита и автоматической оптимизации сайтов.");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    
    // Имитация сохранения на сервере
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Настройки сохранены",
        description: "Изменения общих настроек успешно сохранены.",
        variant: "default",
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="site-name">Название сайта</Label>
          <Input 
            id="site-name" 
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-url">URL сайта</Label>
          <Input 
            id="site-url" 
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email администратора</Label>
          <Input 
            id="admin-email" 
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)} 
            type="email" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact-email">Контактный Email</Label>
          <Input 
            id="contact-email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            type="email" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="site-description">Описание сайта</Label>
        <Textarea 
          id="site-description" 
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="maintenance-mode" 
          checked={maintenanceMode}
          onCheckedChange={setMaintenanceMode}
        />
        <Label htmlFor="maintenance-mode">
          Режим технического обслуживания
          {maintenanceMode && (
            <Badge variant="outline" className="ml-2 text-yellow-500 border-yellow-500">
              Активен
            </Badge>
          )}
        </Label>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Сохранить настройки</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;
