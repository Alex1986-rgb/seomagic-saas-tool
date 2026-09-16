
import React, { useState } from 'react';
import { Rocket, Download, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSimpleSitemapCreator } from './hooks/useSimpleSitemapCreator';
import { useToast } from "@/hooks/use-toast";
import { TextField } from '@/components/ui/TextField';

interface SimpleSitemapCreatorToolProps {
  domain?: string;
  initialUrl?: string;
  onUrlsScanned?: (urls: string[]) => void;
}

/**
 * Быстрый обход сайта и выгрузка карты сайта.
 *
 * После перевода на настоящий обход инструмент молча ничего не делал: гостю
 * сервер отказывает, но ошибку никто не показывал — кнопка просто не
 * реагировала. А кнопки скачивания появлялись только после отдельной
 * генерации карты, которую инструмент не вызывал, поэтому их не было никогда.
 * Теперь ошибка видна, а скачивать можно сразу после обхода: карта сайта
 * собирается при нажатии.
 */
const SimpleSitemapCreatorTool: React.FC<SimpleSitemapCreatorToolProps> = ({
  domain,
  initialUrl,
  onUrlsScanned
}) => {
  const [url, setUrl] = useState(initialUrl || domain || '');
  const { toast } = useToast();

  const {
    isScanning,
    isGenerating,
    progress,
    urls,
    currentUrl,
    error,
    startScan,
    downloadSitemap,
    downloadCsv
  } = useSimpleSitemapCreator({ url });

  const handleStartScan = async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Введите адрес сайта",
        variant: "destructive"
      });
      return;
    }

    const result = await startScan();
    if (result && onUrlsScanned && result.urls && result.urls.length > 0) {
      onUrlsScanned(result.urls);
    }
  };

  const hasUrls = !!urls && urls.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <TextField
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Адрес сайта, например example.com"
          className="flex-1"
        />
        <Button
          onClick={handleStartScan}
          variant="default"
          disabled={isScanning || isGenerating}
        >
          <Rocket className="mr-2 h-4 w-4" />
          Сканировать
        </Button>
      </div>

      {error && !isScanning && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
          <div>
            <p>{error}</p>
            {error.startsWith('Войдите') && (
              <Link to="/auth" className="text-primary underline underline-offset-2">
                Войти
              </Link>
            )}
          </div>
        </div>
      )}

      {hasUrls && !isScanning && (
        <div className="flex gap-2">
          <Button
            onClick={downloadSitemap}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Скачать sitemap.xml
          </Button>

          <Button
            onClick={downloadCsv}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Скачать адреса (CSV)
          </Button>
        </div>
      )}

      {isScanning && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm gap-2">
            <span className="truncate">Сканирование: {currentUrl || url}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-muted-foreground">
            {hasUrls ? `Найдено адресов: ${urls.length}` : 'Идёт сканирование...'}
          </div>
        </div>
      )}

      {hasUrls && !isScanning && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Найденные адреса ({urls.length})</h3>
          <div className="max-h-60 overflow-y-auto p-3 border rounded-md bg-background/50">
            <ul className="space-y-1 text-sm">
              {urls.slice(0, 100).map((pageUrl, index) => (
                <li key={index} className="truncate">{pageUrl}</li>
              ))}
              {urls.length > 100 && (
                <li className="text-muted-foreground">...и ещё {urls.length - 100}</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSitemapCreatorTool;
