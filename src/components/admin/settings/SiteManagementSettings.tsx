
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Eye, UploadCloud, Image as ImageIcon, Trash, Globe, FileCode } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SiteManagementSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [siteTitle, setSiteTitle] = useState("SeoMarket");
  const [siteDescription, setSiteDescription] = useState("Платформа для SEO-аудита и автоматической оптимизации сайтов");
  const [metaKeywords, setMetaKeywords] = useState("SEO, аудит сайта, оптимизация, анализ позиций");
  const [canonicalUrl, setCanonicalUrl] = useState("https://seomarket.ru");
  const [favicon, setFavicon] = useState("/favicon.ico");
  const [logoPath, setLogoPath] = useState("/logo.svg");
  const [showOnHomepage, setShowOnHomepage] = useState({
    hero: true,
    features: true,
    pricing: true,
    testimonials: true,
    callToAction: true,
  });
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");
  const [ogImage, setOgImage] = useState("/og-image.jpg");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Имитация сохранения на сервере
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Настройки сохранены",
        description: "Изменения настроек сайта успешно сохранены.",
        variant: "default",
      });
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Основные</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Внешний вид</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span>Код</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-title">Заголовок сайта</Label>
              <Input 
                id="site-title" 
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="canonical-url">Канонический URL</Label>
              <Input 
                id="canonical-url" 
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-description">Описание сайта</Label>
            <Textarea 
              id="site-description" 
              rows={3}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Видимость секций на главной</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-hero" 
                  checked={showOnHomepage.hero}
                  onCheckedChange={(checked) => setShowOnHomepage({...showOnHomepage, hero: checked})}
                />
                <Label htmlFor="show-hero">Показывать секцию Hero</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-features" 
                  checked={showOnHomepage.features}
                  onCheckedChange={(checked) => setShowOnHomepage({...showOnHomepage, features: checked})}
                />
                <Label htmlFor="show-features">Показывать Особенности</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-pricing" 
                  checked={showOnHomepage.pricing}
                  onCheckedChange={(checked) => setShowOnHomepage({...showOnHomepage, pricing: checked})}
                />
                <Label htmlFor="show-pricing">Показывать Цены</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-testimonials" 
                  checked={showOnHomepage.testimonials}
                  onCheckedChange={(checked) => setShowOnHomepage({...showOnHomepage, testimonials: checked})}
                />
                <Label htmlFor="show-testimonials">Показывать Отзывы</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-cta" 
                  checked={showOnHomepage.callToAction}
                  onCheckedChange={(checked) => setShowOnHomepage({...showOnHomepage, callToAction: checked})}
                />
                <Label htmlFor="show-cta">Показывать Призыв к действию</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="seo" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea 
              id="meta-description" 
              rows={3}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Рекомендуемая длина: 150-160 символов</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meta-keywords">Meta Keywords</Label>
            <Input 
              id="meta-keywords" 
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)} 
            />
            <p className="text-xs text-muted-foreground">Разделяйте ключевые слова запятыми</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="og-image">OpenGraph изображение</Label>
            <div className="flex items-start gap-4">
              <div className="border rounded p-2 w-32 h-32 flex items-center justify-center bg-muted">
                {ogImage ? (
                  <img src={ogImage} alt="OG Image Preview" className="max-w-full max-h-full" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input 
                  id="og-image" 
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)} 
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" type="button">
                    <UploadCloud className="h-4 w-4" />
                    <span>Загрузить</span>
                  </Button>
                  {ogImage && (
                    <Button variant="outline" className="gap-2" type="button" onClick={() => setOgImage("")}>
                      <Trash className="h-4 w-4" />
                      <span>Удалить</span>
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Рекомендуемый размер: 1200 x 630 пикселей</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-start gap-4">
                <div className="border rounded p-2 w-16 h-16 flex items-center justify-center bg-muted">
                  {favicon ? (
                    <img src={favicon} alt="Favicon Preview" className="max-w-full max-h-full" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input 
                    id="favicon" 
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)} 
                  />
                  <Button variant="outline" className="gap-2" type="button">
                    <UploadCloud className="h-4 w-4" />
                    <span>Загрузить</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Логотип</Label>
              <div className="flex items-start gap-4">
                <div className="border rounded p-2 w-32 h-16 flex items-center justify-center bg-muted">
                  {logoPath ? (
                    <img src={logoPath} alt="Logo Preview" className="max-w-full max-h-full" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input 
                    id="logo" 
                    value={logoPath}
                    onChange={(e) => setLogoPath(e.target.value)} 
                  />
                  <Button variant="outline" className="gap-2" type="button">
                    <UploadCloud className="h-4 w-4" />
                    <span>Загрузить</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="custom-css">Пользовательский CSS</Label>
            <Textarea 
              id="custom-css" 
              rows={6}
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">CSS-код будет добавлен на все страницы сайта</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-js">Пользовательский JavaScript</Label>
            <Textarea 
              id="custom-js" 
              rows={6}
              value={customJs}
              onChange={(e) => setCustomJs(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">JavaScript-код будет добавлен на все страницы сайта</p>
          </div>
        </TabsContent>
      </Tabs>
      
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
              <span>Сохранить настройки сайта</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SiteManagementSettings;
