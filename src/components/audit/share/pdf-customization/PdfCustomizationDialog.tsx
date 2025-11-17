import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export interface PdfCustomizationOptions {
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  includeSummary: boolean;
  includeSeoAnalysis: boolean;
  includeTechnicalAnalysis: boolean;
  includePageAnalysis: boolean;
  includeRecommendations: boolean;
  includeOptimizations: boolean;
  companyName?: string;
  companyLogo?: string;
  reportTitle?: string;
}

interface PdfCustomizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: PdfCustomizationOptions) => void;
  defaultOptions?: Partial<PdfCustomizationOptions>;
}

const defaultPdfOptions: PdfCustomizationOptions = {
  includeCoverPage: true,
  includeTableOfContents: true,
  includeSummary: true,
  includeSeoAnalysis: true,
  includeTechnicalAnalysis: true,
  includePageAnalysis: true,
  includeRecommendations: true,
  includeOptimizations: true,
  companyName: '',
  reportTitle: 'SEO Аудит сайта',
};

export const PdfCustomizationDialog: React.FC<PdfCustomizationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  defaultOptions = {},
}) => {
  const [options, setOptions] = useState<PdfCustomizationOptions>({
    ...defaultPdfOptions,
    ...defaultOptions,
  });

  const handleCheckboxChange = (field: keyof PdfCustomizationOptions) => {
    setOptions(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (field: keyof PdfCustomizationOptions, value: string) => {
    setOptions(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirm = () => {
    onConfirm(options);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Настройка PDF отчета</DialogTitle>
          <DialogDescription>
            Выберите разделы и параметры для включения в PDF отчет
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Информация о компании</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Название отчета</Label>
                <Input
                  id="reportTitle"
                  value={options.reportTitle}
                  onChange={(e) => handleInputChange('reportTitle', e.target.value)}
                  placeholder="SEO Аудит сайта"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Название компании (опционально)</Label>
                <Input
                  id="companyName"
                  value={options.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Ваша компания"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Разделы отчета</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCoverPage"
                  checked={options.includeCoverPage}
                  onCheckedChange={() => handleCheckboxChange('includeCoverPage')}
                />
                <Label htmlFor="includeCoverPage" className="cursor-pointer">
                  Обложка с QR-кодом
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTableOfContents"
                  checked={options.includeTableOfContents}
                  onCheckedChange={() => handleCheckboxChange('includeTableOfContents')}
                />
                <Label htmlFor="includeTableOfContents" className="cursor-pointer">
                  Оглавление
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSummary"
                  checked={options.includeSummary}
                  onCheckedChange={() => handleCheckboxChange('includeSummary')}
                />
                <Label htmlFor="includeSummary" className="cursor-pointer">
                  Сводная информация
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSeoAnalysis"
                  checked={options.includeSeoAnalysis}
                  onCheckedChange={() => handleCheckboxChange('includeSeoAnalysis')}
                />
                <Label htmlFor="includeSeoAnalysis" className="cursor-pointer">
                  SEO анализ
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTechnicalAnalysis"
                  checked={options.includeTechnicalAnalysis}
                  onCheckedChange={() => handleCheckboxChange('includeTechnicalAnalysis')}
                />
                <Label htmlFor="includeTechnicalAnalysis" className="cursor-pointer">
                  Технический анализ
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePageAnalysis"
                  checked={options.includePageAnalysis}
                  onCheckedChange={() => handleCheckboxChange('includePageAnalysis')}
                />
                <Label htmlFor="includePageAnalysis" className="cursor-pointer">
                  Анализ страниц
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRecommendations"
                  checked={options.includeRecommendations}
                  onCheckedChange={() => handleCheckboxChange('includeRecommendations')}
                />
                <Label htmlFor="includeRecommendations" className="cursor-pointer">
                  Рекомендации
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeOptimizations"
                  checked={options.includeOptimizations}
                  onCheckedChange={() => handleCheckboxChange('includeOptimizations')}
                />
                <Label htmlFor="includeOptimizations" className="cursor-pointer">
                  Оптимизации и стоимость
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleConfirm}>
            Создать PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
