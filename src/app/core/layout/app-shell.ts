import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

type AppLanguage = 'en' | 'fr' | 'de' | 'es' | 'it';

@Component({
  selector: 'app-shell',
  imports: [
    TranslocoDirective,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  readonly languages: readonly AppLanguage[] = ['en', 'fr', 'de', 'es', 'it'] as const;
  private readonly translocoService = inject(TranslocoService);

  readonly activeLang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });

  setLanguage(language: AppLanguage): void {
    if (this.activeLang() !== language) {
      this.translocoService.setActiveLang(language);
    }
  }
}
