
/**
 * Creates a new Web Worker that can execute heavy computations
 * without blocking the main thread.
 * 
 * @param workerFunction The function to be executed in the Web Worker
 * @returns A function that takes the same arguments as workerFunction and returns a Promise
 */
export function createWorker<T extends (...args: any[]) => any>(
  workerFunction: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  // Create a string representation of the worker function
  const workerCode = `
    self.onmessage = function(e) {
      const result = (${workerFunction.toString()})(...e.data);
      self.postMessage(result);
    }
  `;

  // Create a blob from the worker code
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  
  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      const worker = new Worker(workerUrl);
      
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      
      worker.onerror = (e) => {
        reject(new Error(`Worker error: ${e.message}`));
        worker.terminate();
      };
      
      worker.postMessage(args);
    });
  };
}

/**
 * Example usage:
 * 
 * const heavyComputation = createWorker((data) => {
 *   // Some CPU-intensive calculation
 *   let result = 0;
 *   for (let i = 0; i < 1000000000; i++) {
 *     result += i;
 *   }
 *   return result;
 * });
 * 
 * // Use it like a regular function
 * heavyComputation().then(result => console.log(result));
 */
