'use strict';

// YOLO
process.setMaxListeners(Infinity);

if (process.env.APPVEYOR) {
  require('v8').setFlagsFromString('--max_old_space_size=4096');
}
