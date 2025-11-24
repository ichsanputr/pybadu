// Simple Web Worker Example
// This worker runs in a separate thread from the main UI thread

// Listen for messages from the main thread
self.addEventListener('message', function(e) {
  const { type, data } = e.data
  
  console.log('Worker received:', type, data)
  
  switch (type) {
    case 'CALCULATE_SUM':
      // Simulate some heavy computation
      const numbers = data.numbers || []
      let sum = 0
      
      // Heavy computation loop (simulates processing)
      for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i]
        // Simulate delay for demonstration
        for (let j = 0; j < 1000000; j++) {
          // Busy wait to simulate computation
        }
      }
      
      // Send result back to main thread
      self.postMessage({
        type: 'SUM_RESULT',
        result: sum,
        message: `Calculated sum of ${numbers.length} numbers`
      })
      break
      
    case 'FIBONACCI':
      // Calculate Fibonacci number (can be slow for large numbers)
      const n = data.number || 0
      const result = calculateFibonacci(n)
      
      self.postMessage({
        type: 'FIBONACCI_RESULT',
        number: n,
        result: result,
        message: `Fibonacci(${n}) = ${result}`
      })
      break
      
    case 'PROCESS_ARRAY':
      // Process array data
      const array = data.array || []
      const processed = array.map((item, index) => ({
        original: item,
        index: index,
        squared: item * item,
        doubled: item * 2
      }))
      
      self.postMessage({
        type: 'ARRAY_PROCESSED',
        result: processed,
        message: `Processed ${array.length} items`
      })
      break
      
    default:
      self.postMessage({
        type: 'ERROR',
        message: 'Unknown message type: ' + type
      })
  }
})

// Helper function to calculate Fibonacci
function calculateFibonacci(n) {
  if (n <= 1) return n
  if (n === 2) return 1
  
  let a = 1, b = 1
  for (let i = 3; i <= n; i++) {
    const temp = a + b
    a = b
    b = temp
  }
  return b
}

// Send ready message when worker is initialized
self.postMessage({
  type: 'WORKER_READY',
  message: 'Worker is ready to process tasks!'
})

