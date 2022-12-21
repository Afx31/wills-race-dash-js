var can = require('socketcan');
var channel = can.createRawChannel('vcan0', true);

var msg660 = {
  'id': 660,
  data: [0, 0, 0, 0, 0, 0]
}
var msg661 = {
  'id': 661,
  data: [0, 0, 0, 0]
}
var msg662 = {
  'id': 662,
  data: [0, 0, 0, 0]
}
var msg663 = {
  'id': 663,
  data: [0, 0, 0, 0]
}
var msg664 = {
  'id': 664,
  data: [0, 0, 0, 0]
}

var rpm = 0;
var speed = 0;
var gear = 1;
var voltage = 14;
var iat = 27;
var ect = 80;
var tps = 25;
var map = 40;
var inj = 4;
var ign = 5;
var lambdaRatio = 10;
var lambda = 12;

setInterval(() => {
  var msg660 = {};
  var msg661 = {};
  var msg662 = {};
  var msg663 = {};
  var msg664 = {};
  var buff660 = Buffer.alloc(6);
  var buff661 = Buffer.alloc(4);
  var buff662 = Buffer.alloc(4);
  var buff663 = Buffer.alloc(4);
  var buff664 = Buffer.alloc(4);

  rpm += 1;
  speed += 10;
  gear += 1;

  if (rpm == 100) {
    rpm = 0;
  }

  if (speed == 400) {
    speed = 0;
  }

  if (gear == 7) {
    gear = 1;
  }
 
  // Write to Buffer
  buff660.writeUIntBE(rpm, 0, 2);
  buff660.writeUIntBE(speed, 2, 2);
  buff660.writeUIntBE(gear, 4, 1);
  buff660.writeUIntBE(voltage, 5, 1);
  console.log('buff660: ', buff660);

  buff661.writeUIntBE(iat, 0, 2);
  buff661.writeUIntBE(ect, 2, 2);  
  console.log('buff661: ', buff661);

  buff662.writeUIntBE(tps, 0, 2);
  buff662.writeUIntBE(map, 2, 2);  
  console.log('buff662: ', buff662);

  buff663.writeUIntBE(inj, 0, 2);
  buff663.writeUIntBE(ign, 2, 2);  
  console.log('buff663: ', buff663);

  buff664.writeUIntBE(lambdaRatio, 0, 2);
  buff664.writeUIntBE(lambda, 2, 2);  
  console.log('buff664: ', buff664);

  // Assign Buffer to Msg
  msg660.id = msg660.id;
  msg660.data = buff660;

  msg661.id = msg661.id;
  msg661.data = buff661;

  msg662.id = msg662.id;
  msg662.data = buff660;

  msg663.id = msg663.id;
  msg663.data = buff661;

  msg664.id = msg664.id;
  msg664.data = buff661;

  // Send Msg on channel to server
  channel.send(msg660);
  channel.send(msg661);
  channel.send(msg662);
  channel.send(msg663);
  channel.send(msg664);
}, 100);

channel.start();