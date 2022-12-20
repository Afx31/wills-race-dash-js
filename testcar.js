var can = require('socketcan');
var channel = can.createRawChannel('vcan0', true);

var msg1 = {
  'id': 660,
  data: [0, 0, 0, 0]
}
var msg2 = {
  'id': 661,
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
var inj = 0;
var ign = 0;
var equivRatio = 0;
var lambda = 0;

setInterval(() => {
  var msgOut1 = {};
  var msgOut2 = {};
  var buff1 = Buffer.alloc(4);
  var buff2 = Buffer.alloc(4);

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
 
  buff1.writeUIntBE(rpm, 0, 2);
  buff1.writeUIntBE(speed, 2, 2);
  // buff1.writeUIntBE(gear, 4, 1);
  // buff1.writeUIntBE(voltage, 5, 1);
  console.log('buff1: ', buff1);

  buff2.writeUIntBE(iat, 0, 2);
  buff2.writeUIntBE(ect, 2, 2);  
  console.log('buff2: ', buff2);

  msgOut1.id = msg1.id;
  msgOut1.data = buff1;
  msgOut2.id = msg2.id;
  msgOut2.data = buff2;

  channel.send(msgOut1);
  channel.send(msgOut2);
}, 100);

channel.start();