export type I18nKey = `${string}.${string}`;

export type UiCopy =
  | { kind: 'key'; key: I18nKey; params?: Readonly<Record<string, unknown>> }
  | { kind: 'text'; text: string };

export type StateViewMode = 'inline' | 'page';

export type StateActionVariant = 'text' | 'outlined' | 'filled';

export interface StateAction {
  id: string;
  label: UiCopy;
  variant?: StateActionVariant;
}
