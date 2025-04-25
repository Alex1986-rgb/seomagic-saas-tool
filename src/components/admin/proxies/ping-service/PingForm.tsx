
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Send } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';
import BatchProcessingConfig from './BatchProcessingConfig';

export const DEFAULT_RPC_SERVICES = [
    'http://rpc.pingomatic.com',
    'http://ping.feedburner.com',
    'http://rpc.weblogs.com/RPC2',
    'http://bing.com/webmaster/ping.aspx',
    'https://ping.blogs.yandex.ru/RPC2',
    'http://ping.blo.gs/',
    'http://blogsearch.google.com/ping/RPC2'
];

interface PingFormProps {
  onStartPing: (urls: string[], rpcServices: string[], siteTitle: string, feedUrl: string, useProxies: boolean) => Promise<void>;
  isLoading: boolean;
  progress: number;
  batchSize: number;
  setBatchSize: (value: number) => void;
  concurrency: number;
  setConcurrency: (value: number) => void;
  delay: number;
  setDelay: (value: number) => void;
}

const PingForm: React.FC<PingFormProps> = ({ 
  onStartPing, 
  isLoading, 
  progress,
  batchSize,
  setBatchSize,
  concurrency,
  setConcurrency,
  delay,
  setDelay 
}) => {
  const [urls, setUrls] = useState<string>('');
  const [siteTitle, setSiteTitle] = useState<string>('');
  const [feedUrl, setFeedUrl] = useState<string>('');
  const [useProxies, setUseProxies] = useState<boolean>(true);
  const [rpcServices, setRpcServices] = useState<string>(DEFAULT_RPC_SERVICES.join('\n'));
  const { toast } = useToast();

  const handleSubmit = async () => {
    const urlList = urls.split('\n').filter(url => url.trim());
    const rpcList = rpcServices.split('\n').filter(rpc => rpc.trim());
    
    if (urlList.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите хотя бы один URL для пинга",
        variant: "destructive",
      });
      return;
    }
    
    if (rpcList.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите хотя бы один RPC сервис",
        variant: "destructive",
      });
      return;
    }
    
    if (!siteTitle) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите название сайта",
        variant: "destructive",
      });
      return;
    }
    
    if (!feedUrl) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL RSS-ленты",
        variant: "destructive",
      });
      return;
    }
    
    await onStartPing(urlList, rpcList, siteTitle, feedUrl, useProxies);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="site-title">Название сайта</Label>
          <Input 
            id="site-title" 
            placeholder="Например: Мой бизнес-блог" 
            value={siteTitle} 
            onChange={e => setSiteTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="feed-url">URL RSS-ленты</Label>
          <Input 
            id="feed-url" 
            placeholder="https://example.com/feed.xml" 
            value={feedUrl} 
            onChange={e => setFeedUrl(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="urls">Список URL для пинга (по одному на строку)</Label>
        <Textarea
          id="urls"
          placeholder="https://example.com/post1&#10;https://example.com/post2&#10;https://example.com/post3"
          value={urls}
          onChange={e => setUrls(e.target.value)}
          rows={5}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rpc-services">Список XML-RPC сервисов (по одному на строку)</Label>
        <Textarea
          id="rpc-services"
          value={rpcServices}
          onChange={e => setRpcServices(e.target.value)}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Сервисы для уведомления о новом контенте. Вы можете добавить свои или использовать предустановленный список.
        </p>
      </div>
      
      <BatchProcessingConfig
        batchSize={batchSize}
        setBatchSize={setBatchSize}
        concurrency={concurrency}
        setConcurrency={setConcurrency}
        delay={delay}
        setDelay={setDelay}
      />
      
      <div className="flex items-center space-x-2">
        <Switch
          id="use-proxies"
          checked={useProxies}
          onCheckedChange={setUseProxies}
        />
        <Label htmlFor="use-proxies">Использовать прокси для пинга</Label>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Пинг выполняется...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Начать пинг
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            {progress < 100 ? "Выполняем пинг..." : "Пинг выполнен!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PingForm;
