var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server);
const { CanData, CanPIDConfig } = require('./config/canConfig');
const { TrackStartFinishLines, GPSData, LapTimer } = require('./config/timerConfig');
const { GetGPSLocation } = require('./gps/gps');

// Config
const canChannel = 'vcan0';
const currentCar = 'honda';
const currentTrack = 'home';

/* -------------------- Socket setup -------------------- */
var channel = can.createRawChannel(canChannel, true);

app.use(express.static(__dirname + '/client'));

socketio.on('connection', function(client) {
  console.log('Client connected');
});

setInterval(() => {
  socketio.emit('CANBusMessage', CanData);
}, 100);

setInterval(() => {
  socketio.emit('LapTimer', LapTimer);
}, 1)

/* -------------------- Lap Timer -------------------- */
/* TODO: Setup layout
- For now, auto start timing. (lon run this will be controller by button)
- currentLap timer starts
- Now we keep checking the current GPS location to see when it'll match track start/finish line gps coordinates
  - then update lastLap with currentLap
  - then compare for bestLap & pbLap
  - do colours or something for these, flashing?
    - fyi, the lat/lon will need to span across the whole track. might be tricky
- The gps checking will need to vary left to right. Maybe best to get the left most and right most, then have something to calculate everything inbetween

TESTING
- Do it around the block
*/

GetGPSLocation();
LapTimer.startLap();

setInterval(() => {
  if (GPSData.lat === TrackStartFinishLines.home.lat && GPSData.lon === TrackStartFinishLines.home.lon) {
    LapTimer.finishLap();
    LapTimer.startLap();
  }
}, 100);


// Alson
// constantly check against gps.gpsData being changed
// IF so, then run x function to check if we're at finish line.
// IF so, then run LapTimer.finishLap()
// deep cloning

//const newGPSData = JSON.parse(JSON.stringify(GPSData));

// External button to stop timing:
// if (buttonClicked) {
//   clearInterval(intervalLapTimer);
// }


/* -------------------- Data conversion -------------------- */
function dataConversion() {
  if (currentCar === 'honda') {
    //CanData.tps = CanData.tps/2
  }

  if (currentCar === 'mazda') {
    CanData.tps = CanData.tps / 2;
    console.log('Conversion: ', CanData.tps);
  }
};


/* -------------------- Data acquisition -------------------- */
channel.addListener('onMessage', function(msg) {
  var currentConfig = CanPIDConfig[currentCar];

   for (var param in currentConfig) {
     var config = currentConfig[param];

     if (config.ids.includes(msg.id))
       CanData[param] = msg.data.readUIntBE(config.offset, config.size)
   }

   dataConversion();    
});


/* ------------------ OLD Data acquisition ------------------ */
/*
channel.addListener('onMessage', function(msg) {
  // Rpm, speed, gear, voltage
  if (msg.id === 660 || msg.id === 1632) {
    CanData.rpm = msg.data.readUIntBE(0, 2);
    CanData.speed = msg.data.readUIntBE(2, 2);
    CanData.gear = msg.data.readUIntBE(4, 1);
    CanData.voltage = msg.data.readUIntBE(5, 1);
  }
  
  // Temperates - IAT, ECT
  if (msg.id === 661 || msg.id === 1633) {
    CanData.iat = msg.data.readUIntBE(0, 2);
    CanData.ect = msg.data.readUIntBE(2, 2);
  }
  
  // TPS, MAP
  if (msg.id === 662 || msg.id === 1634) {
    CanData.tps = msg.data.readUIntBE(0, 2);
    CanData.map = msg.data.readUIntBE(2, 2);
  if (CanData.tps === 65535)
    CanData.tps = 0
 }

  // Injector duration, Ignition advance
  if (msg.id === 663 || msg.id === 1635) {
    CanData.inj = msg.data.readUIntBE(0, 2);
    CanData.ign = msg.data.readUIntBE(2, 2);
  }

  // Lambda Ratio, Lambda
  if (msg.id === 664 || msg.id === 1636) {
    CanData.lambdaRatio = msg.data.readUIntBE(0, 2);
    CanData.lambda = msg.data.readUIntBE(2, 2);
  }

  console.log(CanData);
});
*/

channel.start();
server.listen(3000);
