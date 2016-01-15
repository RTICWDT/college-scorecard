# test against different APIs based on the branch being built
if [ $CIRCLE_BRANCH ]; then
    if [ $branch = 'master' ]; then

        echo "[using the default (production) API]"

    elif [ $branch = 'staging' ]; then

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
bundle exec jekyll build

# serve it up statically, in the background
./node_modules/.bin/http-server -p 4000 _site &
pid=$!

# wait for the http server to start
wget --retry-connrefused --waitretry=1 -T 5 -t 30 -qO- http://localhost:4000 > /dev/null || exit 1

# and run the tests
./node_modules/.bin/wdio test/wdio.ci.js || (kill -9 $pid; exit 1)
