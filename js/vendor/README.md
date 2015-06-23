# Vendor Scripts
This directory contains a `package.json` for fetching Node dependencies via
[npm], and a [Makefile](Makefile) with targets that either copy files from
specific module directories or "bundle" with [browserify] for use in browsers.

To build the dependencies, run:

```
make -B
```

[npm]: https://www.npmjs.com/
[browserify]: http://browserify.org/
