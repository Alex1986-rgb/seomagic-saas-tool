
import { useState, useCallback, useEffect, useRef } from 'react';
import { proxyManager } from '@/services/proxy/proxyManager';
import type { Proxy } from '@/services/proxy/types';
import { useToast } from '../use-toast';

interface UseProxyCollectionOptions {
  /**
   * Вызывается по окончании сбора — и удачного, и прерванного ошибкой: список
   * в хранилище к этому моменту уже изменился. Сюда передают перечитывание
   * списка (useProxyManager.loadProxies), иначе «Список прокси (N)» остаётся
   * прежним до перезахода на страницу.
   */
  onCollected?: () => void;
}

/** Первый раунд занимает первую половину шкалы, второй — вторую. */
const FIRST_ROUND_SHARE = 50;
/**
 * Сколько дополнительных списков будет во втором раунде, хук заранее не знает,
 * поэтому до его окончания шкала не доходит до конца.
 */
const SECOND_ROUND_CAP = 95;

export function useProxyCollection({ onCollected }: UseProxyCollectionOptions = {}) {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  // Сколько прокси добавлено в список за последний сбор.
  const [collectedProxies, setCollectedProxies] = useState<number>(0);
  const [clearBeforeCollect, setClearBeforeCollect] = useState(true); // По умолчанию очищаем список
  const { toast } = useToast();

  // Держим последнюю версию колбэка, чтобы не пересоздавать collectProxies
  // при каждом рендере вызывающего компонента.
  const onCollectedRef = useRef(onCollected);
  useEffect(() => {
    onCollectedRef.current = onCollected;
  }, [onCollected]);

  const collectProxies = useCallback(async (shouldClear: boolean = clearBeforeCollect) => {
    try {
      setIsCollecting(true);
      setProgress(0);
      setCollectedProxies(0);
      setStatusMessage('Подготовка к сбору прокси...');

      // Подсчет активных источников
      let sourcesCount = 0;
      Object.values(proxyManager.defaultProxySources).forEach(source => {
        if (source.enabled) sourcesCount++;
      });

      // Проверяем источники до очистки: раньше список стирался, а уже потом
      // выяснялось, что собирать не из чего.
      if (sourcesCount === 0) {
        toast({
          title: "Нет активных источников",
          description: "Необходимо активировать источники во вкладке 'Источники'",
          variant: "destructive",
        });
        return 0;
      }

      if (shouldClear) {
        proxyManager.clearAllProxies();
      }

      // Первый раунд: основные источники. Колбэк приходит один раз на источник,
      // count — сколько всего добавлено в список с начала раунда.
      setStatusMessage('Сбор прокси из основных источников...');
      let completedSources = 0;

      const newProxies = await proxyManager.collectProxies((source, count) => {
        completedSources++;
        setProgress(Math.round((completedSources / sourcesCount) * FIRST_ROUND_SHARE));

        if (count >= 0) {
          setCollectedProxies(count);
          setStatusMessage(`Источник ${source} обработан, всего добавлено ${count} прокси`);
        } else {
          setStatusMessage(`Ошибка при сборе прокси из ${source}`);
        }
      }, shouldClear);

      setCollectedProxies(newProxies.length);
      setProgress(FIRST_ROUND_SHARE);

      // Второй раунд: дополнительные списки. Здесь колбэк приходит дважды на
      // источник — в начале запроса (count = 0) и по окончании, — а count
      // считает найденные адреса до сверки со списком: сколько из них новых,
      // известно только в конце раунда. Поэтому раньше статус «prev + count»
      // складывал накопительные числа, а шкала по двум вызовам на источник
      // не совпадала с числом источников.
      setStatusMessage('Сбор прокси из дополнительных источников...');
      const startedAdditional = new Set<string>();
      let finishedAdditional = 0;

      const secondRoundProxies = await proxyManager.collectAdditionalProxies((source, count) => {
        if (!startedAdditional.has(source)) {
          startedAdditional.add(source);
          // Первый вызов с нулём — только начало запроса, а не результат.
          if (count === 0) return;
        }

        finishedAdditional++;
        const share = finishedAdditional / startedAdditional.size;
        setProgress(prev => Math.max(
          prev,
          Math.min(SECOND_ROUND_CAP, FIRST_ROUND_SHARE + Math.round(share * (100 - FIRST_ROUND_SHARE)))
        ));

        if (count >= 0) {
          setStatusMessage(`Дополнительные источники: найдено ${count} адресов, в список попадут только новые`);
        } else {
          setStatusMessage('Один из дополнительных источников не ответил');
        }
      }, false); // Don't clear existing proxies in the second round

      const totalProxies = newProxies.length + secondRoundProxies.length;
      setCollectedProxies(totalProxies);
      setProgress(100);

      toast({
        title: "Сбор прокси завершен",
        description: `Добавлено в список: ${totalProxies} прокси`,
      });

      return totalProxies;
    } catch (error) {
      console.error("Ошибка при сборе прокси:", error);
      toast({
        title: "Ошибка сбора прокси",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
      return 0;
    } finally {
      setIsCollecting(false);
      setStatusMessage('');
      onCollectedRef.current?.();
    }
  }, [toast, clearBeforeCollect]);

  return {
    isCollecting,
    progress,
    statusMessage,
    collectedProxies,
    clearBeforeCollect,
    setClearBeforeCollect,
    collectProxies
  };
}
