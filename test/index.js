'use strict';

const { setFlagsFromString } = require('v8');

setFlagsFromString('--max-old-space-size=4096');

// YOLO
process.setMaxListeners(Infinity);
