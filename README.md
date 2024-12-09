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

## Preview Build
Start the development server on `http://localhost:3000`:

```bash
npm run build
npm run preview
```

## Deploy

Deploy app to the dev server:
```bash
npm run deploy:dev
```

Deploy app to the production server:
```bash
npm run deploy:prod
```

## Migration Notes

- nuxt needs to be at version 3.13.1 right now as 3.13.2 introduces a regression that breaks the nuxt-leaflet module. when 3.14 comes along we can upgrade, as it was confirmed a [fix is coming](https://github.com/nuxt-modules/leaflet/issues/80#issuecomment-2376746166)