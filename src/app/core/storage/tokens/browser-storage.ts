import { InjectionToken } from '@angular/core';

const resolveBrowserStorage = (): Storage | null => {
  try {
    const globalRef = globalThis as typeof globalThis & { localStorage?: Storage };
    return globalRef.localStorage ?? null;
  } catch {
    return null;
  }
};

export const BROWSER_STORAGE = new InjectionToken<Storage | null>('BROWSER_STORAGE', {
  providedIn: 'root',
  factory: resolveBrowserStorage,
});
