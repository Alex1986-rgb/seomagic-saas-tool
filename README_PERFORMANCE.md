# Performance Monitoring Guide

## Overview

This project includes built-in performance monitoring tools to help identify and fix performance bottlenecks in React components.

## Features

### 1. Performance Profiler

Wraps components to track render performance using React's built-in Profiler API.

```tsx
import { PerformanceProfiler } from '@/components/debug';

function MyComponent() {
  return (
    <PerformanceProfiler id="MyComponent">
      {/* Your component content */}
    </PerformanceProfiler>
  );
}
```

**What it tracks:**
- Render phase (mount/update)
- Actual render duration
- Base duration (without memoization)
- Render timestamp
- Slow renders (>100ms)
- Re-render events

### 2. Performance Debugger (Visual UI)

A floating debug panel that shows real-time performance metrics.

**Features:**
- Live metrics dashboard
- Auto-refresh capability
- Component render counts
- Average render times
- Slow render warnings
- Performance reports

**Location:** Bottom-right corner (development only)

**Controls:**
- 🔄 Auto-refresh toggle
- 📊 Print detailed report to console
- 🗑️ Reset all metrics

### 3. Performance Monitor (Programmatic API)

Global performance tracking accessible via browser console.

```javascript
// In browser console
window.performanceMonitor.getMetrics() // Get all metrics
window.performanceMonitor.getSlowComponents() // Get slow components
window.performanceMonitor.getMostReRendered(10) // Get top 10 re-rendered
window.performanceMonitor.printReport() // Print full report
window.performanceMonitor.reset() // Clear all data
```

## Current Implementations

Performance Profiler is currently enabled for:
- `AuditProvider` (all audit contexts)
- `AuditResultsContainer` (audit results page)

## Optimizations Applied

### Context Optimizations
All contexts now use:
- ✅ `useMemo` for context values
- ✅ `useCallback` for callback functions
- ✅ `React.memo` for bridge components
- ✅ Proper dependency arrays

**Optimized contexts:**
- `AuditContext`
- `ScanContext`
- `AuditModuleContext`
- `OptimizationContext`
- `AuditDataContext`

### Component Optimizations
- Fixed duplicate keys in `AnimatePresence`
- Memoized expensive computations
- Prevented unnecessary re-renders

## Performance Thresholds

- **16ms** - Target for 60fps (smooth animations)
- **100ms** - Threshold for slow render warnings
- Components consistently above 16ms should be optimized

## Best Practices

### 1. Use React.memo for expensive components
```tsx
export default React.memo(MyComponent);
```

### 2. Memoize context values
```tsx
const contextValue = useMemo(() => ({
  data,
  actions
}), [data, actions]);
```

### 3. Use useCallback for callbacks
```tsx
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### 4. Add keys to lists and AnimatePresence
```tsx
<AnimatePresence mode="wait">
  <TabsContent key="unique-key" value="tab1">
    {/* content */}
  </TabsContent>
</AnimatePresence>
```

## Debugging Slow Components

1. **Enable Performance Debugger** - It's on by default in development
2. **Watch the metrics** - Look for high render counts and slow averages
3. **Check console logs** - Profiler logs all renders with timing
4. **Run report** - Click 📊 or run `window.performanceMonitor.printReport()`
5. **Identify culprits** - Focus on components with:
   - High render count
   - Slow average duration (>16ms)
   - Many slow renders

## Common Issues

### High Render Count
**Cause:** Component re-renders too often
**Fix:** 
- Use `React.memo`
- Check parent component renders
- Verify dependency arrays

### Slow Average Duration
**Cause:** Heavy computation or large lists
**Fix:**
- Use `useMemo` for expensive calculations
- Implement virtualization for long lists
- Split into smaller components

### Duplicate Key Warnings
**Cause:** Multiple children with same key
**Fix:** 
- Add unique `key` prop to each child
- Use stable identifiers (IDs, not indexes)

## Production

All performance monitoring is automatically disabled in production builds to avoid overhead.

To enable in production (not recommended):
```tsx
<PerformanceProfiler id="MyComponent" enabled={true}>
```

## Tools Integration

Works seamlessly with:
- React DevTools Profiler
- Chrome Performance Tab
- Lighthouse
- Web Vitals

## Next Steps

Consider adding:
- [ ] Virtual scrolling for large lists
- [ ] Code splitting for heavy components
- [ ] Lazy loading for off-screen content
- [ ] Web Workers for heavy computations
- [ ] Intersection Observer for lazy rendering
