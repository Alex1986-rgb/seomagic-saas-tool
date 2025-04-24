
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LogSettingsPage = () => {
  const [logLevel, setLogLevel] = React.useState('info');
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-3">Логирование событий</h2>
      <p className="mb-4 text-muted-foreground">
        Просмотр и настройка системных логов, мониторинг событий.
      </p>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Уровень логов" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск в логах..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Button variant="outline" className="flex gap-2">
              <Download className="h-4 w-4" />
              Экспорт логов
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { level: "error", message: "Failed to connect to database", timestamp: "2025-04-24 10:15:23" },
              { level: "warning", message: "High CPU usage detected", timestamp: "2025-04-24 10:14:55" },
              { level: "info", message: "User authentication successful", timestamp: "2025-04-24 10:14:30" },
              { level: "info", message: "Backup completed successfully", timestamp: "2025-04-24 10:14:00" },
              { level: "debug", message: "Cache cleared", timestamp: "2025-04-24 10:13:45" },
            ].map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  log.level === 'error' ? 'bg-red-50 border-red-200' :
                  log.level === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  log.level === 'info' ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className={`h-4 w-4 ${
                      log.level === 'error' ? 'text-red-500' :
                      log.level === 'warning' ? 'text-yellow-500' :
                      log.level === 'info' ? 'text-blue-500' :
                      'text-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{log.message}</p>
                      <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    log.level === 'error' ? 'bg-red-100 text-red-700' :
                    log.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    log.level === 'info' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <div><b>Возможности:</b> фильтрация по уровню, поиск, экспорт логов.</div>
        <ul className="list-disc pl-5">
          <li>Автоматическая ротация логов</li>
          <li>Уведомления о критических ошибках</li>
          <li>Интеграция с системами мониторинга</li>
        </ul>
      </div>
    </div>
  );
};

export default LogSettingsPage;
