import { Injectable, inject, signal } from '@angular/core';
import type { RuntimeConfig, RuntimeConfigOverride } from './models/runtime-config';
import { RUNTIME_CONFIG_DEFAULT, RUNTIME_CONFIG_URL } from './tokens/runtime-config';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

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
  if (!isObject(value)) {
    return null;
  }

  return value as RuntimeConfigOverride;
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
