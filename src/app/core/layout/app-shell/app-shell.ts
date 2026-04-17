import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageSwitcher } from './components/language-switcher/language-switcher';
import { NavMenu } from './components/nav-menu/nav-menu';

@Component({
  selector: 'app-app-shell',
  imports: [
    MatToolbarModule,
    RouterOutlet,
    TranslocoDirective,
    LanguageSwitcher,
    NavMenu,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {}
