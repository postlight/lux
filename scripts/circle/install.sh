#!/bin/bash -e
set -x
set -e

# Install Watchman
if [ ! -e watchman version ]; then
  git clone https://github.com/facebook/watchman.git
  cd watchman
  git checkout v4.7.0

  ./autogen.sh
  ./configure
  make
  sudo make install

  which watchman
fi

# Install Node Modules
rm -rf node_modules
npm install
npm link

cd test/test-app
rm -rf node_modules
npm install
cd ../../
