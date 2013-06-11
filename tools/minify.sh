#!/bin/bash

cd `dirname $0`

# build app
../lib/enyo/tools/minify.sh package.js -output ../build/sundaydata -no-alias
