#!/bin/bash

# test against different APIs based on the branch being built
if [ $CIRCLE_BRANCH ]; then
    branch=$CIRCLE_BRANCH

    if [ $branch == 'master' ]; then

        echo "[using the default (production) API]"

    elif [ $branch == 'staging' ]; then

        echo "[using the staging API]"
        API_BASE_URL=https://api.data.gov/TEST/ed/staging/v1/

    else

        # the assumption here is that all dev branches should
        # run against the dev API
        echo "[using the dev API]"
        API_BASE_URL=https://api.data.gov/TEST/ed/dev/v1/

    fi
fi

if [ $API_BASE_URL ]; then
    echo "building with API_BASE_URL=$API_BASE_URL ..."
fi

# build the site
bundle exec jekyll serve
