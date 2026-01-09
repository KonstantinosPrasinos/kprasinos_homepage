import { writable, type Writable } from 'svelte/store';

export function persistedStore<T>(key: string, initialValue: T): Writable<T> {
  const isBrowser = typeof window !== 'undefined';
  
  let storedValue: T = initialValue;
  
  if (isBrowser) {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        storedValue = JSON.parse(item);
      } catch (error) {
        console.error(`Error loading store "${key}":`, error);
      }
    }
  }

  const store = writable<T>(storedValue);

  if (isBrowser) {
    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return store;
}