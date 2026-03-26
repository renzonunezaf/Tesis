# Enara Health — Patient Retention Intelligence Dashboard

> MVP prototype for a machine-learning-powered patient dropout prediction system.

## Architecture

```
enara-dashboard/
├── index.html              Single-page application shell
├── README.md
├── assets/
│   └── img/                Static images (logos, favicons, etc.)
├── css/
│   ├── tokens.css          Design tokens (colors, spacing, typography)
│   ├── base.css            Reset & body styles
│   ├── layout.css          Sidebar, topbar, main container, responsive
│   ├── components.css      Badges, buttons, table, form controls
│   ├── utilities.css       Animation helpers, fade-in, sr-only
│   ├── kpi.css             KPI card ring gauges
│   ├── dashboard.css       Operations view panels
│   ├── drawer.css          Slide-in patient detail panel
│   ├── analytics.css       Risk Insights charts
│   ├── fairness.css        Fairness Review + state popup
│   ├── profile.css         Patient Profile view
│   ├── log.css             Intervention Log view
│   └── model-performance.css
└── js/
    ├── data/               Data layer (mock — replace with API calls)
    │   ├── patients.js       Patient roster + KPI + config constants
    │   ├── patients-extended.js  Weight history, appointments, engagement
    │   ├── fairness.js       Fairness subgroup metrics + region config
    │   └── us-map.js         Real US SVG paths (amCharts CC-BY-NC 4.0)
    ├── api.js              Service layer — Promise-based data access
    ├── kpi.js              KPI card renderer
    ├── table.js            Patient table with sort + touch support
    ├── filters.js          Search + dropdown filter bindings
    ├── drawer.js           SHAP explanation drawer + tornado chart
    ├── charts.js           Dashboard trend + distribution charts
    ├── analytics.js        Risk Insights multi-chart view
    ├── fairness.js         Fairness Review + US map + state popup
    ├── profile.js          Patient Profile view
    ├── log.js              Intervention Log view
    ├── model-performance.js  Model comparison, ROC, confusion matrix
    ├── views.js            SPA view switching + animation resets
    └── app.js              Entry point — initialization + sidebar toggle
```

## Backend Integration

All data access is routed through `js/api.js`. Each method currently returns
mock data wrapped in a `Promise.resolve()`. To connect a real backend:

1. Update `EnaraApp.api.BASE_URL` with the API endpoint
2. Replace each method body with a `fetch()` call
3. Remove or keep `js/data/` files as fallback

## Design Tokens

All colors, spacing, and typography are defined as CSS custom properties
in `css/tokens.css`. No hardcoded hex values exist outside of that file
and the SVG map data.

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| >1024px | Full layout — fixed sidebar |
| ≤1024px | Narrower sidebar, hidden topbar meta |
| ≤768px  | Hamburger menu, slide-in sidebar, single-column |
| ≤480px  | Minimal padding, hidden avatar, single KPI column |

## Credits

- **SVG Map Data**: [amCharts](https://www.amcharts.com/svg-maps/) (CC-BY-NC 4.0)
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts
- **Logo**: Enara Health (used with permission for academic thesis)
