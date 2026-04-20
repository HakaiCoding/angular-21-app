import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LoggingService } from '../logging/logging.service';
import { STORAGE_KEYS } from '../storage/models/storage-schema';
import { StorageService } from '../storage/storage.service';
import { APP_AVAILABLE_LANGUAGE_CODES, type AppLanguageCode } from './language-options';

@Injectable({
  providedIn: 'root',
})
export class LanguagePersistenceService {
  private readonly transloco = inject(TranslocoService);
  private readonly storage = inject(StorageService);
  private readonly logger = inject(LoggingService);
  private readonly documentRef = inject(DOCUMENT, { optional: true });

  private readonly initialized = signal(false);
  private readonly supportedLanguages = new Set<string>(APP_AVAILABLE_LANGUAGE_CODES);

  private readonly persistActiveLanguage = effect(() => {
    if (!this.initialized()) {
      return;
    }

    const activeLanguage = this.transloco.activeLang();
    this.applyDocumentLanguage(activeLanguage);

    if (!this.isSupportedLanguage(activeLanguage)) {
      this.logger.warn('Skipping persistence for unsupported language', {
        feature: 'i18n',
        area: 'language-persistence',
        language: activeLanguage,
      });
      return;
    }

    const persisted = this.storage.set(STORAGE_KEYS.language, activeLanguage);
    if (!persisted) {
      this.logger.warn('Failed to persist active language', {
        feature: 'i18n',
        area: 'language-persistence',
        language: activeLanguage,
      });
    }
  });

  initialize(): void {
    const persistedLanguage = this.storage.get(STORAGE_KEYS.language);
    if (persistedLanguage) {
      if (!this.isSupportedLanguage(persistedLanguage)) {
        this.logger.warn('Removing unsupported persisted language', {
          feature: 'i18n',
          area: 'language-persistence',
          language: persistedLanguage,
        });
        this.storage.remove(STORAGE_KEYS.language);
      } else if (persistedLanguage !== this.transloco.getActiveLang()) {
        this.transloco.setActiveLang(persistedLanguage);
      }
    }

    this.applyDocumentLanguage(this.transloco.getActiveLang());
    this.initialized.set(true);
  }

  private isSupportedLanguage(language: string): language is AppLanguageCode {
    return this.supportedLanguages.has(language);
  }

  private applyDocumentLanguage(language: string): void {
    this.documentRef?.documentElement?.setAttribute('lang', language);
  }
}
