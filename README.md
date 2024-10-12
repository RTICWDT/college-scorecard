The [College Scorecard](https://github.com/rti-international/scorecard-website) using [Nuxt 3](https://nuxt.com/docs/getting-started/introduction).

The transition includes:
+ Vue2 to [Vue3](https://vuejs.org/)
+ Vuetify2 to [Vuetify3](https://vuetifyjs.com/en/introduction/why-vuetify/#what-is-vuetify3f)
+ Gridsome to [Nuxt3](https://nuxt.com/)
+ Options API to [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html#why-composition-api)
+ Vuex to [Pinia](https://pinia.vuejs.org/)

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

## Migration Notes

- nuxt needs to be at version 3.13.1 right now as 3.13.2 introduces a regression that breaks the nuxt-leaflet module. when 3.14 comes along we can upgrade, as it was confirmed a [fix is coming](https://github.com/nuxt-modules/leaflet/issues/80#issuecomment-2376746166)

## Migration Checklist

- [x] API
- [x] Store
- [ ] SEO / Meta tags
- [ ] Favicons
- [ ] Analytics
- [x] ChartJS Integration
- [x] Leaflet Integration
- [x] Vuetify Integration
- [x] SCSS Integration

- Layout
  - [x] Header
  - [x] Footer
  - [x] Data Subnav
  - [x] Search Subnav

- Pages (first pass):
  - [x] Home
  - [x] Search Schools
  - [x] View School
  - [ ] View Field of Study
  - [x] Search Fields of Study
  - [ ] Compare Schools
  - [ ] Compare Fields of Study
  - [x] Resources
  - [x] Data Download
  - [x] Data Documentation
  - [x] API Documentation
  - [x] Change Log
  - [x] Glossary
  - [ ] Compare Drawer

- Components
  - [ ] Transition Away Notice
  - [ ] Compare Drawer
  - [ ] Tooltip Styling
  - [ ] Google Charts Sankey Replacement
  
- QA Pass
  - [ ] Links / Downloads
  - [ ] Images
  - [ ] Routing
  - [ ] 404
  - [ ] Error Handling
  - [ ] Design Pass
  - [ ] SEO / Metatags
  - [ ] Analytics Events
  - [ ] Share Functionality
  - [ ] Fonts

- Nice-to-have
  - [ ] Search Optimization / Refactor
  - [ ] Compare store composable interface
  - [ ] design color consistency check & stylesheet
  - [ ] Typescript?