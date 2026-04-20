import type { TranslationKey } from '../../../core/i18n/types';

export type UiCopy =
  | { kind: 'key'; key: TranslationKey; params?: Readonly<Record<string, unknown>> }
  | { kind: 'text'; text: string };

export type StateViewMode = 'inline' | 'page';

export type StateActionVariant = 'text' | 'outlined' | 'filled';

export interface StateAction {
  id: string;
  label: UiCopy;
  variant?: StateActionVariant;
}
