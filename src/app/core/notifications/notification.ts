import { effect, inject, Injectable, signal } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';
import type { NotificationInput, NotificationLevel, NotificationOptions } from './models/notification';
import { NOTIFICATION_CONFIG } from './tokens/notification-config';

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
    const { isMessageKey = false, ...rest } = options;
    const trimmedValue = keyOrText.trim();
    return isMessageKey
      ? { level, messageKey: trimmedValue, ...rest }
      : { level, message: trimmedValue, ...rest };
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
