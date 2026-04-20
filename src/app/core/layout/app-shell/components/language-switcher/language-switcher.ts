import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
  APP_DEFAULT_LANGUAGE,
  APP_LANGUAGE_OPTIONS,
  type AppLanguageCode,
} from '../../../../i18n/language-options';

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TranslocoDirective],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly transloco = inject(TranslocoService);

  readonly activeLang = this.transloco.activeLang;

  private readonly availableLanguageIds = new Set(
    this.transloco
      .getAvailableLangs()
      .map((lang) => (typeof lang === 'string' ? lang : lang.id)),
  );

  readonly languages = computed(() => {
    const supported = APP_LANGUAGE_OPTIONS.filter((language) =>
      this.availableLanguageIds.has(language.code),
    );
    return supported.length > 0 ? supported : APP_LANGUAGE_OPTIONS;
  });

  readonly currentLanguage = computed(() => {
    const active = this.activeLang();
    return this.languages().find((language) => language.code === active) ?? APP_DEFAULT_LANGUAGE;
  });

  setLanguage(code: AppLanguageCode): void {
    if (code === this.activeLang()) {
      return;
    }

    this.transloco.setActiveLang(code);
  }
}
