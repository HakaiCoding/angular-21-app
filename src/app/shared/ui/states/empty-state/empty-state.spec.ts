import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmptyStateComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
          langs: {
            en: {
              common: {
                states: {
                  empty: {
                    title: 'No data',
                  },
                },
              },
            },
          },
        }),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits action id when action is triggered', () => {
    const emitSpy = vi.spyOn(component.actionTriggered, 'emit');
    fixture.componentRef.setInput('action', {
      id: 'reload',
      label: { kind: 'text', text: 'Reload' },
    });

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(emitSpy).toHaveBeenCalledWith('reload');
  });
});
