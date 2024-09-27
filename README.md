An attempt at recreating the [College Scorecard](https://github.com/rti-international/scorecard-website) using [Nuxt 3](https://nuxt.com/docs/getting-started/introduction).

## Setup
Make sure to install the dependencies:
```bash
npm install
```

## Development Server
Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the static application for production:
```bash
npm run build
```

Locally preview production build:
```bash
npm run preview
```

## MIGRATION NOTES
- `vuex` -> `pinia` store migration
- `google-charts` is a 5-year-old library
- `vue2-leaflet` -> `vue-leaflet` vue3 compatible
- `override` in the old project, don't port them over
- `vuetify3` migration
- error page handling in nuxt