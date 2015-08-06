# the node_modules path
node_modules ?= ../../node_modules
# npm puts its binaries here
bin ?= $(node_modules)/.bin

css_path ?= ../../css/vendor

# list all of the vendor scripts that need to be copied or built here
# note: any *.min.js file that isn't distributed with its module can be built
# with UglifyJS in the `%.min.js` target
all: \
	aight.min.js \
	d3.min.js \
	formdb.min.js \
	leaflet.js \
	leaflet-css \
	async.min.js \
	querystring.min.js \
	tagalong.min.js

# install node modules
$(node_modules):
	npm install

# querystring is a Node.js built-in, but we can build it with browserify
querystring.js: $(node_modules)
	echo "window.querystring = require('querystring');" | $(bin)/browserify - > $@

# async
async.js: $(node_modules)
	cp $(node_modules)/async/lib/async.js $@

leaflet.js: $(node_modules)
	cp $(node_modules)/leaflet/dist/leaflet.js $@

leaflet-css:
	cp $(node_modules)/leaflet/dist/leaflet.css $(css_path)

pinpoint.js:
	curl https://raw.githubusercontent.com/dowjones/pinpoint/master/dist/pinpoint.js > $@

pinpoint-css:
	curl https://raw.githubusercontent.com/dowjones/pinpoint/master/dist/pinpoint.min.css > $(css_path)/pinpoint.css

# document-register-element is a lightweight custom elements polyfill
document-register-element.js: $(node_modules)
	cp $(node_modules)/document-register-element/build/document-register-element.max.js $@

# this handy target minifies any scripts that are either built using browserify
# or are distributed as un-minified browser builds
%.min.js: %.js
	$(bin)/uglifyjs $< > $@

# most node modules with browser-ready .js files will package these up in the
# root directory as module.js and/or module.min.js
%.js: $(node_modules)
	cp $(node_modules)/$(subst .min,,$(basename $@))/$@ $@
