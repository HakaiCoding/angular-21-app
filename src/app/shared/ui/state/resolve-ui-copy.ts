import { TranslocoService } from '@jsverse/transloco';
import type { UiCopy } from './types';

export const resolveUiCopy = (
  copy: UiCopy,
  transloco: TranslocoService,
): string => {
  if (copy.kind === 'text') {
    return copy.text;
  }

  return transloco.translate(copy.key, copy.params ?? {});
};
