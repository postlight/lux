#!/bin/bash -e
set -x
set -e

cd ../

# Install Watchman
if [ -d watchman ]; then
  cd watchman
  sudo make install
else
  git clone https://github.com/facebook/watchman.git
  cd watchman
  git checkout v4.7.0

  ./autogen.sh
  ./configure
  make
  sudo make install
fi

cd ../lux

# Install Node Modules
rm -rf node_modules
npm install
npm link

cd test/test-app
rm -rf node_modules
npm install
cd ../../
