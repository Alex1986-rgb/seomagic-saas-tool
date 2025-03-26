
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Globe, Trash } from 'lucide-react';

const ClientSitesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Сохраненные сайты</h3>
        <p className="text-muted-foreground mb-6">
          Здесь будут храниться ваши часто проверяемые сайты для быстрого доступа.
        </p>
        <Button>
          Добавить сайт
        </Button>
      </div>
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Опасная зона</h3>
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-800 mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Удаление аккаунта</h4>
              <p className="text-sm mt-1">
                После удаления аккаунта все данные будут потеряны, включая историю аудитов, отчеты и настройки. Это действие необратимо.
              </p>
            </div>
          </div>
        </div>
        <Button variant="destructive" className="gap-2">
          <Trash className="h-4 w-4" />
          <span>Удалить аккаунт</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientSitesTab;
