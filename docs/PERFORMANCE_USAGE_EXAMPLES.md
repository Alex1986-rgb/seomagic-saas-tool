# Performance Monitoring - Usage Examples

## Quick Start

### 1. Wrap Components with PerformanceProfiler

```tsx
import { PerformanceProfiler } from '@/components/debug';

export default function MyComponent() {
  return (
    <PerformanceProfiler id="MyComponent">
      <div>
        {/* Your component content */}
      </div>
    </PerformanceProfiler>
  );
}
```

### 2. Use Performance Hook

```tsx
import { usePerformance } from '@/hooks';

export default function MyComponent() {
  const { renderCount, getMetrics } = usePerformance('MyComponent');
  
  useEffect(() => {
    console.log('Render count:', renderCount);
    console.log('Metrics:', getMetrics());
  }, [renderCount]);
  
  return <div>Content</div>;
}
```

### 3. Track Component Lifecycle

```tsx
import { useComponentLifecycle } from '@/hooks';

export default function MyComponent() {
  useComponentLifecycle('MyComponent');
  
  return <div>Content</div>;
}
```

## Advanced Examples

### Track Action Performance

```tsx
import { useActionPerformance } from '@/hooks';

export default function DataFetcher() {
  const { measure } = useActionPerformance('FetchUserData');
  
  const fetchData = async () => {
    await measure(async () => {
      const response = await fetch('/api/users');
      return response.json();
    });
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

### Profile Context Provider

```tsx
import { PerformanceProfiler } from '@/components/debug';

export const MyContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    state,
    setState
  }), [state]);
  
  return (
    <MyContext.Provider value={contextValue}>
      <PerformanceProfiler id="MyContextProvider">
        {children}
      </PerformanceProfiler>
    </MyContext.Provider>
  );
};
```

### Profile Heavy Computation

```tsx
import { useMemo } from 'react';
import { usePerformance } from '@/hooks';

export default function DataProcessor({ data }) {
  usePerformance('DataProcessor');
  
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    console.time('DataProcessing');
    const result = data.map(item => {
      // Heavy computation
      return expensiveTransform(item);
    });
    console.timeEnd('DataProcessing');
    return result;
  }, [data]);
  
  return <DataTable data={processedData} />;
}
```

### Profile List Rendering

```tsx
import { PerformanceProfiler } from '@/components/debug';
import { memo } from 'react';

// Memoize list item to prevent unnecessary re-renders
const ListItem = memo(({ item }) => (
  <div>{item.name}</div>
));

export default function List({ items }) {
  return (
    <PerformanceProfiler id="List">
      <div>
        {items.map(item => (
          <ListItem key={item.id} item={item} />
        ))}
      </div>
    </PerformanceProfiler>
  );
}
```

## Real-World Scenarios

### Scenario 1: Slow Context Updates

**Problem:** Context updates cause all consumers to re-render

```tsx
// ❌ BAD - Creates new object on every render
return (
  <MyContext.Provider value={{ data, updateData }}>
    {children}
  </MyContext.Provider>
);

// ✅ GOOD - Memoized value
const contextValue = useMemo(() => ({ 
  data, 
  updateData 
}), [data, updateData]);

return (
  <MyContext.Provider value={contextValue}>
    <PerformanceProfiler id="MyContext">
      {children}
    </PerformanceProfiler>
  </MyContext.Provider>
);
```

### Scenario 2: Expensive Component Re-renders

**Problem:** Parent re-renders cause child to re-render unnecessarily

```tsx
// ❌ BAD - Re-renders on every parent render
function ExpensiveChild({ data }) {
  return <ComplexVisualization data={data} />;
}

// ✅ GOOD - Only re-renders when data changes
const ExpensiveChild = memo(({ data }) => {
  usePerformance('ExpensiveChild');
  return <ComplexVisualization data={data} />;
});
```

### Scenario 3: Large List Performance

**Problem:** Rendering 1000s of items is slow

```tsx
import { PerformanceProfiler } from '@/components/debug';
import { FixedSizeList } from 'react-window';

export default function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <PerformanceProfiler id="VirtualList">
      <FixedSizeList
        height={600}
        itemCount={items.length}
        itemSize={50}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </PerformanceProfiler>
  );
}
```

### Scenario 4: API Call Performance

```tsx
import { useActionPerformance } from '@/hooks';
import { useQuery } from '@tanstack/react-query';

export default function UserProfile({ userId }) {
  const { measure } = useActionPerformance('FetchUser');
  
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => measure(async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    })
  });
  
  if (isLoading) return <Skeleton />;
  return <ProfileCard user={data} />;
}
```

## Monitoring Dashboard Usage

### View Real-Time Metrics

1. Open your app in development mode
2. Look for the Performance Debugger in bottom-right corner
3. Click the 🔄 icon to enable auto-refresh
4. Watch components as they render

### Analyze Slow Components

1. Click the 📊 button to print report to console
2. Look for components with:
   - Average duration > 16ms
   - High render count
   - Many slow renders
3. Investigate and optimize those components

### Browser Console Commands

```javascript
// Get all metrics
window.performanceMonitor.getMetrics()

// Get slow components (avg > 16ms)
window.performanceMonitor.getSlowComponents()

// Get top 10 most re-rendered
window.performanceMonitor.getMostReRendered(10)

// Print detailed report
window.performanceMonitor.printReport()

// Reset all metrics
window.performanceMonitor.reset()
```

## Optimization Checklist

- [ ] Wrap expensive components with `PerformanceProfiler`
- [ ] Use `React.memo` for components that render often
- [ ] Memoize context values with `useMemo`
- [ ] Use `useCallback` for event handlers
- [ ] Add unique keys to list items
- [ ] Implement virtual scrolling for long lists
- [ ] Lazy load off-screen components
- [ ] Code-split heavy features
- [ ] Monitor with Performance Debugger
- [ ] Review metrics regularly

## Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Render Time | < 16ms | 16-100ms | > 100ms |
| Re-renders | < 3 | 3-10 | > 10 |
| List Items | < 100 | 100-1000 | > 1000 |
| Context Updates | < 5/sec | 5-20/sec | > 20/sec |

## Common Mistakes

### 1. Not Using Keys
```tsx
// ❌ BAD
{items.map(item => <div>{item.name}</div>)}

// ✅ GOOD
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

### 2. Creating Functions in Render
```tsx
// ❌ BAD
<button onClick={() => handleClick(id)}>Click</button>

// ✅ GOOD
const onClick = useCallback(() => handleClick(id), [id]);
<button onClick={onClick}>Click</button>
```

### 3. Not Memoizing Expensive Computations
```tsx
// ❌ BAD
const result = expensiveCalculation(data);

// ✅ GOOD
const result = useMemo(() => expensiveCalculation(data), [data]);
```

### 4. Unnecessary Context Updates
```tsx
// ❌ BAD
const [count, setCount] = useState(0);
useEffect(() => {
  const interval = setInterval(() => setCount(c => c + 1), 100);
  return () => clearInterval(interval);
}, []);

// ✅ GOOD - Use ref for high-frequency updates
const countRef = useRef(0);
useEffect(() => {
  const interval = setInterval(() => {
    countRef.current++;
  }, 100);
  return () => clearInterval(interval);
}, []);
```

## Additional Resources

- [React Profiler API](https://react.dev/reference/react/Profiler)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools#profiler)
- [Optimizing Performance](https://react.dev/learn/render-and-commit)
- [React.memo](https://react.dev/reference/react/memo)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
