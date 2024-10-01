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
  - TODO: Learn how the vue store is used
- `google-charts` is a 5-year-old library
- `vue2-leaflet` -> `vue-leaflet` vue3 compatible
- `vuetify3` migration
  - asset pipeline looking good so far
    - icons (both font awesome and vuetify)
    - fonts
    - grid layout using v-container, v-row, v-col
    - 
- 
- error page handling in nuxt
- We're going to try and only use vuetify, no bootstrap

## CHECKLIST

- [ ] API
- [ ] Store
- [ ] SEO / Meta tags
- [ ] Favicons
- [ ] Analytics
- Pages:
  - [ ] Home
  - [ ] Search Schools
  - [ ] View School
  - [ ] Search Fields of Study
  - [ ] Compare Schools
  - [ ] Compare Fields of Study
  - [x] Resources
  - [ ] Data Download
  - [ ] Data Documentation
  - [ ] API Documentation
  - [ ] Change Log
  - [ ] Glossary


