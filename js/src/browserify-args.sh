#!/bin/sh
echo '-d -s picc -p [ minifyify --map picc.js.map --output js/picc.js.map --uglify [ --no-mangle ] ] -o js/picc.js js/src/picc.js -t babelify'
