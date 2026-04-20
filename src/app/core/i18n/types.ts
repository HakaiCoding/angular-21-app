export type TranslationKey = `${string}.${string}`;

const TRANSLATION_KEY_PATTERN = /^[a-z0-9]+(?:[A-Z][a-z0-9]*)?(?:\.[a-z0-9]+(?:[A-Z][a-z0-9]*)?)+$/i;

export const isTranslationKey = (value: string): value is TranslationKey =>
  TRANSLATION_KEY_PATTERN.test(value.trim());

export const toTranslationKey = (value: string): TranslationKey | null => {
  const normalized = value.trim();
  return isTranslationKey(normalized) ? normalized : null;
};
