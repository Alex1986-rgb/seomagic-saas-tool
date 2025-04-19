import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { HostingCredentials, hostingService } from '@/services/api/hostingService';
import { seoOptimizationController } from '@/services/api/seoOptimizationController';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, CloudUpload, Download, Server } from 'lucide-react';

interface DeploymentPanelProps {
  taskId: string;
  domain: string;
  isCompleted: boolean;
}

const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ taskId, domain, isCompleted }) => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<'ftp' | 'beget' | 'cpanel'>('ftp');
  const [credentials, setCredentials] = useState<HostingCredentials>({
    provider: 'ftp',
    host: '',
    username: '',
    password: '',
    apiKey: '',
    port: 21,
    path: '/public_html'
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deploymentResult, setDeploymentResult] = useState<{ success: boolean; message: string; url?: string } | null>(null);

  const handleProviderChange = (value: string) => {
    setProvider(value as 'ftp' | 'beget' | 'cpanel');
    setCredentials(prev => ({
      ...prev,
      provider: value as 'ftp' | 'beget' | 'cpanel',
      port: value === 'ftp' ? 21 : undefined
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownload = async () => {
    try {
      await seoOptimizationController.downloadOptimizedSite(taskId);
      toast({
        title: "Скачивание начато",
        description: `Оптимизированная версия сайта ${domain} будет скачана через несколько секунд.`
      });
    } catch (error) {
      toast({
        title: "Ошибка скачивания",
        description: error instanceof Error ? error.message : "Не удалось скачать оптимизированный сайт",
        variant: "destructive"
      });
    }
  };

  const handleDeploy = async () => {
    // Validate credentials
    if (!credentials.username) {
      toast({
        title: "Необходимо указать пользователя",
        description: "Введите имя пользователя для доступа к хостингу",
        variant: "destructive"
      });
      return;
    }

    if (!credentials.password && !credentials.apiKey) {
      toast({
        title: "Необходимо указать пароль или API ключ",
        description: "Введите пароль или API ключ для доступа к хостингу",
        variant: "destructive"
      });
      return;
    }

    if (provider === 'ftp' && !credentials.host) {
      toast({
        title: "Необходимо указать хост",
        description: "Введите FTP хост для подключения",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDeploying(true);
      setProgress(10);
      
      // Animation for progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);
      
      // Deploy the site
      const result = await seoOptimizationController.deploySite(taskId, credentials);
      
      clearInterval(interval);
      setProgress(100);
      
      setDeploymentResult({
        success: result.success,
        message: result.success ? "Сайт успешно опубликован" : result.error || "Ошибка публикации сайта",
        url: result.url
      });
      
      toast({
        title: result.success ? "Сайт опубликован" : "Ошибка публикации",
        description: result.success 
          ? `Оптимизированная версия сайта ${domain} успешно опубликована` 
          : result.error || "Не удалось опубликовать оптимизированный сайт",
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Ошибка публикации",
        description: error instanceof Error ? error.message : "Не удалось опубликовать оптимизированный сайт",
        variant: "destructive"
      });
      
      setDeploymentResult({
        success: false,
        message: error instanceof Error ? error.message : "Неизвестная ошибка при публикации сайта"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Публикация оптимизированного сайта
        </CardTitle>
        <CardDescription>
          Опубликуйте оптимизированную версию сайта на ваш хостинг или скачайте ZIP-архив
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isCompleted ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Дождитесь завершения оптимизации, чтобы опубликовать или скачать сайт.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2"
                disabled={!isCompleted}
              >
                <Download className="h-4 w-4" />
                Скачать оптимизированный сайт
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    или опубликовать на хостинг
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Выберите хостинг-провайдер</Label>
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Выберите провайдер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ftp">FTP</SelectItem>
                    <SelectItem value="beget">Beget</SelectItem>
                    <SelectItem value="cpanel">cPanel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {provider === 'ftp' && (
                <div className="space-y-2">
                  <Label htmlFor="host">FTP Хост</Label>
                  <Input id="host" name="host" placeholder="ftp.example.com" value={credentials.host} onChange={handleInputChange} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input id="username" name="username" placeholder="username" value={credentials.username} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" value={credentials.password} onChange={handleInputChange} />
              </div>
              
              {provider === 'beget' && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Ключ (опционально)</Label>
                  <Input id="apiKey" name="apiKey" placeholder="API ключ Beget" value={credentials.apiKey} onChange={handleInputChange} />
                </div>
              )}
              
              {(provider === 'ftp' || provider === 'cpanel') && (
                <div className="space-y-2">
                  <Label htmlFor="path">Путь на сервере</Label>
                  <Input id="path" name="path" placeholder="/public_html" value={credentials.path} onChange={handleInputChange} />
                </div>
              )}
              
              {provider === 'ftp' && (
                <div className="space-y-2">
                  <Label htmlFor="port">Порт</Label>
                  <Input id="port" name="port" type="number" placeholder="21" value={credentials.port?.toString()} onChange={handleInputChange} />
                </div>
              )}
            </div>
            
            {isDeploying && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Публикация сайта...</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {deploymentResult && (
              <Alert variant={deploymentResult.success ? "default" : "destructive"}>
                {deploymentResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {deploymentResult.message}
                  {deploymentResult.url && (
                    <div className="mt-2">
                      <a 
                        href={deploymentResult.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium underline underline-offset-4"
                      >
                        Открыть сайт
                      </a>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleDeploy} 
          disabled={!isCompleted || isDeploying}
          className="w-full"
        >
          <CloudUpload className="mr-2 h-4 w-4" />
          {isDeploying ? "Публикация..." : "Опубликовать на хостинг"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentPanel;
