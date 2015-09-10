#!/bin/sh

# start the jekyll server and remember its process id
bundle exec jekyll serve &
PID=$!

# this should be enough time for jekyll to spin up
sleep 10

./test/browsers.sh $@ || (kill -9 ${PID}; echo "FAILED"; exit 1)
STATUS=$?

# kill the background jekyll server
kill -9 ${PID} || echo "(Jekyll died before we could kill it.)"

exit $STATUS
