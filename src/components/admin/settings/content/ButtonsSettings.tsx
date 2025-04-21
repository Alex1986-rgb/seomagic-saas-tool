
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ButtonsSettings: React.FC = () => {
  const [primaryButtonColor, setPrimaryButtonColor] = useState("#0284c7");
  const [secondaryButtonColor, setSecondaryButtonColor] = useState("#64748b");
  const [buttonStyle, setButtonStyle] = useState("rounded");
  const [buttonSize, setButtonSize] = useState("medium");
  const [useAnimations, setUseAnimations] = useState(true);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки глобальных кнопок</CardTitle>
          <CardDescription>Настройте внешний вид и стиль кнопок на всем сайте</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Цвет основных кнопок</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: primaryButtonColor }}
                />
                <Input 
                  id="primary-color" 
                  type="text"
                  value={primaryButtonColor}
                  onChange={(e) => setPrimaryButtonColor(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Цвет вторичных кнопок</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: secondaryButtonColor }}
                />
                <Input 
                  id="secondary-color" 
                  type="text"
                  value={secondaryButtonColor}
                  onChange={(e) => setSecondaryButtonColor(e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="button-style">Стиль кнопок</Label>
              <Select value={buttonStyle} onValueChange={setButtonStyle}>
                <SelectTrigger id="button-style">
                  <SelectValue placeholder="Выберите стиль кнопок" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Скругленные</SelectItem>
                  <SelectItem value="square">Квадратные</SelectItem>
                  <SelectItem value="pill">Капсула</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="button-size">Размер кнопок по умолчанию</Label>
              <Select value={buttonSize} onValueChange={setButtonSize}>
                <SelectTrigger id="button-size">
                  <SelectValue placeholder="Выберите размер кнопок" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Маленький</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="large">Большой</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-animations">Анимации при наведении</Label>
              <Switch 
                id="use-animations" 
                checked={useAnimations} 
                onCheckedChange={setUseAnimations}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Включите анимации для плавного изменения кнопок при наведении и нажатии
            </p>
          </div>
          
          <div className="pt-4 space-y-2">
            <Label>Предпросмотр кнопок</Label>
            <div className="flex flex-wrap gap-3 p-4 border rounded-md">
              <Button variant="default">Основная кнопка</Button>
              <Button variant="secondary">Вторичная кнопка</Button>
              <Button variant="outline">Третичная кнопка</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonsSettings;
