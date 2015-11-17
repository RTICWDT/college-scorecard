bundle exec jekyll build
./node_modules/.bin/http-server -p 4000 _site &
PID=$!
./node_modules/.bin/wdio test/wdio.travis.js
kill $PID
