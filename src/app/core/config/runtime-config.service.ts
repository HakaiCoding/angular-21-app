import { Injectable, inject, signal } from '@angular/core';
import type { RuntimeConfig, RuntimeConfigOverride } from './models/runtime-config';
import { LOG_LEVELS } from '../logging/models/logging-config';
import {
  NOTIFICATION_HORIZONTAL_POSITIONS,
  NOTIFICATION_POLITENESS_VALUES,
  NOTIFICATION_VERTICAL_POSITIONS,
} from '../notifications/models/notification-config';
import { NOTIFICATION_LEVELS } from '../notifications/models/notification';
import { RUNTIME_CONFIG_DEFAULT, RUNTIME_CONFIG_URL } from './tokens/runtime-config';

type NotificationOverride = NonNullable<RuntimeConfigOverride['notifications']>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasEntries = (value: object): boolean => Object.keys(value).length > 0;

const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

const isOneOf = <T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] => isString(value) && allowed.includes(value);

const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const toStringArray = (value: unknown): readonly string[] | null => {
  if (!Array.isArray(value) || !value.every((entry) => isString(entry))) {
    return null;
  }

  return value;
};

const parseApiOverride = (value: unknown): RuntimeConfigOverride['api'] | undefined => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return undefined;
  }

  const api: NonNullable<RuntimeConfigOverride['api']> = {};
  if (isNonEmptyString(record['baseUrl'])) {
    api.baseUrl = record['baseUrl'];
  }

  if (isPositiveInteger(record['requestTimeoutMs'])) {
    api.requestTimeoutMs = record['requestTimeoutMs'];
  }

  if (isNonNegativeInteger(record['retryCount'])) {
    api.retryCount = record['retryCount'];
  }

  if (isNonNegativeInteger(record['retryDelayMs'])) {
    api.retryDelayMs = record['retryDelayMs'];
  }

  if (isBoolean(record['enableAuthHeader'])) {
    api.enableAuthHeader = record['enableAuthHeader'];
  }

  return hasEntries(api) ? api : undefined;
};

const parseLoggingOverride = (value: unknown): RuntimeConfigOverride['logging'] | undefined => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return undefined;
  }

  const level = record['level'];
  if (!isOneOf(level, LOG_LEVELS)) {
    return undefined;
  }

  return { level };
};

const parseDurationByLevel = (value: unknown): NotificationOverride['durationByLevel'] | undefined => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return undefined;
  }

  const durations: NonNullable<NotificationOverride['durationByLevel']> = {};
  for (const level of NOTIFICATION_LEVELS) {
    const candidate = record[level];
    if (isPositiveInteger(candidate)) {
      durations[level] = candidate;
    }
  }

  return hasEntries(durations) ? durations : undefined;
};

const parsePolitenessByLevel = (
  value: unknown,
): NotificationOverride['politenessByLevel'] | undefined => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return undefined;
  }

  const politenessByLevel: NonNullable<NotificationOverride['politenessByLevel']> = {};
  for (const level of NOTIFICATION_LEVELS) {
    const candidate = record[level];
    if (isOneOf(candidate, NOTIFICATION_POLITENESS_VALUES)) {
      politenessByLevel[level] = candidate;
    }
  }

  return hasEntries(politenessByLevel) ? politenessByLevel : undefined;
};

const parsePanelClassByLevel = (
  value: unknown,
): NotificationOverride['panelClassByLevel'] | undefined => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return undefined;
  }

  const panelClassByLevel: NonNullable<NotificationOverride['panelClassByLevel']> = {};
  for (const level of NOTIFICATION_LEVELS) {
    const candidate = toStringArray(record[level]);
    if (candidate) {
      panelClassByLevel[level] = candidate;
    }
  }

  return hasEntries(panelClassByLevel) ? panelClassByLevel : undefined;
};

const parseNotificationsOverride = (
  value: unknown,
): RuntimeConfigOverride['notifications'] | undefined => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return undefined;
  }

  const notifications: NotificationOverride = {};
  const durationByLevel = parseDurationByLevel(record['durationByLevel']);
  if (durationByLevel) {
    notifications.durationByLevel = durationByLevel;
  }

  const horizontalPosition = record['horizontalPosition'];
  if (isOneOf(horizontalPosition, NOTIFICATION_HORIZONTAL_POSITIONS)) {
    notifications.horizontalPosition = horizontalPosition;
  }

  const verticalPosition = record['verticalPosition'];
  if (isOneOf(verticalPosition, NOTIFICATION_VERTICAL_POSITIONS)) {
    notifications.verticalPosition = verticalPosition;
  }

  const politenessByLevel = parsePolitenessByLevel(record['politenessByLevel']);
  if (politenessByLevel) {
    notifications.politenessByLevel = politenessByLevel;
  }

  const panelClassByLevel = parsePanelClassByLevel(record['panelClassByLevel']);
  if (panelClassByLevel) {
    notifications.panelClassByLevel = panelClassByLevel;
  }

  if (isPositiveInteger(record['persistWithoutActionDurationMs'])) {
    notifications.persistWithoutActionDurationMs = record['persistWithoutActionDurationMs'];
  }

  return hasEntries(notifications) ? notifications : undefined;
};

const mergeRuntimeConfig = (
  defaults: RuntimeConfig,
  override: RuntimeConfigOverride,
): RuntimeConfig => ({
  api: {
    ...defaults.api,
    ...override.api,
  },
  logging: {
    ...defaults.logging,
    ...override.logging,
  },
  notifications: {
    ...defaults.notifications,
    ...override.notifications,
    durationByLevel: {
      ...defaults.notifications.durationByLevel,
      ...override.notifications?.durationByLevel,
    },
    politenessByLevel: {
      ...defaults.notifications.politenessByLevel,
      ...override.notifications?.politenessByLevel,
    },
    panelClassByLevel: {
      ...defaults.notifications.panelClassByLevel,
      ...override.notifications?.panelClassByLevel,
    },
  },
});

const parseRuntimeConfig = (value: unknown): RuntimeConfigOverride | null => {
  const record = isRecord(value) ? value : null;
  if (!record) {
    return null;
  }

  const override: RuntimeConfigOverride = {};
  const api = parseApiOverride(record['api']);
  if (api) {
    override.api = api;
  }

  const logging = parseLoggingOverride(record['logging']);
  if (logging) {
    override.logging = logging;
  }

  const notifications = parseNotificationsOverride(record['notifications']);
  if (notifications) {
    override.notifications = notifications;
  }

  return hasEntries(override) ? override : null;
};

@Injectable({
  providedIn: 'root',
})
export class RuntimeConfigService {
  private readonly defaults = inject(RUNTIME_CONFIG_DEFAULT);
  private readonly configUrl = inject(RUNTIME_CONFIG_URL);

  private readonly configState = signal<RuntimeConfig>(this.defaults);
  readonly config = this.configState.asReadonly();

  async load(): Promise<void> {
    try {
      const response = await fetch(this.configUrl, { cache: 'no-store' });
      if (!response.ok) {
        if (response.status !== 404) {
          console.warn('Runtime config request failed', {
            status: response.status,
            url: this.configUrl,
          });
        }
        return;
      }

      const parsed = parseRuntimeConfig(await response.json());
      if (!parsed) {
        console.warn('Runtime config payload is invalid and will be ignored', {
          url: this.configUrl,
        });
        return;
      }

      this.configState.set(mergeRuntimeConfig(this.defaults, parsed));
    } catch (error) {
      console.warn('Runtime config load failed and defaults will be used', {
        url: this.configUrl,
        error,
      });
    }
  }
}
