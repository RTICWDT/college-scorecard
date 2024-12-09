The College Scorecard transition project away from the [Gridsome Project](https://github.com/rti-international/scorecard-website)

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

## Compare Notes


1. check parameters -- load schools and fields of study from this list first
2. if no parameters -- load from compare store

3. if parameters loaded in && they don't match store values: alert user to them viewing a shared comparison and ask them to update the store (aka 'their list')





## Migration Checklist

- [x] API
- [x] Stores
- [x] SEO / Meta tags
- [x] Favicons
- [x] Analytics
- [x] ChartJS Integration
- [x] Leaflet Integration
- [x] Vuetify 3 Integration
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
  - [x] View Field of Study
  - [x] Search Fields of Study
  - [x] Compare Schools
  - [x] Compare Fields of Study
  - [x] Resources
  - [x] Data Download
  - [x] Data Documentation
  - [x] API Documentation
  - [x] Change Log
  - [x] Glossary
  - [x] Compare Drawer

- Components
  - [x] Transition Away Notice
  - [x] Compare Drawer
  - [x] Tooltip Styling
  - [x] Google Charts Sankey Replacement
  
- QA Pass
  - [x] Links / Downloads
  - [x] Images
  - [x] Routing
  - [x] 404
  - [x] Error Handling
  - [x] Design Pass
  - [x] SEO / Metatags
  - [x] Analytics Events
  - [x] Share Functionality
  - [x] Fonts

- Bugs
  - [x] /school params need to set the state of the page properly
  - [x] link from compare drawer to field of study needs to function