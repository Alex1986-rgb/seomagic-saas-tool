
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from 'lucide-react';
import { AboutPageContent } from './types';

interface AboutPageSettingsProps {
  aboutPageContent: AboutPageContent;
  updateAboutField: (field: string, value: string) => void;
  updateSection: (index: number, field: string, value: string | boolean) => void;
  updateTeamMember: (index: number, field: string, value: string | boolean) => void;
  addSection: () => void;
  removeSection: (index: number) => void;
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
}

const AboutPageSettings: React.FC<AboutPageSettingsProps> = ({
  aboutPageContent,
  updateAboutField,
  updateSection,
  updateTeamMember,
  addSection,
  removeSection,
  addTeamMember,
  removeTeamMember
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки страницы "О нас"</CardTitle>
          <CardDescription>Редактирование заголовка и подзаголовка страницы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about-title">Заголовок страницы</Label>
            <Input 
              id="about-title" 
              value={aboutPageContent.title}
              onChange={(e) => updateAboutField('title', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about-subtitle">Подзаголовок</Label>
            <Textarea 
              id="about-subtitle" 
              rows={2}
              value={aboutPageContent.subtitle}
              onChange={(e) => updateAboutField('subtitle', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Разделы страницы</CardTitle>
            <CardDescription>Добавление и редактирование разделов</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addSection}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить раздел</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutPageContent.sections.map((section, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Раздел #{index + 1}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`section-visible-${index}`} 
                      checked={section.isVisible}
                      onCheckedChange={(checked) => updateSection(index, 'isVisible', checked)}
                    />
                    <Label htmlFor={`section-visible-${index}`}>Видимость</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSection(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`section-title-${index}`}>Заголовок раздела</Label>
                <Input 
                  id={`section-title-${index}`} 
                  value={section.title}
                  onChange={(e) => updateSection(index, 'title', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`section-content-${index}`}>Содержание</Label>
                <Textarea 
                  id={`section-content-${index}`} 
                  rows={4}
                  value={section.content}
                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          {aboutPageContent.sections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных разделов. Нажмите "Добавить раздел", чтобы создать первый раздел.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Команда</CardTitle>
            <CardDescription>Управление информацией о членах команды</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addTeamMember}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить сотрудника</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutPageContent.team.map((member, index) => (
            <div key={index} className="p-4 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Сотрудник #{index + 1}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`member-visible-${index}`} 
                      checked={member.isVisible}
                      onCheckedChange={(checked) => updateTeamMember(index, 'isVisible', checked)}
                    />
                    <Label htmlFor={`member-visible-${index}`}>Видимость</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTeamMember(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`member-name-${index}`}>Имя</Label>
                  <Input 
                    id={`member-name-${index}`} 
                    value={member.name}
                    onChange={(e) => updateTeamMember(index, 'name', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`member-position-${index}`}>Должность</Label>
                  <Input 
                    id={`member-position-${index}`} 
                    value={member.position}
                    onChange={(e) => updateTeamMember(index, 'position', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`member-photo-${index}`}>URL фотографии</Label>
                <Input 
                  id={`member-photo-${index}`} 
                  value={member.photo}
                  onChange={(e) => updateTeamMember(index, 'photo', e.target.value)} 
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          ))}
          
          {aboutPageContent.team.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Нет добавленных сотрудников. Нажмите "Добавить сотрудника", чтобы добавить первого члена команды.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPageSettings;
