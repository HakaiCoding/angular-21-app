import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { resolveUiCopy } from '../../state/resolve-ui-copy';
import type { StateAction, StateActionVariant, StateViewMode, UiCopy } from '../../state/types';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  private readonly transloco = inject(TranslocoService);

  readonly title = input<UiCopy>({
    kind: 'key',
    key: 'common.states.empty.title',
  });
  readonly description = input<UiCopy | null>(null);
  readonly mode = input<StateViewMode>('inline');
  readonly action = input<StateAction | null>(null);

  readonly actionTriggered = output<string>();

  readonly titleText = computed(() =>
    resolveUiCopy(this.title(), this.transloco),
  );

  readonly descriptionText = computed(() => {
    const description = this.description();
    return description ? resolveUiCopy(description, this.transloco) : null;
  });

  readonly actionLabelText = computed(() => {
    const action = this.action();
    return action ? resolveUiCopy(action.label, this.transloco) : null;
  });

  readonly actionVariant = computed<StateActionVariant>(() => {
    const action = this.action();
    return action?.variant ?? 'outlined';
  });

  triggerAction(): void {
    const action = this.action();
    if (!action) {
      return;
    }

    this.actionTriggered.emit(action.id);
  }

}
