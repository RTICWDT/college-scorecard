#!/bin/sh
jekyll serve &
PID=$!
sleep 3 # this should be enough time for jekyll to spin up
npm run test${1}
kill -9 ${PID}
