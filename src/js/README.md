# JavaScript

## Dependencies
We use [npm] to manage our JavaScript dependencies. To install them, run

```
npm install --dev
```

from the project root directory.

## Libraries
- [VueJS](https://vuejs.org/)
- [VuetifyJS](https://vuetifyjs.com)

## Build Process
We bundle our JavaScript with [Webpack](https://webpack.js.org/). The bundling process
combines all of the site's dependencies and page-specific code into a single script.

To build the JavaScript, you'll need to first install all of the [npm] dependencies with

```
npm install --dev
```

(Note: newer versions of Node may warn about the `--dev` option being deprecated; you can
safely ignore those.) Once the dependencies are finished installing, you can build the production bundle
with:

```
npm run build
```

**Please Note:** The production build process will split CSS files from the Javascript source,
Minify all output files and ensure that `VueJS` is compiled in production mode.  For local
development and debbuging, run `npm run build:dev`

You can also run `npm run watch` to have the JavaScript automatically bundled whenever the
source files change.

## Testing
We have both a nascent unit test suite and a more comprehensive suite of browser tests to
help us ensure that changes to the JavaScript don't introduce new bugs. See the
[testing docs](../test/#readme) for more information on running and updating the tests.
