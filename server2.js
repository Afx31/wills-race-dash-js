//server2.js
var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server);
const { CanData } = require('./config/canConfig');

// Config
const serverConfig = {
	canChannel: 'can0',
	currentCar: 'honda',
};

/* -------------------- Socket setup -------------------- */
var channel = can.createRawChannel(serverConfig.canChannel, true);

app.use(express.static(__dirname + '/client'));

socketio.on('connection', function(client) {
	console.log('Client connected');
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
			CanData.map = msg.data.readUIntBE(2, 2) / 10; // /2 ?
			break;
		case 664:
		case 1636:
			CanData.lambdaRatio = (32768 / msg.data.readUIntBE(0, 2)).toFixed(1);
			// CanData.lambda = msg.data.readUIntBE(2, 2);
			break;
		case 667:
		case 1639:
			CanData.oilTemp = msg.data.readUIntBE(0, 2);
			CanData.oilPressure = msg.data.readUIntBE(2, 2);
			break;
    case 667:
		case 1639:
      // Oil Temp
			var oilTempResistance = msg.data.readUIntBE(0, 2);
      var kelvinTemp = 1 / (A + B * Math.log(oilTempResistance) + C * Math.pow(Math.log(oilTempResistance), 3));
      CanData.oilTemp = (kelvinTemp - 273.15).toFixed(1);

      // Oil Pressure
      var oilPressureResistance = msg.data.readUIntBE(2, 2) / 819.2
      var kPaValue = ((oilPressureResistance - originalLow) / (originalHigh - originalLow) * (desiredHigh - desiredLow)) + desiredLow;
      CanData.oilPressure = (kPaValue * 0.145038).toFixed(1); // Convert to psi
			break;
	}

  if (CanData.tps === 65535) { CanData.tps = 0; }

	socketio.emit('CANBusMessage', CanData);
});

channel.start();
server.listen(3000);
