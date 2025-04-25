
import { ProxySources } from './proxyManager';

// Массив URL-источников для сбора прокси из Python-скрипта
export const pythonProxySources = [
    'https://www.sslproxies.org/',
    'https://free-proxy-list.net/',
    'https://www.us-proxy.org/',
    'https://spys.me/proxy.txt',
    'https://www.proxy-list.download/HTTPS',
    'https://www.proxy-list.download/HTTP',
    'https://www.proxy-list.download/SOCKS4',
    'https://www.proxy-list.download/SOCKS5',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://best-proxies.ru/proxylist/free/',
    'https://proxycompass.com/ru/free-proxy/',
    'https://advanced.name/ru/freeproxy',
    'https://spys.one/proxies/',
    'https://ru.proxy-tools.com/',
    'https://htmlweb.ru/analiz/proxy_list.php',
    'https://trustytech.io/ru/tools/free-proxy/',
    'https://hidemy.name/ru/proxy-list/',
    'https://www.proxynova.com/proxy-server-list/',
    'https://www.freeproxylists.net/',
    'https://www.socks-proxy.net/',
    'https://www.my-proxy.com/free-proxy-list.html',
    'https://www.cool-proxy.net/',
    'https://proxy-list.org/english/index.php',
    'https://www.geonode.com/free-proxy-list/',
    'https://www.ip-adress.com/proxy_list/',
    'https://www.proxyscan.io/',
    'https://www.freeproxy.world/',
    'https://proxy-daily.com/',
    'https://hidemy.name/en/proxy-list/',
    'https://free-proxy.cz/en/',
    'http://www.proxylisty.com/',
    'http://www.workingproxies.org/'
];

// Массив XML-RPC сервисов для пинга из Python-скрипта
export const xmlRpcServices = [
    'http://rpc.pingomatic.com',
    'http://ping.feedburner.com',
    'http://rpc.weblogs.com/RPC2',
    'http://bing.com/webmaster/ping.aspx',
    'https://ping.blogs.yandex.ru/RPC2',
    'http://ping.blo.gs/',
    'http://blog.goo.ne.jp/XMLRPC',
    'http://blog.with2.net/ping.php',
    'http://blogping.unidatum.com/RPC2',
    'http://blogpingr.de/ping/rpc2',
    'http://api.my.yahoo.com/rss/ping',
    'http://api.my.yahoo.com/RPC2',
    'http://blogsearch.google.com/ping/RPC2'
];

// Функция для создания источников прокси из URL-массива
export const createProxySources = (urls: string[]): ProxySources => {
    const sources: ProxySources = {};
    
    urls.forEach((url, index) => {
        // Создаем уникальное имя для источника
        const sourceName = url.includes('://') 
            ? new URL(url).hostname.replace('www.', '')
            : `custom-source-${index}`;
            
        sources[sourceName] = {
            url,
            enabled: true,
            parseFunction: (html: string) => {
                // Универсальный парсер для извлечения IP:PORT из HTML и текста
                const ipPortRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/g;
                const matches = html.matchAll(ipPortRegex);
                const result = [];
                
                for (const match of matches) {
                    const ip = match[1];
                    const port = parseInt(match[2], 10);
                    
                    if (ip && !isNaN(port)) {
                        result.push({
                            id: `${ip}:${port}`,
                            ip,
                            port,
                            protocol: 'http',
                            status: 'testing',
                            lastChecked: new Date(),
                            source: sourceName
                        });
                    }
                }
                
                return result;
            }
        };
    });
    
    return sources;
};

// Функция для загрузки дополнительных источников прокси из localStorage
export const loadCustomProxySources = (): ProxySources => {
    try {
        const savedSources = localStorage.getItem('custom_proxy_sources');
        if (savedSources) {
            return JSON.parse(savedSources);
        }
    } catch (error) {
        console.error('Ошибка загрузки пользовательских источников прокси:', error);
    }
    return {};
};

// Функция для сохранения дополнительных источников прокси в localStorage
export const saveCustomProxySources = (sources: ProxySources): void => {
    try {
        localStorage.setItem('custom_proxy_sources', JSON.stringify(sources));
    } catch (error) {
        console.error('Ошибка сохранения пользовательских источников прокси:', error);
    }
};
