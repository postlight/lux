#!/bin/bash -e

# install lux dependencies
npm install

# build lux and globally npm link
npm run build
npm link

# install test-app dependencies
cd test/test-app
npm install
cd ../../
