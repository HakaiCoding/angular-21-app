import { effect, inject, Injectable, signal } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';
import type { TranslationKey } from '../i18n/types';
import type {
  NotificationInput,
  NotificationKeyContent,
  NotificationKeyOptions,
  NotificationLevel,
  NotificationTextOptions,
} from './models/notification';
import { NOTIFICATION_CONFIG } from './tokens/notification-config';

const toTranslationKey = (value: string): TranslationKey => value as TranslationKey;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly config = inject(NOTIFICATION_CONFIG);

  readonly queue = signal<readonly NotificationInput[]>([]);
  readonly active = signal<NotificationInput | null>(null);

  private readonly queueProcessor = effect(() => {
    if (this.active()) {
      return;
    }

    const next = this.queue()[0];
    if (!next) {
      return;
    }

    this.queue.update((items) => items.slice(1));
    this.active.set(next);
    this.openNotification(next);
  });

  success(text: string, options: NotificationTextOptions = {}): void {
    this.show(this.buildTextInput('success', text, options));
  }

  successKey(key: TranslationKey, options: NotificationKeyOptions = {}): void {
    this.show(this.buildKeyInput('success', key, options));
  }

  info(text: string, options: NotificationTextOptions = {}): void {
    this.show(this.buildTextInput('info', text, options));
  }

  infoKey(key: TranslationKey, options: NotificationKeyOptions = {}): void {
    this.show(this.buildKeyInput('info', key, options));
  }

  warn(text: string, options: NotificationTextOptions = {}): void {
    this.show(this.buildTextInput('warn', text, options));
  }

  warnKey(key: TranslationKey, options: NotificationKeyOptions = {}): void {
    this.show(this.buildKeyInput('warn', key, options));
  }

  error(text: string, options: NotificationTextOptions = {}): void {
    this.show(this.buildTextInput('error', text, options));
  }

  errorKey(key: TranslationKey, options: NotificationKeyOptions = {}): void {
    this.show(this.buildKeyInput('error', key, options));
  }

  show(input: NotificationInput): void {
    const normalizedInput = this.normalizeInput(input);
    if (!normalizedInput) {
      return;
    }

    if (this.isDuplicate(normalizedInput.dedupeKey)) {
      return;
    }

    this.queue.update((items) => [...items, normalizedInput]);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }

  clearQueue(): void {
    this.queue.set([]);
  }

  private buildTextInput(
    level: NotificationLevel,
    text: string,
    options: NotificationTextOptions,
  ): NotificationInput {
    return {
      ...options,
      level,
      content: {
        kind: 'text',
        text,
      },
    };
  }

  private buildKeyInput(
    level: NotificationLevel,
    key: TranslationKey,
    options: NotificationKeyOptions,
  ): NotificationInput {
    const { params, fallbackText, ...rest } = options;
    return {
      ...rest,
      level,
      content: {
        kind: 'key',
        key,
        params,
        fallbackText,
      },
    };
  }

  private normalizeInput(input: NotificationInput): NotificationInput | null {
    if (input.content.kind === 'text') {
      const text = input.content.text.trim();
      if (!text) {
        return null;
      }

      return {
        ...input,
        content: {
          kind: 'text',
          text,
        },
      };
    }

    const key = input.content.key.trim();
    if (!key) {
      return null;
    }

    const content: NotificationKeyContent = {
      kind: 'key',
      key: toTranslationKey(key),
      params: input.content.params,
    };

    const fallbackText = input.content.fallbackText?.trim();
    if (fallbackText) {
      content.fallbackText = fallbackText;
    }

    return {
      ...input,
      content,
    };
  }

  private isDuplicate(dedupeKey: string | undefined): boolean {
    if (!dedupeKey) {
      return false;
    }

    if (this.active()?.dedupeKey === dedupeKey) {
      return true;
    }

    return this.queue().some((queued) => queued.dedupeKey === dedupeKey);
  }

  private openNotification(input: NotificationInput): void {
    const message = this.resolveMessage(input);
    if (!message) {
      this.active.set(null);
      return;
    }

    const hasAction = Boolean(input.actionKey);
    const duration = input.durationMs
      ?? (input.persist
        ? (hasAction ? undefined : this.config.persistWithoutActionDurationMs)
        : this.config.durationByLevel[input.level]);

    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: this.config.horizontalPosition,
      verticalPosition: this.config.verticalPosition,
      politeness: this.config.politenessByLevel[input.level],
      panelClass: [...this.config.panelClassByLevel[input.level]],
    };

    const action = input.actionKey
      ? this.transloco.translate(input.actionKey, input.actionParams ?? {})
      : undefined;

    const ref = this.snackBar.open(message, action, config);
    ref.afterDismissed().pipe(take(1)).subscribe(() => {
      this.active.set(null);
    });
  }

  private resolveMessage(input: NotificationInput): string {
    if (input.content.kind === 'text') {
      return input.content.text;
    }

    const translated = this.transloco.translate(
      input.content.key,
      input.content.params ?? {},
    );
    const translationMissing = translated === input.content.key;
    if (translationMissing && input.content.fallbackText) {
      return input.content.fallbackText;
    }

    return translated;
  }
}
