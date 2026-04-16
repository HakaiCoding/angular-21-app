# Application Architecture

This project follows a feature-first structure with clear boundaries:

- `core/`: app-wide singleton concerns (providers, interceptors, i18n loader, global services, tokens)
- `features/`: business features, lazy-loadable by route (`home/` is the first feature slice)
- `shared/`: reusable UI building blocks and pure utilities used by multiple features

## Feature Slice Convention

Inside each feature:

- `pages/`: routed containers
- `components/`: presentational building blocks scoped to the feature
- `data-access/`: feature API integration and state orchestration

## Global Styles Convention

- `src/styles/themes/`: Angular Material theme configuration and palettes
- `src/styles/tokens/`: design tokens as SCSS maps/variables
- `src/styles/mixins/`: shared mixins and helpers
