#!/bin/sh
# echo "testing environments: $@ ..."

envs=$@
if [ -z "${envs}" ]; then
    envs=default
fi

for env in ${envs}; do
    echo "* testing ${env}..."
    ./node_modules/.bin/nightwatch --config ./test/nightwatch.js -e ${env} || exit 1
done
