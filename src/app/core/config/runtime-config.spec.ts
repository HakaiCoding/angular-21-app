import { TestBed } from '@angular/core/testing';
import type { RuntimeConfig } from './models/runtime-config';
import { RuntimeConfigService } from './runtime-config';
import { RUNTIME_CONFIG_DEFAULT, RUNTIME_CONFIG_URL } from './tokens/runtime-config';

describe('RuntimeConfigService', () => {
  const defaults: RuntimeConfig = {
    api: {
      baseUrl: 'https://api.example.com',
      requestTimeoutMs: 5000,
      retryCount: 2,
      retryDelayMs: 300,
      enableAuthHeader: false,
    },
    logging: {
      level: 'info',
    },
    notifications: {
      durationByLevel: {
        success: 3000,
        info: 3500,
        warn: 5000,
        error: 7000,
      },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politenessByLevel: {
        success: 'polite',
        info: 'polite',
        warn: 'assertive',
        error: 'assertive',
      },
      panelClassByLevel: {
        success: ['notif', 'notif-success'],
        info: ['notif', 'notif-info'],
        warn: ['notif', 'notif-warn'],
        error: ['notif', 'notif-error'],
      },
      persistWithoutActionDurationMs: 10000,
    },
  };

  let service: RuntimeConfigService;

  beforeEach(() => {
    vi.restoreAllMocks();

    TestBed.configureTestingModule({
      providers: [
        RuntimeConfigService,
        {
          provide: RUNTIME_CONFIG_DEFAULT,
          useValue: defaults,
        },
        {
          provide: RUNTIME_CONFIG_URL,
          useValue: '/assets/app-config.json',
        },
      ],
    });

    service = TestBed.inject(RuntimeConfigService);
  });

  it('keeps default config when runtime config does not exist', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 404 }),
    );

    await service.load();

    expect(service.config()).toEqual(defaults);
  });

  it('merges runtime override with defaults', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          api: {
            baseUrl: 'https://api.runtime.example.com',
            requestTimeoutMs: 8000,
          },
          logging: {
            level: 'debug',
          },
          notifications: {
            durationByLevel: {
              error: 9000,
            },
            horizontalPosition: 'left',
          },
        }),
        { status: 200 },
      ),
    );

    await service.load();

    expect(service.config()).toEqual({
      ...defaults,
      api: {
        ...defaults.api,
        baseUrl: 'https://api.runtime.example.com',
        requestTimeoutMs: 8000,
      },
      logging: {
        level: 'debug',
      },
      notifications: {
        ...defaults.notifications,
        durationByLevel: {
          ...defaults.notifications.durationByLevel,
          error: 9000,
        },
        horizontalPosition: 'left',
      },
    });
  });

  it('ignores invalid runtime config payloads and keeps defaults', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify('invalid'), { status: 200 }),
    );

    await service.load();

    expect(service.config()).toEqual(defaults);
    expect(warn).toHaveBeenCalledWith(
      'Runtime config payload is invalid and will be ignored',
      {
        url: '/assets/app-config.json',
      },
    );
  });

  it('merges only valid runtime override fields', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          api: {
            baseUrl: 'https://api.runtime.example.com',
            requestTimeoutMs: 'slow',
            retryCount: -1,
            retryDelayMs: 700,
            enableAuthHeader: true,
          },
          logging: {
            level: 'trace',
          },
          notifications: {
            durationByLevel: {
              error: 9000,
              warn: 'slow',
            },
            horizontalPosition: 'middle',
            verticalPosition: 'bottom',
            politenessByLevel: {
              success: 'off',
              info: 'loud',
            },
            panelClassByLevel: {
              success: ['notif', 'notif-custom-success'],
              warn: [42],
            },
            persistWithoutActionDurationMs: 12000,
          },
        }),
        { status: 200 },
      ),
    );

    await service.load();

    expect(service.config()).toEqual({
      ...defaults,
      api: {
        ...defaults.api,
        baseUrl: 'https://api.runtime.example.com',
        retryDelayMs: 700,
        enableAuthHeader: true,
      },
      logging: {
        ...defaults.logging,
      },
      notifications: {
        ...defaults.notifications,
        durationByLevel: {
          ...defaults.notifications.durationByLevel,
          error: 9000,
        },
        verticalPosition: 'bottom',
        politenessByLevel: {
          ...defaults.notifications.politenessByLevel,
          success: 'off',
        },
        panelClassByLevel: {
          ...defaults.notifications.panelClassByLevel,
          success: ['notif', 'notif-custom-success'],
        },
        persistWithoutActionDurationMs: 12000,
      },
    });
  });
});
