# Tests
This directory contains scripts that test various aspects of the site:

1. [Unit tests](#unit-tests) ensure that our "core" JavaScript works
   the way we expect it to in isolation.
1. [Functional tests](#functional-tests) validate the behavior of the site in
   real browsers.
1. [Accessibility tests](#accessibility-tests) ensure that our markup meets
   the industry standard Web Content Accessibility Guidelines.

**Note:** All of the commands in this guide should be run from the
root directory of this repo!


## Setting Up

In order to run the tests, you'll need:

1. [Node.js] and [npm], which you can install on OS X with:

    ```sh
    brew install node
    ```

1. The requisite JavaScript dependencies:

    ```sh
    npm install --dev
    ```


## Unit Tests
The `unit` directory contains unit tests for our core JavaScript functionality.
These tests are run with [Jest] like so, from the project root directory:

```sh
npm run test:unit
```


## Accessibility Tests
We use [pa11y] to ensure that the site meets [Web Content Accessibility
Guidelines 2.0][WCAG 2.0], level AA. To run the test suite, first start the
Jekyll server:

```sh
jekyll serve
# or:
bundle exec jekyll serve
```

Then run:

```sh
npm run test-a11y
```

The accessibility test runner is [a11y.js](a11y.js), and the pa11y
configuration lives in [pa11y.conf.js](pa11y.conf.js).


## Functional Tests
Our functional (browser) test suite uses [CodeceptJS], which in turn uses
[Puppeteer] to programmatically a local broswer instance.
These test suite files live in the `e2e` directory.


### Local E2E Testing
```sh
npm run test:e2e
```

### Testing on CircleCI
On [CircleCI] we run cross-browser tests with:

```sh
npm run test-ci
```

On the CI server, both the browser and accessibility tests are run against
public Federalist preview URLs.


You can test the CI behavior locally by setting certain combinations of
Circle-specific [environment
variables](https://circleci.com/docs/environment-variables) then running the
`test/ci.sh` script:

```sh
# without any environment variables, this will just output http://localhost:4000
./test/ci.sh

# outputs the production URL, no fork warning
export CIRCLE_BRANCH=master
./test/ci.sh

# outputs the Federalist preview URL, no fork warning
export CIRCLE_PROJECT_USERNAME=18F
export CIRCLE_PROJECT_REPONAME=college-choice
export CIRCLE_BRANCH=ci-serverless
./test/ci.sh

# test the fork warning
export CIRCLE_PR_USERNAME=shawnbot
export CIRCLE_PR_REPONAME=college-choice
./test/ci.sh
```

If you were to run any of the browser tests at this point, they will exit early
and output a warning to stderr:

```
exiting from forked branch
```

You'll need to `unset CIRCLE_PR_USERNAME` before you can run the tests again,
since that env var short-circuits both the browser and a11y tests. You can then
set `CIRCLE_SHA1` to test the Federalist wait behavior:

```sh
unset CIRCLE_PR_USERNAME CIRCLE_PR_REPONAME
export CIRCLE_SHA1=$(curl -s $(node test/url.js)/commit.txt)
./test/ci.sh
```

See the [circle.yml](circle.yml) for more info on the order in which tests are
run.

[Node.js]: https://nodejs.org/
[npm]: https://www.npmjs.org/
[CircleCI]: https://circleci.com/
[export variables]: https://docs.saucelabs.com/tutorials/js-unit-testing/#exporting-credentials-on-mac-linux
[pa11y]: http://pa11y.org/
[WCAG 2.0]: https://www.w3.org/WAI/WCAG20/quickref/
[Jest]: https://jestjs.io/
[CodeceptJS]: https://codecept.io/
[Puppeteer]: https://github.com/GoogleChrome/puppeteer