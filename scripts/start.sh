#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="apple_tree"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT

npm i
pm2 delete $APP_NAME
pm2 start npm --name $APP_NAME -- start

echo "$TIME_NOW > Deploy has been completed"