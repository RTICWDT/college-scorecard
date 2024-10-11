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

## TODO
- ~~`vuex` -> `pinia` store migration~~
- `google-charts` is a 5-year-old library used only for the sankey. lets use a different visualization (preferably from ChartJS)
- ~~`vue2-leaflet` -> `vue-leaflet` vue3 compatible~~
- `vuetify3` migration
  - ~~icons (both font awesome and vuetify)~~
  - fonts
  - ~~grid layout using v-container, v-row, v-col~~
  - ~~- no bootstrap~~

- error page handling in nuxt
- optimizing the search behavior on the app. consider storing the last done search to skip an API hit on returning. 



## MIGRATION NOTES

- nuxt needs to be at version 3.13.1 right now as 3.13.2 introduces a regression that breaks the nuxt-leaflet module. when 3.14 comes along we can upgrade, as it was confirmed a [fix is coming](https://github.com/nuxt-modules/leaflet/issues/80#issuecomment-2376746166)


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


