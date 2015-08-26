# Frontend Tests

This directory contains Node.js scripts that run under [Nightwatch],
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

1. The requisite JavaScript dependencies, including [Nightwatch] and
   [PhantomJS]:

    ```sh
    npm install --dev
    ```

## Local Testing

For local testing you'll need [Selenium Server][Selenium Server]
(which, unfortunately, requires Java), which can be installed with
[webdriver-manager]:

```sh
# install the package
npm install -g webdriver-manager
# run the command line tool to install Selenium Server
webdriver-manager install
# start the server
webdriver-manager start
```

**Note**: Selenium Server runs in the foreground, which means that
you'll either have to background it explicitly or run it in a
separate shell from the other commands.

From here you can run the tests headlessly in [PhantomJS] with:

```sh
npm test
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
npm run test:sauce
# which just calls:
./test/runner.sh sauce
```


## The Test Runner

The `runner.sh` script called by `npm test` starts the Jekyll server
in the background, sleeps for a couple of seconds to let it start
up, then runs the function tests against one or more [Nightwatch]
environments, most of which correspond to different browsers in our
configuration.

By default (without any arguments), tests will be run against
[PhantomJS] running locally. You can provide one or more arguments
to run the tests on [Sauce Labs] against those browsers:

```sh
# PhantomJS locally
./test/runner.sh
# Chrome on Sauce Labs
./test/runner.sh sauce
# Chrome, IE9 and Firefox on Sauce Labs
./test/runner.sh chrome ie9 firefox
```

**Note:** If you're already running the Jekyll server (e.g. with
`jekyll serve -w` to develop the site) and want to run cross-browser
tests against your local machine with [Sauce Connect], then you can
instead run:

```sh
./test/browsers.sh chrome ie9 firefox
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
which [Nightwatch] needs to authenticate with Sauce Labs.

## Testing on Travis

On [Travis] we run cross-browser tests with:

```sh
npm run test:travis
```

The requests are tunneled through [Sauce Connect]. The list of
browsers to run against are listed in the [package.json](../package.json)'s
`test:travis` script directive.

[Nightwatch]: http://nightwatchjs.org/
[Node.js]: https://nodejs.org/
[PhantomJS]: http://phantomjs.org/
[Sauce Connect]: https://docs.saucelabs.com/reference/sauce-connect/
[Sauce Labs]: https://saucelabs.com/
[Selenium Server]: http://www.seleniumhq.org/download/
[Selenium WebDriver]: http://www.seleniumhq.org/docs/03_webdriver.jsp
[npm]: https://www.npmjs.org/
[sauceconnect-runner]: https://github.com/shawnbot/sauceconnect-runner
[webdriver-manager]: https://www.npmjs.com/package/webdriver-manager
[Travis]: https://travis-ci.org/
[export variables]: https://docs.saucelabs.com/tutorials/js-unit-testing/#exporting-credentials-on-mac-linux
