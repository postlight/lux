Install-Product node $env:nodejs_version

# install lux dependencies
npm install

# build lux and globally npm link
npm run build
npm link

# install test-app dependencies
Set-Location C:\projects\lux\test\test-app
npm install
Set-Location C:\projects\lux
