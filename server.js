const fs = require('fs');
var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server);
const { CanData, CanPIDConfig } = require('./config/canConfig');
const { TrackStartFinishLines, GPSData, LapTiming } = require('./config/lapTimingConfig');
const { GetGPSLocation } = require('./gps/gps');

// Config
const serverConfig = {
  canChannel: 'vcan0',
  currentCar: 'honda',
  currentTrack: 'home',
  lapTiming: false,
  dataLogging: true
};

/* -------------------- Socket setup -------------------- */
//#region
var channel = can.createRawChannel(serverConfig.canChannel, true);

app.use(express.static(__dirname + '/client'));

socketio.on('connection', function(client) {
  console.log('Client connected');
});

setInterval(() => {
  socketio.emit('CANBusMessage', CanData);
}, 100);

if (serverConfig.lapTiming) {
  setInterval(() => {
    LapTiming.updateCurrentLap();
    socketio.emit('LapTiming', LapTiming.currentLap);
  }, 100);

  setInterval(() => {
    socketio.emit('LapStats', LapTiming.lastLap, LapTiming.bestLap, LapTiming.pbLap);
  }, 10000);
}
//#endregion

/* -------------------- Lap Timing -------------------- */
if (serverConfig.lapTiming) {
  //GetGPSLocation();
  LapTiming.startLap();

  /*
    - Very rough idea on how the comparison would work. Would need to put it into it's own class with a bunch of logic around the matching
    - I think we could have a field for each track where we know the 'quickest' possible lap time.
      - Don't do the GPS location check until we've gone past that quickest lap. i.e. 58 seconds @ Wakefield
  */

  // setInterval(() => {
  //   if (GPSData.lat === TrackStartFinishLines.home.lat && GPSData.lon === TrackStartFinishLines.home.lon) {
  //     LapTiming.finishLap();
  //     LapTiming.startLap();
  //     // Would we need to do LapTiming.updateCurrentLap() again instead of L31 ?
  //   }
  // }, 100);
}

/* -------------------- Data conversion -------------------- */
function DataConversion() {
  if (serverConfig.currentCar === 'honda') {
    if (CanData.tps === 65535)
      CanData.tps = 0
  }

  if (serverConfig.currentCar === 'mazda') {
    CanData.tps = CanData.tps / 2;
    console.log('Conversion: ', CanData.tps);
  }
};

/* -------------------- Data acquisition -------------------- */
var loggedData = {
  ect: 0,
  iat: 0,
  map: 0,
  oilTemp: 0,
  oilPressure: 0
}

function DataLogging(field, data) {
  var dataString = ''

  if (serverConfig.dataLogging) {
    if (data > loggedData[field])
      loggedData[field] = data;

    dataString = JSON.stringify(loggedData);
  // } else { // TODO: ONLY commented out to test read/write without the external button
    fs.writeFile('datalog.json', dataString, (err) => {
      if (err)
        console.error('Error writing to file:', err);
    });
  }
}

channel.addListener('onMessage', function(msg) {
  var currentConfig = CanPIDConfig[serverConfig.currentCar];

  for (var param in currentConfig) {
    var config = currentConfig[param];

    if (config.ids.includes(msg.id)) {
      CanData[param] = msg.data.readUIntBE(config.offset, config.size)

      // TODO: Commented out here to test ONLY writing to the file when clicking the 'stop datalogging button'
      // if (serverConfig.dataLogging) {
        DataLogging(param, CanData[param]);
      // }
    }
  }

  DataConversion();

  // Send data straight to UI
  // socketio.emit('CANBusMessage', CanData);
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
