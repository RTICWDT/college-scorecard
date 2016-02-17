#!/bin/bash

repo="${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}"

if [ -e "$CIRCLE_PR_USERNAME" ] && [ "$CIRCLE_PROJECT_USERNAME" != "$CIRCLE_PR_USERNAME" ]; then
  echo "This branch is on a fork: ${CIRCLE_PR_USERNAME}/${CIRCLE_PR_REPONAME}"
  echo
  echo "Automated browser tests are disabled for pull requests from forks."
  echo "Please merge this branch locally and test it before merging the "
  echo "associated pull request to ${repo}."
  echo
  exit 1
fi

if [ "$CIRCLE_BRANCH" == "master" ]; then
  url="https://collegescorecard.ed.gov"
elif [ "$CIRCLE_BRANCH" != "" ]; then
  url="https://federalist.18f.gov/preview/${repo}/${CIRCLE_BRANCH}"
else
  echo "no CIRCLE_BRANCH detected; testing locally"
  npm run test-ci
  exit $?
fi

echo "testing site URL: ${url}"

if [ "$CIRCLE_SHA1" != "" ]; then
  commit_url="${url}/commit.txt"

  echo "fetching Federalist commit data..."

  check_federalist_commit() {
    current_sha=`curl -s $commit_url`
    if [ "$current_sha" == "$CIRCLE_SHA1" ]; then
        echo "SHA1 match!"
        return 1
    else
        echo "current SHA1 '${current_sha}' != '${CIRCLE_SHA1}'"
        return 0
    fi
  }

  while check_federalist_commit; do
    echo "waiting for Federalist to build..."
    sleep 5
  done
fi

# pass the Federalist URL to the test runner
BROWSER_TEST_URL=$url npm run test-ci
