#!/bin/sh

# start the jekyll server and remember its pid
jekyll serve &
PID=$!

# this should be enough time for jekyll to spin up
sleep 3

./test/browsers.sh $@ || exit 1

# kill the background jekyll server
kill -9 ${PID} || echo "(Jekyll died before we could kill it.)"
