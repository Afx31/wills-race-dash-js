var socket = io.connect('localhost:3000');

socket.on('CANBusMessage', (data) => {
  var rpmBar = document.getElementById('rpmbar');
  var rpmNum = document.getElementById('rpmNum');
  var speed = document.getElementById('speed');
  var gear = document.getElementById('gear');
  var voltage = document.getElementById('voltage');
  var iat = document.getElementById('iat');
  var ect = document.getElementById('ect');
  var tps = document.getElementById('tps');
  var map = document.getElementById('map');
  // var inj = document.getElementById('inj');
  // var ign = document.getElementById('ign');
  // var lambdaRatio = document.getElementById('lambdaRatio');
  // var lambda = document.getElementById('lambda');
  
  rpmBar.style.setProperty('max-width', '1582px', 'important');

  var rpmbarPercentage = 0; // = (currentRpm / redlineRpm) * 100
  var tempPercentValue = data.rpm / 8300;
  rpmbarPercentage = tempPercentValue * 100;

  rpmBar.style.width = rpmbarPercentage + "%";
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

  // RPM Bar colouring
  var percentString = rpmBar.style.width;
  percentString = percentString.split('%')
  var percentInt = parseInt(percentString)

  if (percentInt > 85)
    rpmBar.style.setProperty('background-color', 'red', 'important');
  else if (percentInt > 75)
    rpmBar.style.setProperty('background-color', 'yellow', 'important');
  else
    rpmBar.style.setProperty('background-color', 'green', 'important');
});
