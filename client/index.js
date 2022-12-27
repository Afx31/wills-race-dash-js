var socket = io.connect('localhost:3000');

socket.on('CANBusMessage', (data) => {
  // console.log('Data: ' + data);

  var rpmBar = document.getElementById('rpmbar');
  var rpmNum = document.getElementById('rpmNum');
  var speed = document.getElementById('speed');
  var gear = document.getElementById('gear');
  var voltage = document.getElementById('voltage');
  var iat = document.getElementById('iat');
  var ect = document.getElementById('ect');
  var tps = document.getElementById('tps');
  var map = document.getElementById('map');
  var inj = document.getElementById('inj');
  var ign = document.getElementById('ign');
  var lambdaRatio = document.getElementById('lambdaRatio');
  var lambda = document.getElementById('lambda');

  rpmBar.style.width = data.rpm + "%";
  rpmNum.textContent = data.rpm;
  speed.textContent = data.speed;
  gear.textContent = data.gear;
  voltage.textContent = data.voltage;
  iat.textContent = data.iat;
  ect.textContent = data.ect;
  tps.textContent = data.tps;
  map.textContent = data.map;
  // inj.textContent = data.inj;
  // ign.textContent = data.ign;
  // lambdaRatio.textContent = data.lambdaRatio;
  // lambda.textContent = data.lambda;


  var rpmBar2 = document.getElementById('rpmbar');
  console.log(typeof rpmBar2.style.width)

  var percentString = rpmBar2.style.width;
  percentString = percentString.split('%')
  var percentInt = parseInt(percentString)

  if (percentInt > 85)
    rpmBar2.style.setProperty('background-color', 'red', 'important');
  else if (percentInt > 75)
    rpmBar2.style.setProperty('background-color', 'yellow', 'important');
  else
    rpmBar2.style.setProperty('background-color', 'green', 'important');

});
