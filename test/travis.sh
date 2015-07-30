#!/bin/sh

# start the jekyll server and remember its pid
jekyll serve &
PID=$!

# this should be enough time for jekyll to spin up
sleep 3

if [ "$#" -ne 1 ]; then
    browsers=ie9
else
    browsers="$@"
fi

for browser in ${browsers}; do
    echo "testing ${browser}..."
    nightwatch --config ./test/nightwatch.js -e ${browser}
done

# kill the background jekyll server
kill -9 ${PID}
