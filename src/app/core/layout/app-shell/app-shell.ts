import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageSwitcher } from './components/language-switcher/language-switcher';

@Component({
  selector: 'app-app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslocoDirective,
    LanguageSwitcher,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {}
