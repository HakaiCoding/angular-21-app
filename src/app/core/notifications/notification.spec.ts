import { TestBed } from '@angular/core/testing';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarDismiss,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject } from 'rxjs';
import { NOTIFICATION_CONFIG } from './tokens/notification-config';
import { NotificationService } from './notification';

interface SnackBarOpenCall {
  message: string;
  action: string | undefined;
  config: MatSnackBarConfig | undefined;
}

class MatSnackBarStub {
  readonly openCalls: SnackBarOpenCall[] = [];
  readonly dismissSubjects: Subject<MatSnackBarDismiss>[] = [];

  open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    this.openCalls.push({ message, action, config });
    const dismissed$ = new Subject<MatSnackBarDismiss>();
    this.dismissSubjects.push(dismissed$);

    return {
      afterDismissed: (): Observable<MatSnackBarDismiss> => dismissed$.asObservable(),
      dismiss: (): void => {
        dismissed$.next({ dismissedByAction: false });
        dismissed$.complete();
      },
    } as MatSnackBarRef<TextOnlySnackBar>;
  }

  dismiss(): void {
    const active = this.dismissSubjects[0];
    if (!active) {
      return;
    }

    active.next({ dismissedByAction: false });
    active.complete();
    this.dismissSubjects.shift();
  }
}

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: MatSnackBarStub;

  beforeEach(() => {
    snackBar = new MatSnackBarStub();

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {
          provide: MatSnackBar,
          useValue: snackBar,
        },
        {
          provide: TranslocoService,
          useValue: {
            translate: (key: string): string => {
              switch (key) {
                case 'errors.timeout':
                  return 'The request timed out.';
                case 'common.retry':
                  return 'Retry';
                default:
                  return key;
              }
            },
          },
        },
        {
          provide: NOTIFICATION_CONFIG,
          useValue: {
            durationByLevel: {
              success: 1111,
              info: 2222,
              warn: 3333,
              error: 4444,
            },
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
            politenessByLevel: {
              success: 'polite',
              info: 'polite',
              warn: 'assertive',
              error: 'assertive',
            },
            panelClassByLevel: {
              success: ['notif', 'notif-success'],
              info: ['notif', 'notif-info'],
              warn: ['notif', 'notif-warn'],
              error: ['notif', 'notif-error'],
            },
            persistWithoutActionDurationMs: 7777,
          },
        },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shows translated messages from translation keys', () => {
    service.warnKey('errors.timeout', { actionKey: 'common.retry' });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(snackBar.openCalls[0]).toEqual({
      message: 'The request timed out.',
      action: 'Retry',
      config: expect.objectContaining({
        duration: 3333,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
        panelClass: ['notif', 'notif-warn'],
      }),
    });
  });

  it('falls back to message when translation key is missing', () => {
    service.show({
      level: 'error',
      content: {
        kind: 'key',
        key: 'errors.dynamic',
        fallbackText: 'Backend returned an error',
      },
    });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(snackBar.openCalls[0].message).toBe('Backend returned an error');
  });

  it('dedupes notifications with the same dedupe key', () => {
    service.errorKey('errors.timeout', { dedupeKey: 'timeout:home', persist: true });
    service.errorKey('errors.timeout', { dedupeKey: 'timeout:home', persist: true });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(service.queue().length).toBe(0);
  });

  it('processes the queue after active snackbar is dismissed', () => {
    service.infoKey('errors.timeout', { persist: true, actionKey: 'common.retry' });
    service.success('Saved successfully');
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(service.queue().length).toBe(1);

    snackBar.dismiss();
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(2);
    expect(service.queue().length).toBe(0);
  });

  it('applies fallback duration when persist is true without action', () => {
    service.errorKey('errors.timeout', { persist: true });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(snackBar.openCalls[0].config?.duration).toBe(7777);
  });
});
