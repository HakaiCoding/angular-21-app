import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ErrorStateComponent } from './error-state';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ErrorStateComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
          langs: {
            en: {
              common: {
                states: {
                  error: {
                    title: 'Error',
                  },
                },
              },
            },
          },
        }),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits action id when action is triggered', () => {
    const emitSpy = vi.spyOn(component.actionTriggered, 'emit');
    fixture.componentRef.setInput('action', {
      id: 'retry',
      label: { kind: 'text', text: 'Try again' },
    });

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(emitSpy).toHaveBeenCalledWith('retry');
  });
});
