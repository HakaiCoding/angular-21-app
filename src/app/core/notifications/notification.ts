import { effect, inject, Injectable, signal } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';
import type { NotificationInput, NotificationLevel, NotificationOptions } from './models/notification';

const DEFAULT_DURATION_BY_LEVEL: Record<NotificationLevel, number> = {
  success: 3000,
  info: 3500,
  warn: 5000,
  error: 7000,
};

const DEFAULT_POLITENESS_BY_LEVEL: Record<NotificationLevel, NonNullable<MatSnackBarConfig['politeness']>> = {
  success: 'polite',
  info: 'polite',
  warn: 'assertive',
  error: 'assertive',
};

const TRANSLATION_KEY_PATTERN = /^[a-z0-9_-]+(?:\.[a-z0-9_-]+)+$/i;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

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

  success(keyOrText: string, options: NotificationOptions = {}): void {
    this.show(this.buildInput('success', keyOrText, options));
  }

  info(keyOrText: string, options: NotificationOptions = {}): void {
    this.show(this.buildInput('info', keyOrText, options));
  }

  warn(keyOrText: string, options: NotificationOptions = {}): void {
    this.show(this.buildInput('warn', keyOrText, options));
  }

  error(keyOrText: string, options: NotificationOptions = {}): void {
    this.show(this.buildInput('error', keyOrText, options));
  }

  show(input: NotificationInput): void {
    if (!input.messageKey && !input.message) {
      return;
    }

    if (this.isDuplicate(input.dedupeKey)) {
      return;
    }

    this.queue.update((items) => [...items, input]);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }

  clearQueue(): void {
    this.queue.set([]);
  }

  private buildInput(
    level: NotificationLevel,
    keyOrText: string,
    options: NotificationOptions,
  ): NotificationInput {
    const trimmedValue = keyOrText.trim();
    return TRANSLATION_KEY_PATTERN.test(trimmedValue)
      ? { level, messageKey: trimmedValue, ...options }
      : { level, message: trimmedValue, ...options };
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

    const config: MatSnackBarConfig = {
      duration: input.persist ? undefined : (input.durationMs ?? DEFAULT_DURATION_BY_LEVEL[input.level]),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: DEFAULT_POLITENESS_BY_LEVEL[input.level],
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
    if (!input.messageKey) {
      return input.message ?? '';
    }

    const translated = this.transloco.translate(input.messageKey, input.params ?? {});
    const translationMissing = translated === input.messageKey;
    if (translationMissing && input.message) {
      return input.message;
    }

    return translated;
  }
}
