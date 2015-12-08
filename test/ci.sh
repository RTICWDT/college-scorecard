bundle exec jekyll build
./node_modules/.bin/http-server -p 4000 _site &
wget --retry-connrefused --waitretry=1 -T 5 -t 30 http://localhost:4000 || exit 1
./node_modules/.bin/wdio test/wdio.ci.js
