
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuditPageSettingsProps {
  auditPageContent: {
    title: string;
    description: string;
    placeholderText: string;
    buttonText: string;
    tips: Array<{
      text: string;
      isVisible: boolean;
    }>;
  };
  updateAuditField: (field: string, value: string) => void;
  updateAuditTip: (index: number, field: string, value: string | boolean) => void;
}

const AuditPageSettings: React.FC<AuditPageSettingsProps> = ({
  auditPageContent,
  updateAuditField,
  updateAuditTip
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки страницы аудита</CardTitle>
          <CardDescription>Редактирование текстов на странице аудита</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audit-title">Заголовок страницы</Label>
            <Input 
              id="audit-title" 
              value={auditPageContent.title}
              onChange={(e) => updateAuditField('title', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audit-description">Описание</Label>
            <Textarea 
              id="audit-description" 
              rows={3}
              value={auditPageContent.description}
              onChange={(e) => updateAuditField('description', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audit-placeholder">Текст placeholder</Label>
              <Input 
                id="audit-placeholder" 
                value={auditPageContent.placeholderText}
                onChange={(e) => updateAuditField('placeholderText', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audit-button-text">Текст кнопки</Label>
              <Input 
                id="audit-button-text" 
                value={auditPageContent.buttonText}
                onChange={(e) => updateAuditField('buttonText', e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Подсказки для пользователей</CardTitle>
          <CardDescription>Настройка подсказок на странице аудита</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {auditPageContent.tips.map((tip, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Подсказка #{index + 1}</h4>
                <div className="flex items-center gap-2">
                  <Switch 
                    id={`tip-visible-${index}`} 
                    checked={tip.isVisible}
                    onCheckedChange={(checked) => updateAuditTip(index, 'isVisible', checked)}
                  />
                  <Label htmlFor={`tip-visible-${index}`}>Видимость</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`tip-text-${index}`}>Текст подсказки</Label>
                <Input 
                  id={`tip-text-${index}`} 
                  value={tip.text}
                  onChange={(e) => updateAuditTip(index, 'text', e.target.value)} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPageSettings;
