# JavaScript

## Dependencies
We use [npm] to manage our JavaScript dependencies. To install them, run

```
npm install --dev
```

from the project root directory.

## Libraries
- We use a custom build of [D3] for client-side data management, DOM manipulation, and
  event handling. The custom build is generated with [Rollup], and keeps our bundles
  nice and slim.
- Client-side templating is currently handled by a pre-release version of [tagalong],
  which will eventually be upgraded. Tagalong allows us to keep all of the markup for
  dynamic elements in the HTML documents where they're used, rather than in external
  templates, and is more performant than brute-force `innerHTML` manipulation.

## Build Process
We bundle our JavaScript with [browserify](http://browserify.org/). The bundling process
combines all of the site's dependencies and page-specific code into a single script,
which is then minified with [UglifyJS] to make it smaller and faster.

To build the JavaScript, you'll need to first install all of the [npm] dependencies with

```
npm install --dev
```

(Note: newer versions of Node may warn about the `--dev` option being deprecated; you can
safely ignore those.) Once the dependencies are finished installing, you can build the
bundle with:

```
npm run build
```
  
You can also run `npm run watch` to have the JavaScript automatically bundled whenever the
source files change.

### Dealing with Merge Conflicts
While keeping minified JavaScript in git simplifies our deployment, it also inevitably
leads to merge conflicts when multiple branches modify any of the source scripts. If you
encounter a merge conflict, follow these steps:

1. Fix any merge conflicts in the source JavaScript
1. `npm run build` to rebuild the bundle
1. [Run the tests](../test/#readme) to ensure that the build works as expected
1. `git add js/picc.js*` to add the newly bundle script to the merge commit
1. `git commit` to complete the merge

We hope to address [this particular issue](https://github.com/RTICWDT/college-scorecard/issues/1455)
soon.

## Testing
We have both a nascent unit test suite and a more comprehensive suite of browser tests to
help us ensure that changes to the JavaScript don't introduce new bugs. See the
[testing docs](../test/#readme) for more information on running and updating the tests.

[D3]: http://d3js.org/
[npm]: https://www.npmjs.com/
[Rollup]: https://github.com/rollup/rollup
[tagalong]: http://shawnbot.github.io/tagalong/
[UglifyJS]: https://github.com/mishoo/UglifyJS
