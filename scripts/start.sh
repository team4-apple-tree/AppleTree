#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="AppleTree"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT

pm2 delete $APP_NAME
pm2 start dist/main.js --name $APP_NAME

echo "$TIME_NOW > Deploy has been completed"