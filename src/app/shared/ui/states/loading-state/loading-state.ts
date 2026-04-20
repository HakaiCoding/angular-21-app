import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoService } from '@jsverse/transloco';
import { resolveUiCopy } from '../../state/resolve-ui-copy';
import type { StateViewMode, UiCopy } from '../../state/types';

@Component({
  selector: 'app-loading-state',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  private readonly transloco = inject(TranslocoService);

  readonly title = input<UiCopy>({
    kind: 'key',
    key: 'common.states.loading.title',
  });
  readonly description = input<UiCopy | null>(null);
  readonly mode = input<StateViewMode>('inline');
  readonly spinnerDiameter = input(28);

  readonly titleText = computed(() =>
    resolveUiCopy(this.title(), this.transloco),
  );

  readonly descriptionText = computed(() => {
    const description = this.description();
    return description ? resolveUiCopy(description, this.transloco) : null;
  });
}
