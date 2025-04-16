
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ButtonsSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Глобальные кнопки</CardTitle>
          <CardDescription>Настройка основных кнопок по всему сайту</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-button-text">Текст основной кнопки</Label>
                <Input 
                  id="primary-button-text" 
                  defaultValue="Проверить сайт" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary-button-color">Цвет основной кнопки</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="primary-button-color">
                    <SelectValue placeholder="Выберите цвет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Стандартный (синий)</SelectItem>
                    <SelectItem value="green">Зеленый</SelectItem>
                    <SelectItem value="red">Красный</SelectItem>
                    <SelectItem value="purple">Фиолетовый</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondary-button-text">Текст вторичной кнопки</Label>
                <Input 
                  id="secondary-button-text" 
                  defaultValue="Подробнее" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-radius">Скругление углов кнопок</Label>
                <Select defaultValue="md">
                  <SelectTrigger id="button-radius">
                    <SelectValue placeholder="Выберите размер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без скругления</SelectItem>
                    <SelectItem value="sm">Маленькое</SelectItem>
                    <SelectItem value="md">Среднее</SelectItem>
                    <SelectItem value="lg">Большое</SelectItem>
                    <SelectItem value="full">Полное</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="button-size">Размер кнопок</Label>
              <Select defaultValue="default">
                <SelectTrigger id="button-size">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Маленький</SelectItem>
                  <SelectItem value="default">Стандартный</SelectItem>
                  <SelectItem value="lg">Большой</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonsSettings;
