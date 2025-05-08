
import React, { memo, ComponentType } from 'react';

/**
 * Memoizes a component with proper display name for debugging
 * 
 * @param Component - The component to memoize
 * @param propsAreEqual - Optional custom props comparison function
 * @returns Memoized component
 */
export function memoWithName<P extends object>(
  Component: ComponentType<P>, 
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<ComponentType<P>> {
  const MemoComponent = memo(Component, propsAreEqual);
  
  // Set a proper display name for React DevTools
  const displayName = Component.displayName || Component.name || 'Component';
  MemoComponent.displayName = `Memo(${displayName})`;
  
  return MemoComponent;
}

/**
 * Higher order component for easy memoization
 * Usage: export default withMemo(MyComponent);
 */
export function withMemo<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<ComponentType<P>> {
  return memoWithName(Component, propsAreEqual);
}
