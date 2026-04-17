import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarDismiss, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from './notification';

interface SnackBarOpenCall {
  message: string;
  action: string | undefined;
}

class MatSnackBarStub {
  readonly openCalls: SnackBarOpenCall[] = [];
  readonly dismissSubjects: Subject<MatSnackBarDismiss>[] = [];

  open(message: string, action?: string): MatSnackBarRef<TextOnlySnackBar> {
    this.openCalls.push({ message, action });
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
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shows translated messages from translation keys', () => {
    service.warn('errors.timeout', { actionKey: 'common.retry' });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(snackBar.openCalls[0]).toEqual({
      message: 'The request timed out.',
      action: 'Retry',
    });
  });

  it('falls back to message when translation key is missing', () => {
    service.show({
      level: 'error',
      messageKey: 'errors.dynamic',
      message: 'Backend returned an error',
    });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(snackBar.openCalls[0].message).toBe('Backend returned an error');
  });

  it('dedupes notifications with the same dedupe key', () => {
    service.error('errors.timeout', { dedupeKey: 'timeout:home', persist: true });
    service.error('errors.timeout', { dedupeKey: 'timeout:home', persist: true });
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(service.queue().length).toBe(0);
  });

  it('processes the queue after active snackbar is dismissed', () => {
    service.info('errors.timeout', { persist: true });
    service.success('Saved successfully');
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(1);
    expect(service.queue().length).toBe(1);

    snackBar.dismiss();
    TestBed.flushEffects();

    expect(snackBar.openCalls.length).toBe(2);
    expect(service.queue().length).toBe(0);
  });
});
