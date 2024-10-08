//server2.js
var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server);
const { CanData } = require('./config/canConfig');
const { exec } = require('child_process');
// const { TrackStartFinishLines, GPSData, LapTiming } = require('./config/lapTimingConfig');
// const { GetGPSLocation } = require('./gps/gps');

// Settings
const fs = require('fs');
const wrdSettingsRawData = fs.readFileSync('../wrd-settings.json');
const wrdSettings = JSON.parse(wrdSettingsRawData);

/* -------------------- Socket setup -------------------- */
//var channel = can.createRawChannel(serverConfig.canChannel, true);
var channel = can.createRawChannel(wrdSettings.canChannel, true);

app.use(express.static(__dirname + '/client'));

socketio.on('connection', function(client) {
	console.log('Client connected');
});

app.get('/config', (req, res) => {
  res.json({
    shiftLight1: wrdSettings.rpm.shiftLight1,
    shiftLight2: wrdSettings.rpm.shiftLight2,
    shiftLight3: wrdSettings.rpm.shiftLight3,
    shiftLight4: wrdSettings.rpm.shiftLight4,
    shiftLight5: wrdSettings.rpm.shiftLight5,
    shiftLight6: wrdSettings.rpm.shiftLight6,
    shiftLight7: wrdSettings.rpm.shiftLight7
  });
});

/* -------------------- Fire data logging Go project -------------------- */
// This is to be tested a lot more, just temp to get things sorted
var currentPressBool = false;
var child;
channel.addListener('onMessage', function(msg) {
  if (msg.id == 105) {
    currentPressBool = !currentPressBool;

    // For front end alert label
    socketio.emit('CANBusMessageDataLogging', currentPressBool);

    if (currentPressBool) {
      child = exec(wrdSettings.dataloggingProjectPath, { cwd: wrdSettings.dataloggingSaveToPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing file: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
    else if (!currentPressBool) {
      child.kill('SIGTERM'); // Sends the SIGTERM signal to terminate the process
      console.log('Process killed');
    }
  }
});

/* -------------------- Reading data -------------------- */
// Oil Temp
const A = 0.0014222095;
const B = 0.00023729017;
const C = 9.3273998E-8;
// Oil Pressure
var originalLow = 0; //0.5;
var originalHigh = 5; //4.5;
var desiredLow = -100; //0;
var desiredHigh = 1100; //1000;
channel.addListener('onMessage', function(msg) {
	// Honda
  if (wrdSettings.car === 'honda') {
    switch(msg.id) {
      case 660:
      case 1632:
        CanData.rpm = msg.data.readUIntBE(0, 2);
        CanData.speed = msg.data.readUIntBE(2, 2);
        CanData.gear = msg.data.readUIntBE(4, 1);
        CanData.voltage = (msg.data.readUIntBE(5, 1) / 10).toFixed(1);
        break;
      case 661:
      case 1633:
        CanData.iat = msg.data.readUIntBE(0, 2);
        CanData.ect = msg.data.readUIntBE(2, 2);
        break;
      case 662:
      case 1634:
        CanData.tps = msg.data.readUIntBE(0, 2);
        // CanData.map = msg.data.readUIntBE(2, 2) / 10; // /2 ?
        break;
      case 664:
      case 1636:
        CanData.lambdaRatio = (32768 / msg.data.readUIntBE(0, 2)).toFixed(1);
        // CanData.lambda = msg.data.readUIntBE(2, 2);
        break;
      case 667:
      case 1639:
        // Oil Temp
        var oilTempResistance = msg.data.readUIntBE(0, 2);
        var kelvinTemp = 1 / (A + B * Math.log(oilTempResistance) + C * Math.pow(Math.log(oilTempResistance), 3));
        CanData.oilTemp = (kelvinTemp - 273.15).toFixed(0);

        // Oil Pressure
        var oilPressureResistance = msg.data.readUIntBE(2, 2) / 819.2
        var kPaValue = ((oilPressureResistance - originalLow) / (originalHigh - originalLow) * (desiredHigh - desiredLow)) + desiredLow;
        CanData.oilPressure = (kPaValue * 0.145038).toFixed(0); // Convert to psi
        break;
    }

    if (CanData.tps === 65535) { CanData.tps = 0; }
  }

  if (wrdSettings.car === 'mazda') {
    switch(msg.id) {
      case 201:
      case 513:
        var rpm1 = msg.data.readUIntBE(0, 1);
        var rpm2 = msg.data.readUIntBE(1, 1);
        CanData.rpm = Math.trunc(((256 * rpm1) + rpm2) / 4);
        //CanData.rpm = msg.data.readUIntBE(0, 2);
        CanData.tps = Math.trunc(msg.data.readUIntBE(6, 1) / 2);
        break;
    }
  } 

	socketio.emit('CANBusMessage', CanData);
});

/* -------------------- Lap Timing -------------------- */
// if (wrdSettings.lapTiming) {
//   setInterval(() => {
//     LapTiming.updateCurrentLap();
//     socketio.emit('LapTiming', LapTiming.currentLap);
//   }, 100);

//   setInterval(() => {
//     socketio.emit('LapStats', LapTiming.lastLap, LapTiming.bestLap, LapTiming.pbLap);
//   }, 10000);
// }
// //#endregion

// if (wrdSettings.lapTiming) {
//   GetGPSLocation();
//   LapTiming.startLap();

//   /*
//     - Very rough idea on how the comparison would work. Would need to put it into it's own class with a bunch of logic around the matching
//     - I think we could have a field for each track where we know the 'quickest' possible lap time.
//       - Don't do the GPS location check until we've gone past that quickest lap. i.e. 58 seconds @ Wakefield
//   */

//   // setInterval(() => {
//   //   if (GPSData.lat === TrackStartFinishLines.home.lat && GPSData.lon === TrackStartFinishLines.home.lon) {
//   //     LapTiming.finishLap();
//   //     LapTiming.startLap();
//   //     // Would we need to do LapTiming.updateCurrentLap() again instead of L31 ?
//   //   }
//   // }, 100);
// }

channel.start();
server.listen(3000);
