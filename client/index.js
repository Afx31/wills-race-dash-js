var socket = io.connect('localhost:3000');

socket.on('CANBusMessage', (data) => {
  var rpmBar = document.getElementById('rpmbar');
  var rpmNum = document.getElementById('rpmNum');
  var speed = document.getElementById('speed');
  var gear = document.getElementById('gear');
  var voltage = document.getElementById('voltage');
  var iat = document.getElementById('iat');
  var ect = document.getElementById('ect');
  var tpsBar = document.getElementById('tpsbar');
  var tps = document.getElementById('tps');
  var map = document.getElementById('map');
  var lambdaRatio = document.getElementById('lambdaRatio');
  // var inj = document.getElementById('inj');
  // var ign = document.getElementById('ign');
  
  // RPM progressive bar
  rpmBar.style.setProperty('max-width', '1920px', 'important'); //1582px
  var rpmbarPercentage = (data.rpm / 8300) * 100; // = (currentRpm/redlineRpm) * 100

  // TPS progressive bar
  tpsBar.style.setProperty('max-height', '400px', 'important');

  if (data.tps === 65535)
    data.tps = 0

  // Assign data to UI controls
  rpmBar.style.width = rpmbarPercentage + '%';
  tpsBar.style.height = data.tps + '%';
  rpmNum.textContent = data.rpm;
  speed.textContent = data.speed;
  gear.textContent = data.gear;
  voltage.textContent = (data.voltage / 10).toFixed(1);
  iat.textContent = data.iat;
  ect.textContent = data.ect;
  tps.textContent = data.tps;
  map.textContent = (data.map / 10) / 2;
  lambdaRatio.textContent = (32768 / data.lambdaRatio).toFixed(2);
  // inj.textContent = data.inj;
  // ign.textContent = data.ign;

  // RPM Bar colouring
  var percentString = rpmBar.style.width;
  percentString = percentString.split('%')
  var percentInt = parseInt(percentString)

  if (percentInt > 90)
    rpmBar.style.setProperty('background-color', 'red', 'important');
  else if (percentInt > 65)
    rpmBar.style.setProperty('background-color', 'yellow', 'important');
  else
    rpmBar.style.setProperty('background-color', 'green', 'important');
});
