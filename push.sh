#!/bin/sh

cf target -o ed -s staging
jekyll build --config _config.yml,_config_cf.yml
cf push college-choice
