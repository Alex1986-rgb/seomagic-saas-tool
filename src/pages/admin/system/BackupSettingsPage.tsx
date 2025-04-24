
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Download, History, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BackupSettingsPage = () => {
  const [backupStatus, setBackupStatus] = React.useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [lastBackup, setLastBackup] = React.useState("2025-04-23 15:30");

  const handleCreateBackup = () => {
    setBackupStatus('creating');
    // Симуляция создания бэкапа
    setTimeout(() => {
      setBackupStatus('success');
      setLastBackup(new Date().toLocaleString());
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-3">Резервное копирование</h2>
      <p className="mb-4 text-muted-foreground">
        Управление резервными копиями базы данных и настроек системы.
      </p>

      {backupStatus === 'success' && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20">
          <AlertDescription className="text-green-600">
            Резервная копия успешно создана
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DatabaseBackup className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Текущий статус</h3>
                <p className="text-sm text-muted-foreground">
                  Последняя копия: {lastBackup}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleCreateBackup}
              disabled={backupStatus === 'creating'}
              className="flex gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {backupStatus === 'creating' ? 'Создание...' : 'Создать копию'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-medium mb-4">История резервных копий</h3>
            <div className="space-y-4">
              {[
                { date: "2025-04-23 15:30", size: "156 MB" },
                { date: "2025-04-22 15:30", size: "155 MB" },
                { date: "2025-04-21 15:30", size: "154 MB" },
              ].map((backup, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{backup.date}</p>
                      <p className="text-sm text-muted-foreground">{backup.size}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex gap-2">
                    <Download className="h-4 w-4" />
                    Скачать
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <div><b>Возможности:</b> автоматическое резервирование, ротация копий, восстановление данных.</div>
        <ul className="list-disc pl-5">
          <li>Ежедневное резервное копирование в 03:00</li>
          <li>Хранение копий за последние 30 дней</li>
          <li>Моментальное восстановление из бэкапа</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupSettingsPage;
