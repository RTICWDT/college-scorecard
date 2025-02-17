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

Run the app locally:
```bash
npm run dev
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

Deploy app to the staging server:
```bash
npm run deploy:staging
```

Deploy app to the production server:
```bash
npm run deploy:prod
```