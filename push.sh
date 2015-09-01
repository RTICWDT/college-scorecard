#!/bin/sh

: ${API_KEY?"The API_KEY environment variable needs to be set."}
: ${API_BASE_URL?"The API_BASE_URL environment variable needs to be set."}
cf target -o ed -s production
jekyll build --config _config.yml,_config_cf.yml
cf push college-choice
