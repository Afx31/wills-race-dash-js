var can = require('socketcan');
var channel = can.createRawChannel('vcan0', true);

// var msg111 = {
//   'id': 111,
//   data: [0, 0, 0, 0, 0, 0]
// }
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
var msg667 = {
  'id': 667,
  data: [0, 0, 0, 0]
}

var changeDisplay = 0;

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
var oilTemp = 2111;
var oilPressure = 407;

// Very hacked together test case
// setInterval(() => {
//   if (changeDisplay === 0)
//     changeDisplay = 1;
//   else if (changeDisplay === 1)
//     changeDisplay = 0;
// }, 10000);

setInterval(() => {
  // var msgOut111 = {};
  var msgOut660 = {};
  var msgOut661 = {};
  var msgOut662 = {};
  var msgOut663 = {};
  var msgOut664 = {};
  var msgOut667 = {};
  // var buff111 = Buffer.alloc(4);
  var buff660 = Buffer.alloc(6);
  var buff661 = Buffer.alloc(4);
  var buff662 = Buffer.alloc(4);
  var buff663 = Buffer.alloc(4);
  var buff664 = Buffer.alloc(4);
  var buff667 = Buffer.alloc(4);

  rpm += 200;
  tps += 5;
  speed += 10;
  gear += 1;
  // oilTemp += 2;
  // oilPressure += 2;

  if (rpm > 8400)
    rpm = 0;

  if (tps == 100)
    tps = 0;

  if (speed > 200)
    speed = 0;

  if (gear == 7)
    gear = 1;
 
  // Write to Buffer
  // buff111.writeUIntBE(changeDisplay, 0, 1);
  // console.log('buff111: ', buff111);

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

  buff667.writeUIntBE(oilTemp, 0, 2);
  buff667.writeUIntBE(oilPressure, 2, 2);  
  console.log('buff667: ', buff667);

  // Assign Buffer to Msg
  // msgOut111.id = msg111.id;
  // msgOut111.data = buff111;

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

  msgOut667.id = msg667.id;
  msgOut667.data = buff667;

  // Send Msg on channel to server
  // channel.send(msgOut111);
  channel.send(msgOut660);
  channel.send(msgOut661);
  channel.send(msgOut662);
  channel.send(msgOut663);
  channel.send(msgOut664);
  channel.send(msgOut667);
}, 100);

channel.start();