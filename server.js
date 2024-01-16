var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server);

var channel = can.createRawChannel('vcan0', true);

var carPIDConfig = {
  honda: {
    rpm: { ids: [660, 1632], offset: 0, size: 2 },
    speed: { ids: [660, 1632], offset: 2, size: 2 },
    gear: { ids: [660, 1632], offset: 4, size: 1 },
    voltage: { ids: [660, 1632], offset: 5, size: 1 },
    iat: { ids: [661, 1633], offset: 0, size: 2 },
    ect: { ids: [661, 1633], offset: 2, size: 2 },
    tps: { ids: [662, 1634], offset: 0, size: 2 },
    map: { ids: [662, 1634], offset: 2, size: 2 },
    inj: { ids: [663, 1635], offset: 0, size: 2 },
    ign: { ids: [663, 1635], offset: 2, size: 2 },
    lambdaRatio: { ids: [664, 1636], offset: 0, size: 2 },
    lambda: { ids: [664, 1636], offset: 2, size: 2 }
  },
  mazda: {
    tps: { ids: [201], offset: 5, size: 1 },
  }
}

var canbusData = {
  rpm: 0,
  speed: 0,
  gear: 0,
  voltage: 0,
  iat: 0,
  ect: 0,
  tps: 0,
  map: 0,
  inj: 0,
  ign: 0,
  lambdaRatio: 0,
  lambda: 0
}

app.use(express.static(__dirname + '/client'));

socketio.on('connection', function(client) {
  console.log('Client connected');
});

setInterval(() => {
  socketio.emit('CANBusMessage', canbusData);
}, 100);


channel.addListener('onMessage', function(msg) {
  // Rpm, speed, gear, voltage
  if (msg.id === 660 || msg.id === 1632) {
    canbusData.rpm = msg.data.readUIntBE(0, 2);
    canbusData.speed = msg.data.readUIntBE(2, 2);
    canbusData.gear = msg.data.readUIntBE(4, 1);
    canbusData.voltage = msg.data.readUIntBE(5, 1);
  }
  
  // Temperates - IAT, ECT
  if (msg.id === 661 || msg.id === 1633) {
    canbusData.iat = msg.data.readUIntBE(0, 2);
    canbusData.ect = msg.data.readUIntBE(2, 2);
  }
  
  // TPS, MAP
  if (msg.id === 662 || msg.id === 1634) {
    canbusData.tps = msg.data.readUIntBE(0, 2);
    canbusData.map = msg.data.readUIntBE(2, 2);
  if (canbusData.tps === 65535)
    canbusData.tps = 0
 }

  // Injector duration, Ignition advance
  if (msg.id === 663 || msg.id === 1635) {
    canbusData.inj = msg.data.readUIntBE(0, 2);
    canbusData.ign = msg.data.readUIntBE(2, 2);
  }

  // Lambda Ratio, Lambda
  if (msg.id === 664 || msg.id === 1636) {
    canbusData.lambdaRatio = msg.data.readUIntBE(0, 2);
    canbusData.lambda = msg.data.readUIntBE(2, 2);
  }

  console.log(canbusData);
});

channel.start();
server.listen(3000);
