import { Injectable, inject } from '@angular/core';
import { LoggingService } from '../logging/logging';
import type { AppStorageSchema } from './models/storage-schema';
import { BROWSER_STORAGE } from './tokens/browser-storage';

type ParsedValue<T> =
  | { ok: true; value: T }
  | { ok: false };

const parseJson = <T>(value: string): ParsedValue<T> => {
  try {
    return { ok: true, value: JSON.parse(value) as T };
  } catch {
    return { ok: false };
  }
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage = inject(BROWSER_STORAGE);
  private readonly logger = inject(LoggingService);

  get<K extends keyof AppStorageSchema>(key: K): AppStorageSchema[K] | null {
    if (!this.storage) {
      return null;
    }

    const rawValue = this.storage.getItem(key);
    if (rawValue === null) {
      return null;
    }

    const parsedValue = parseJson<AppStorageSchema[K]>(rawValue);
    if (!parsedValue.ok) {
      this.logger.warn('Invalid value found in browser storage', {
        feature: 'storage',
        key,
      });
      this.storage.removeItem(key);
      return null;
    }

    return parsedValue.value;
  }

  set<K extends keyof AppStorageSchema>(key: K, value: AppStorageSchema[K]): boolean {
    if (!this.storage) {
      return false;
    }

    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      this.logger.warn('Unable to write value to browser storage', {
        feature: 'storage',
        key,
        error,
      });
      return false;
    }
  }

  remove<K extends keyof AppStorageSchema>(key: K): void {
    if (!this.storage) {
      return;
    }

    this.storage.removeItem(key);
  }

  clear(): void {
    if (!this.storage) {
      return;
    }

    this.storage.clear();
  }
}
