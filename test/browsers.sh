#!/bin/sh
# echo "testing environments: $@ ..."

envs=$@
if [ -z "${envs}" ]; then
    envs=default
fi

for env in ${envs}; do
    echo "* testing ${env}..."
    ./node_modules/.bin/nightwatch --config ./test/nightwatch.js -e ${env}
    if [ $? != 0 ]; then
        echo "*** failed: ${env}!"
        exit 1
    fi
done
