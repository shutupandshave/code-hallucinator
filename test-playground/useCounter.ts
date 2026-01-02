import { useState, useCallback } from 'react';

interface CounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface CounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

// Custom hook for counter logic
export function useCounter(options: CounterOptions = {}): CounterReturn {
  const {
    initialValue = 0,
    min = -Infinity,
    max = Infinity,
    step = 1
  } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + step, max));
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - step, min));
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback(
    (value: number) => {
      setCount(Math.max(min, Math.min(value, max)));
    },
    [min, max]
  );

  return { count, increment, decrement, reset, setCount: setValue };
}
