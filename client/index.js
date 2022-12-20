var socket = io.connect('localhost:3000');

socket.on('CANBusMessage', (data) => {
  console.log('Data: ' + data);

  var rpmBar = document.getElementById('rpmbar');
  var rpmNum = document.getElementById('rpmNum')
  var speed = document.getElementById('speed');
  // var gear = document.getElementById('gear');
  var voltage = document.getElementById('voltage');
  var iat = document.getElementById('iat');
  var ect = document.getElementById('ect');
  var tps = document.getElementById('tps');
  var map = document.getElementById('map');
  // var inj = document.getElementById('inj');
  // var ign = document.getElementById('ign');
  // var equivRatio = document.getElementById('equivRatio');
  // var lambda = document.getElementById('lambda');
  
  rpmBar.style.width = data.rpm + "%";
  rpmNum.textContent = data.rpm;
  speed.textContent = data.speed;
  // gear.textContent = data.gear;
  voltage.textContent = data.voltage;
  iat.textContent = data.iat;
  ect.textContent = data.ect;
  tps.textContent = data.tps;
  map.textContent = data.map;
  // inj.textContent = data.inj;
  // ign.textContent = data.ign;
  // equivRatio.textContent = data.equivRatio;
  // lambda.textContent = data.lambda;
});