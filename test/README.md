# Frontend Tests

This directory contains Node.js scripts that run under [WebDriverIO],
which in turn uses [Selenium WebDriver] to programmatically control
both local and remote browsers (in our case, running on [Sauce
Labs]) and run functional tests against them.

**Note:** All of the commands in this guide should be run from the
root directory of this repo!

## Setting Up

In order to run the tests, you'll need...

1. [Node.js] and [npm], which you can install on OS X with:

    ```sh
    brew install node
    ```

1. The requisite JavaScript dependencies, including [WebDriverIO]:

    ```sh
    npm install
    ```

## Local Testing

For local testing you'll need [Selenium Server][Selenium Server]
(which, unfortunately, requires Java), which can be installed with
[webdriver-manager]:

```sh
# install java
brew cask install java
# install the package
npm install -g webdriver-manager
# run the command line tool to install Selenium Server
webdriver-manager update
# start the server
webdriver-manager start
```

**Note**: Selenium Server runs in the foreground, which means that
you'll either have to background it explicitly or run it in a
separate shell from the other commands.

The tests depend on fetching the site from `http://localhost:4000/` . The
simplest way of building the site and running the server in one go is with `jekyll serve`, which you should leave running in another shell:

```sh
bundle exec jekyll serve
```

Once the server is up, you can run the tests in Chrome with:

```sh
npm test
```

The complete test suite takes several minutes to run. You can exclude
the data count tests by running:

```sh
npm run test-quick
```

## Testing with Sauce Labs

For testing with [Sauce Labs] you'll need [Sauce Connect], which you
can get with [sauceconnect-runner]:

```sh
npm install -g sauceconnect-runner
```

Next, [export your credentials][export variables] and call `sc-run`:

```sh
export SAUCE_USERNAME=your-username-here
export SAUCE_ACCESS_KEY=your-access-key
sc-run
```

**Note**: Sauce Connect, just like Selenium Server, runs in the
foreground, so you'll either have to background it explicitly or run
it in a separate shell from the other commands.

Then you can run your tests on Sauce Labs with either of the
following commands:

```sh
npm run test-sauce
# which just calls:
wdio test/wdio.sauce.js
```

If the tests fail to run, check the output for an error like:

```
Error processing the server response:
Sauce Labs Authentication Error.
You used username 'username' and access key '...' to authenticate,
which are not valid Sauce Labs credentials.
```

If you see this, make sure that you've [exported][export variables]
your `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables,
which [WebDriverIO] needs to authenticate with Sauce Labs.

NOTE: By default, the data count tests are not run on Sauce. You can
enable them by replacing the reference to `./wdio.quick` with
`./wdio.conf` in `wdio.sauce.js`.

## Testing on CircleCI

On [CircleCI] we run cross-browser tests with:

```sh
npm run test-ci
```

The requests are tunneled through [Sauce Connect]. 

[WebDriverIO]: http://webdriver.io/
[Node.js]: https://nodejs.org/
[PhantomJS]: http://phantomjs.org/
[Sauce Connect]: https://docs.saucelabs.com/reference/sauce-connect/
[Sauce Labs]: https://saucelabs.com/
[Selenium Server]: http://www.seleniumhq.org/download/
[Selenium WebDriver]: http://www.seleniumhq.org/docs/03_webdriver.jsp
[npm]: https://www.npmjs.org/
[sauceconnect-runner]: https://github.com/shawnbot/sauceconnect-runner
[webdriver-manager]: https://www.npmjs.com/package/webdriver-manager
[CircleCI]: https://circleci.com/
[export variables]: https://docs.saucelabs.com/tutorials/js-unit-testing/#exporting-credentials-on-mac-linux
