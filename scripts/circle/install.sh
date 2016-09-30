#!/bin/bash -e
npm install
npm link

cd test/test-app
npm install
cd ../../
