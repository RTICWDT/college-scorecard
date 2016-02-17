#!/bin/bash

if [ "$CIRCLE_PROJECT_USERNAME" != "$CIRCLE_PR_USERNAME" ]; then
  echo "Origin mismatch: ${CIRCLE_PR_USERNAME}/${CIRCLE_PR_REPONAME}"
  echo
  echo "Automated browser tests are disabled for pull requests from forks."
  echo "Please merge this branch locally and test it before merging the "
  echo "associated pull request to ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}."
  echo
  exit 1
fi
