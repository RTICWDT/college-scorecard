# npm puts its binaries here
bin ?= ./node_modules/.bin

# list all of the vendor scripts that need to be copied or built here
# note: any *.min.js file that isn't distributed with its module can be built
# with UglifyJS in the `%.min.js` target
all: \
	aight.min.js \
	d3.min.js \
	formdb.min.js \
	querystring.min.js \
	tagalong.min.js

# install node modules
node_modules:
	npm install

# querystring is a Node.js built-in, but we can build it with browserify
querystring.js: node_modules
	echo "window.querystring = require('querystring');" | $(bin)/browserify - > $@

# this handy target minifies any scripts that are either built using browserify
# or are distributed as un-minified browser builds
%.min.js: %.js
	uglifyjs $< > $@

# most node modules with browser-ready .js files will package these up in the
# root directory as module.js and/or module.min.js
%.js: node_modules
	cp node_modules/$(subst .min,,$(basename $@))/$@ $@
