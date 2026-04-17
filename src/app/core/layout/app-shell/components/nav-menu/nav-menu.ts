import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { APP_NAV_ITEMS } from '../../../../routing/nav-contract';

@Component({
  selector: 'app-nav-menu',
  imports: [MatButtonModule, RouterLink, RouterLinkActive, TranslocoDirective],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenu {
  readonly items = APP_NAV_ITEMS;
}
