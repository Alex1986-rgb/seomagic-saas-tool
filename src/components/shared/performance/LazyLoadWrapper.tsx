
import React, { Suspense, lazy, ComponentType } from 'react';
import { FullscreenLoader } from '@/components/ui/loading';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string | number;
}

/**
 * Wrapper component to provide consistent Suspense boundary with fallback
 */
export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback = <FullscreenLoader />,
  minHeight = '200px'
}) => {
  return (
    <div style={{ minHeight }}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};

/**
 * Helper function for creating lazily loaded components with proper naming
 * @param factory - Function that imports the component
 * @param name - Component name for debugging
 * @returns Lazy loaded component
 */
export function lazyWithName<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  name: string
): React.LazyExoticComponent<T> {
  const LazyComponent = lazy(factory);
  // TypeScript doesn't recognize displayName on LazyExoticComponent
  // so we need to use type assertion here
  (LazyComponent as any).displayName = `Lazy(${name})`;
  return LazyComponent;
}

/**
 * Creates a lazily loaded component with automatic Suspense wrapping
 * @param importFunc - Function that imports the component
 * @param name - Component name for debugging
 * @returns Ready-to-use lazy component with Suspense
 */
export function createLazyComponent<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  name: string
): React.FC<P> {
  const LazyComponent = lazyWithName(importFunc, name);
  
  const WrappedComponent: React.FC<P> = (props: P) => (
    <LazyLoadWrapper>
      <LazyComponent {...props as any} />
    </LazyLoadWrapper>
  );
  
  WrappedComponent.displayName = `LazyWrapped(${name})`;
  return WrappedComponent;
}
