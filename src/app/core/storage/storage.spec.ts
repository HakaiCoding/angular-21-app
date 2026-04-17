import { TestBed } from '@angular/core/testing';
import { LoggingService } from '../logging/logging';
import { STORAGE_KEYS } from './models/storage-schema';
import { StorageService } from './storage';
import { BROWSER_STORAGE } from './tokens/browser-storage';

class BrowserStorageStub implements Storage {
  private readonly entries = new Map<string, string>();

  get length(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
  }

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.entries.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }
}

describe('StorageService', () => {
  let service: StorageService;
  let storage: BrowserStorageStub;
  let warningCalls: Array<{ message: string; context: Record<string, unknown> }>;

  beforeEach(() => {
    storage = new BrowserStorageStub();
    warningCalls = [];

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {
          provide: BROWSER_STORAGE,
          useValue: storage,
        },
        {
          provide: LoggingService,
          useValue: {
            warn: (message: string, context: Record<string, unknown>) => {
              warningCalls.push({ message, context });
            },
          },
        },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('stores and reads typed values', () => {
    const written = service.set(STORAGE_KEYS.language, 'fr');
    const value = service.get(STORAGE_KEYS.language);

    expect(written).toBe(true);
    expect(value).toBe('fr');
  });

  it('returns null for missing values', () => {
    expect(service.get(STORAGE_KEYS.language)).toBeNull();
  });

  it('removes invalid json values from storage', () => {
    storage.setItem(STORAGE_KEYS.language, 'plain-string');

    const value = service.get(STORAGE_KEYS.language);

    expect(value).toBeNull();
    expect(storage.getItem(STORAGE_KEYS.language)).toBeNull();
    expect(warningCalls.length).toBe(1);
  });

  it('removes values with typed keys', () => {
    service.set(STORAGE_KEYS.language, 'es');

    service.remove(STORAGE_KEYS.language);

    expect(service.get(STORAGE_KEYS.language)).toBeNull();
  });

  it('returns false when browser storage is unavailable', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {
          provide: BROWSER_STORAGE,
          useValue: null,
        },
        {
          provide: LoggingService,
          useValue: {
            warn: () => undefined,
          },
        },
      ],
    });

    const unavailableService = TestBed.inject(StorageService);

    expect(unavailableService.set(STORAGE_KEYS.language, 'de')).toBe(false);
    expect(unavailableService.get(STORAGE_KEYS.language)).toBeNull();
  });
});
