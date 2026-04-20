import { TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { LoggingService } from '../logging/logging.service';
import { STORAGE_KEYS } from '../storage/models/storage-schema';
import { StorageService } from '../storage/storage.service';
import { APP_AVAILABLE_LANGUAGE_CODES, APP_DEFAULT_LANGUAGE } from './language-options';
import { LanguagePersistenceService } from './language-persistence';

class StorageServiceStub {
  value: string | null = null;
  setCalls: Array<{ key: string; value: string }> = [];
  removeCalls: string[] = [];

  get(key: typeof STORAGE_KEYS.language): string | null {
    return key === STORAGE_KEYS.language ? this.value : null;
  }

  set(key: typeof STORAGE_KEYS.language, value: string): boolean {
    this.setCalls.push({ key, value });
    this.value = value;
    return true;
  }

  remove(key: typeof STORAGE_KEYS.language): void {
    this.removeCalls.push(key);
    this.value = null;
  }
}

describe('LanguagePersistenceService', () => {
  let service: LanguagePersistenceService;
  let transloco: TranslocoService;
  let storage: StorageServiceStub;
  let originalDocumentLanguage: string | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: APP_AVAILABLE_LANGUAGE_CODES,
            defaultLang: APP_DEFAULT_LANGUAGE.code,
          },
          langs: Object.fromEntries(
            APP_AVAILABLE_LANGUAGE_CODES.map((code) => [code, {}]),
          ),
        }),
      ],
      providers: [
        LanguagePersistenceService,
        {
          provide: StorageService,
          useClass: StorageServiceStub,
        },
        {
          provide: LoggingService,
          useValue: {
            warn: () => undefined,
          },
        },
      ],
    });

    service = TestBed.inject(LanguagePersistenceService);
    transloco = TestBed.inject(TranslocoService);
    storage = TestBed.inject(StorageService) as unknown as StorageServiceStub;
    originalDocumentLanguage = document.documentElement.getAttribute('lang');
    document.documentElement.setAttribute('lang', 'en');
  });

  afterEach(() => {
    if (originalDocumentLanguage === null) {
      document.documentElement.removeAttribute('lang');
      return;
    }

    document.documentElement.setAttribute('lang', originalDocumentLanguage);
  });

  it('hydrates the active language from persisted storage', () => {
    storage.value = 'fr';

    service.initialize();

    expect(transloco.getActiveLang()).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('cleans up unsupported persisted language values', () => {
    storage.value = 'jp';

    service.initialize();

    expect(storage.removeCalls).toEqual([STORAGE_KEYS.language]);
    expect(transloco.getActiveLang()).toBe(APP_DEFAULT_LANGUAGE.code);
  });

  it('does not persist before initialization', () => {
    expect(storage.setCalls.length).toBe(0);
  });

  it('persists language changes after initialization', () => {
    service.initialize();
    const initialPersistCallCount = storage.setCalls.length;

    transloco.setActiveLang('de');
    TestBed.flushEffects();

    expect(storage.setCalls.length).toBe(initialPersistCallCount + 1);
    expect(storage.setCalls.at(-1)).toEqual({
      key: STORAGE_KEYS.language,
      value: 'de',
    });
    expect(document.documentElement.lang).toBe('de');
  });
});
