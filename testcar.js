var can = require('socketcan');
var channel = can.createRawChannel('vcan0', true);

var msg1 = {
  'id': 661,
  data: [0, 0, 0, 0]
}
var msg2 = {
  'id': 660,
  data: [0, 0, 0, 0, 0, 0, 0, 0]
}

var rpm = 0;
var speed = 0;
var gear = 0;
var voltage = 0;
var iat = 0;
var ect = 0;
var tps = 0;
var map = 0;
var inj = 0;
var ign = 0;
var equivRatio = 0;
var lambda = 0;
var loop = true;

setInterval(() => {
  var msgOut1 = {};
  var msgOut2 = {};
  var buff1 = Buffer.alloc(4);
  var buff2 = Buffer.alloc(8);

  if (loop) {
    rpm = 1000;
    speed = 0;
    gear = 1;
    voltage = 14;
    iat = 20;
    ect = 25;
    tps = 30;
    map = 12;
    inj = 1;
    ign = 2;
    equivRatio = 3;
    lambda = 4;
    loop = false;
  } else {
    rpm = 2000;
    speed = 0;
    gear = 2;
    voltage = 12;
    iat = 40;
    ect = 45;
    tps = 50;
    map = 27;
    inj = 2;
    ign = 4;
    equivRatio = 5;
    lambda = 6;
    loop = true;
  }

  buff1.writeUIntBE(iat, 0, 2);
  buff1.writeUIntBE(ect, 2, 2);
  console.log('buff1: ', buff1);

  buff2.writeUIntBE(rpm, 0, 2);
  buff2.writeUIntBE(speed, 2, 2);
  buff2.writeUIntBE(gear, 4, 1);
  buff2.writeUIntBE(voltage, 5, 1);
  console.log('buff2: ', buff2);

  msgOut1.id = msg1.id;
  msgOut1.data = buff1;
  msgOut2.id = msg2.id;
  msgOut2.data = buff1;

  channel.send(msgOut1);
  channel.send(msgOut2);
}, 1000);

channel.start();