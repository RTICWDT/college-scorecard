# College Scorecard

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

A website that allows students (high school and adult) and those who support them (parents, guidance counselors)
to not only search among colleges to find schools that would meet their desires, but also encourage them to consider
"value" factors, be exposed to schools with better outcomes, and allow users to compare and contrast schools across
different dimensions of "fit," highlighting "value" factors. The goal is to enable people to find schools that are
best suited to them, and ensure a broad and flexible definition of elements that contribute to "fit."

## Installation
College Scorecard now uses Gridsome, a Vue.js poweredJamstack framework for building static generated websites & apps. To 
### 1. Install Gridsome CLI tool if you don't have

`npm install --global @gridsome/cli`

### 2. Install Dependencies
`npm install` to install project dependencies

### 3. Launch the server
- Copy `.env.example` to `.env`
- Add values to `.env`
- `gridsome develop` to launch the College Scorecard website on a local development server

## Environment Variables
### Required Environment Variables
- `GRIDSOME_API_KEY`: The api key used to submit requests to Open Data Maker.  Authorization is
handled by [api.data.gov](https://api.data.gov). Sign up for a key at: 
[api.data.gov/signup/](https://api.data.gov/signup/)
- `GRIDSOME_API_URL`: The API base URL for Open Data Maker.

Typical .env file:

```
GRIDSOME_API_KEY=<API_KEY_HERE>
GRIDSOME_API_URL=https://api.data.gov/ed/collegescorecard/v1/
```

### Optional Environment Variables
The following environment variables should be set to ensure full functionality for all pages.
These configurations are not required to view the site locally but will ensure all items are working
as intended.

 - `GRIDSOME_API_SIGNUP_KEY`: API key for [api.data.gov](https://api.data.gov) used during the embedded
sign up form submission process (`data/documentation/#api-key-signup`). This key should be 
configured by following
[this documentation](https://api.data.gov/docs/agency-manual/#embedding-the-api-key-signup-form-on-your-own-documentation-site)
- `GRIDSOME_RECAPTCHA_KEY`: Key used during `V2 ReCaptcha` workflows.  See 
[documentation](https://developers.google.com/recaptcha/docs/display) for registration and
configuration information.
- `GRIDSOME_GOOGLE_MAPS_KEY`: API key for Google Static Maps functionality.  Refer to
[Google Maps Developer Documentation](https://developers.google.com/maps/documentation)
for configuration information.

Typical .env file:

```
export GRIDSOME_API_SIGNUP_KEY=<API_KEY_HERE>
export GRIDSOME_RECAPTCHA_KEY=<RECAPTCHA_API_KEY_HERE>
export GRIDSOME_GOOGLE_MAPS_KEY=<GOOGLE_MAPS_API_KEY_HERE>
```

## Front End Development

### Stylesheets
- We use [Sass] to generate our CSS.  Webpack is configured to translate standalone Sass files or styles within [VueJS Single File Components](https://vuejs.org/v2/guide/single-file-components.html)

### JavaScript
See the [JavaScript docs](js/#readme) for more information on our scripting tools and
workflows.

### Accessibility
- We adhere to [Web Content Accessibility Guidelines 2.0](https://www.w3.org/WAI/WCAG20/quickref/),
  level AA.
- We test the site's accessibility with [pa11y](http://pa11y.org/).
