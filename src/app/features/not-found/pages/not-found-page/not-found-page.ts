import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { APP_ROUTE_LINKS } from '../../../../core/routing/route-contract';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, TranslocoDirective],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {
  readonly homeLink = APP_ROUTE_LINKS.home;
}
