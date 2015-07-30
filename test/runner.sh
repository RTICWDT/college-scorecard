#!/bin/sh
echo "testing environments: $@ ..."

# start the jekyll server and remember its pid
jekyll serve &
PID=$!

# this should be enough time for jekyll to spin up
sleep 3

envs=$@
if [ -z "${envs}" ]; then
    envs=default
fi

for env in ${envs}; do
    echo "testing ${env}..."
    nightwatch --config ./test/nightwatch.js -e ${env}
done

# kill the background jekyll server
kill -9 ${PID}
