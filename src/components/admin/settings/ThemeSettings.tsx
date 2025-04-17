
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ThemeSettings: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState("#0284c7");
  const [secondaryColor, setSecondaryColor] = useState("#64748b");
  const [darkMode, setDarkMode] = useState(true);
  const [fontFamily, setFontFamily] = useState("Inter");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки темы</CardTitle>
          <CardDescription>Настройте цветовую схему и внешний вид сайта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Основной цвет</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input 
                  id="primary-color" 
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Дополнительный цвет</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: secondaryColor }}
                />
                <Input 
                  id="secondary-color" 
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-family">Шрифт</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Выберите шрифт" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="dark-mode" 
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="dark-mode">Темная тема</Label>
          </div>
          
          <div className="pt-4 space-y-2">
            <Label>Предпросмотр</Label>
            <div className="p-4 border rounded-md" style={{ fontFamily }}>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Пример заголовка</h3>
                <p className="text-sm">Это пример текста с выбранным шрифтом и цветовой схемой.</p>
                <button 
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: primaryColor, color: "#fff" }}
                >
                  Кнопка
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;
