import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-nav-menu',
  imports: [MatButtonModule, RouterLink, RouterLinkActive, TranslocoDirective],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenu {}
