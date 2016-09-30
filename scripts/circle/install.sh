#!/bin/bash -e
rm -rf node_modules
npm install
npm link

cd test/test-app
rm -rf node_modules
npm install
cd ../../
