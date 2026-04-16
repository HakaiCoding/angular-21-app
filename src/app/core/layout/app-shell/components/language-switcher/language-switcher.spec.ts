import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';

import { APP_AVAILABLE_LANGUAGE_CODES, APP_DEFAULT_LANGUAGE } from '../../../../i18n/language-options';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;
  let fixture: ComponentFixture<LanguageSwitcher>;
  let transloco: TranslocoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcher,
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: APP_AVAILABLE_LANGUAGE_CODES,
            defaultLang: APP_DEFAULT_LANGUAGE.code,
          },
          langs: Object.fromEntries(
            APP_AVAILABLE_LANGUAGE_CODES.map((code) => [
              code,
              {
                shell: {
                  languageSwitcher: {
                    triggerAriaLabel: 'Change language. Current: {{ language }}',
                  },
                },
              },
            ]),
          ),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    transloco = TestBed.inject(TranslocoService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch active language', () => {
    component.setLanguage('fr');
    expect(transloco.getActiveLang()).toBe('fr');
  });
});
