
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from 'lucide-react';
import { ContactPageContent } from './types';

interface ContactPageSettingsProps {
  contactPageContent: ContactPageContent;
  updateContactField: (field: string, value: string) => void;
  updateFormField: (index: number, field: string, value: string | boolean) => void;
  addFormField: () => void;
  removeFormField: (index: number) => void;
}

const ContactPageSettings: React.FC<ContactPageSettingsProps> = ({
  contactPageContent,
  updateContactField,
  updateFormField,
  addFormField,
  removeFormField
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки страницы "Контакты"</CardTitle>
          <CardDescription>Редактирование информации на странице контактов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-title">Заголовок страницы</Label>
            <Input 
              id="contact-title" 
              value={contactPageContent.title}
              onChange={(e) => updateContactField('title', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-subtitle">Подзаголовок</Label>
            <Textarea 
              id="contact-subtitle" 
              rows={2}
              value={contactPageContent.subtitle}
              onChange={(e) => updateContactField('subtitle', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input 
                id="contact-email" 
                type="email"
                value={contactPageContent.email}
                onChange={(e) => updateContactField('email', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Телефон</Label>
              <Input 
                id="contact-phone" 
                value={contactPageContent.phone}
                onChange={(e) => updateContactField('phone', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-address">Адрес</Label>
            <Textarea 
              id="contact-address" 
              rows={2}
              value={contactPageContent.address}
              onChange={(e) => updateContactField('address', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-map">Код карты (iframe)</Label>
            <Textarea 
              id="contact-map" 
              rows={3}
              value={contactPageContent.mapEmbed}
              onChange={(e) => updateContactField('mapEmbed', e.target.value)}
              placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Форма обратной связи</CardTitle>
            <CardDescription>Настройка полей в форме обратной связи</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addFormField}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить поле</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactPageContent.formFields.map((field, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Поле #{index + 1}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`field-visible-${index}`} 
                      checked={field.isVisible}
                      onCheckedChange={(checked) => updateFormField(index, 'isVisible', checked)}
                    />
                    <Label htmlFor={`field-visible-${index}`}>Видимость</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFormField(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`field-name-${index}`}>Имя поля (для программы)</Label>
                  <Input 
                    id={`field-name-${index}`} 
                    value={field.name}
                    onChange={(e) => updateFormField(index, 'name', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`field-label-${index}`}>Название (для пользователя)</Label>
                  <Input 
                    id={`field-label-${index}`} 
                    value={field.label}
                    onChange={(e) => updateFormField(index, 'label', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`field-type-${index}`}>Тип поля</Label>
                  <Select 
                    value={field.type} 
                    onValueChange={(value) => updateFormField(index, 'type', value)}
                  >
                    <SelectTrigger id={`field-type-${index}`}>
                      <SelectValue placeholder="Выберите тип поля" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Текстовое поле</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Телефон</SelectItem>
                      <SelectItem value="textarea">Многострочное поле</SelectItem>
                      <SelectItem value="select">Выпадающий список</SelectItem>
                      <SelectItem value="checkbox">Чекбокс</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 pt-8">
                  <Switch 
                    id={`field-required-${index}`} 
                    checked={field.required}
                    onCheckedChange={(checked) => updateFormField(index, 'required', checked)}
                  />
                  <Label htmlFor={`field-required-${index}`}>Обязательное поле</Label>
                </div>
              </div>
            </div>
          ))}
          
          {contactPageContent.formFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных полей формы. Нажмите "Добавить поле", чтобы создать первое поле.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPageSettings;
