jekyll build
http-server -p 4000 _site &
PID=$!
wdio test/wdio.travis.js
kill $PID
