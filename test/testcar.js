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
var msg664 = lambdaRatio = {
  'id': 664,
  data: [0, 0, 0, 0]
}
var msg665 = {
  'id': 665,
  data: [0, 0, 0, 0]
}

var rpm = 0;
var speed = 0;
var gear = 1;
var voltage = 14;
var iat = 27;
var ect = 80;
var tps = 10;
var map = 40;
var inj = 4;
var ign = 5;
var lambdaRatio = 46686;
var lambda = 22999;
var oilTemp = 90;
var oilPressure = 90;

setInterval(() => {
  var msgOut660 = {};
  var msgOut661 = {};
  var msgOut662 = {};
  var msgOut663 = {};
  var msgOut664 = {};
  var msgOut665 = {};
  var buff660 = Buffer.alloc(6);
  var buff661 = Buffer.alloc(4);
  var buff662 = Buffer.alloc(4);
  var buff663 = Buffer.alloc(4);
  var buff664 = Buffer.alloc(4);
  var buff665 = Buffer.alloc(4);

  rpm += 200;
  tps += 5;
  speed += 10;
  gear += 1;
  oilPressure += 0.2;

  if (rpm == 8400)
    rpm = 0;

  if (tps == 100)
    tps = 0;

  if (speed == 400)
    speed = 0;

  if (gear == 7)
    gear = 1;

  if (oilPressure == 100)
    oilPressure = 90;
 
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

  buff665.writeUIntBE(oilTemp, 0, 2);
  buff665.writeUIntBE(oilPressure, 2, 2);  
  console.log('buff665: ', buff665);

  // Assign Buffer to Msg
  msgOut660.id = msg660.id;
  msgOut660.data = buff660;

  msgOut661.id = msg661.id;
  msgOut661.data = buff661;

  msgOut662.id = msg662.id;
  msgOut662.data = buff662;

  msgOut663.id = msg663.id;
  msgOut663.data = buff663;

  msgOut664.id = msg664.id;
  msgOut664.data = buff664;

  msgOut665.id = msg665.id;
  msgOut665.data = buff665;

  // Send Msg on channel to server
  channel.send(msgOut660);
  channel.send(msgOut661);
  channel.send(msgOut662);
  channel.send(msgOut663);
  channel.send(msgOut664);
  channel.send(msgOut665);
}, 100);

channel.start();
