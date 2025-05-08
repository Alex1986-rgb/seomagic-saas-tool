
import React, { ComponentType, Suspense, lazy, PropsWithoutRef, PropsWithRef, ForwardedRef, RefAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Состояния загрузки для компонента
 */
type LoadingState = 'loading' | 'loaded' | 'error';

/**
 * Свойства компонента LazyLoadWrapper
 */
interface LazyLoadWrapperProps<P = {}> {
  /**
   * Путь к компоненту для отложенной загрузки
   */
  componentImport: () => Promise<{ default: ComponentType<P> }>;
  /**
   * Свойства, передаваемые в загружаемый компонент
   */
  componentProps?: P;
  /**
   * Отображаемый компонент во время загрузки
   */
  loadingComponent?: React.ReactNode;
  /**
   * CSS классы для обертки
   */
  className?: string;
  /**
   * Использовать Suspense вместо состояния
   */
  useSuspense?: boolean;
  /**
   * Приоритет загрузки
   */
  loadingPriority?: 'high' | 'low';
}

/**
 * Компонент для отложенной загрузки (lazy loading) других компонентов
 */
export function LazyLoadWrapper<P extends object = {}>({
  componentImport,
  componentProps,
  loadingComponent,
  className,
  useSuspense = false,
  loadingPriority = 'low',
}: LazyLoadWrapperProps<P>): React.ReactElement {
  // Использовать lazy для отложенной загрузки компонента
  const LazyComponent = React.useMemo(() => {
    const lazyComponent = lazy(componentImport);
    // Используем as для приведения типа компонента
    (lazyComponent as any).displayName = `LazyLoaded(${componentImport.name || 'Component'})`;
    return lazyComponent;
  }, [componentImport]);

  const [loadingState, setLoadingState] = React.useState<LoadingState>('loading');

  // Загрузить компонент без Suspense
  React.useEffect(() => {
    if (useSuspense) return;

    componentImport()
      .then(() => setLoadingState('loaded'))
      .catch((error) => {
        console.error('Failed to load component:', error);
        setLoadingState('error');
      });
  }, [componentImport, useSuspense]);

  // Если используем Suspense, то возвращаем компонент обернутый в Suspense
  if (useSuspense) {
    return (
      <Suspense fallback={loadingComponent || <DefaultLoadingComponent />}>
        <LazyComponent {...(componentProps as any)} />
      </Suspense>
    );
  }

  // Если не используем Suspense, то управляем загрузкой сами
  return (
    <div className={cn('lazy-load-wrapper', className)}>
      {loadingState === 'loading' && (loadingComponent || <DefaultLoadingComponent />)}
      {loadingState === 'loaded' && <LazyComponent {...(componentProps as any)} />}
      {loadingState === 'error' && <ErrorComponent />}
    </div>
  );
}

/**
 * Компонент загрузки по умолчанию
 */
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

/**
 * Компонент отображения ошибки
 */
const ErrorComponent: React.FC = () => (
  <div className="flex items-center justify-center p-4 text-red-500">
    <p>Не удалось загрузить компонент</p>
  </div>
);

export default LazyLoadWrapper;
