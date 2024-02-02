var socket = io.connect('localhost:3000');

socket.on('CANBusMessage', (data) => {
  var rpmBar = document.getElementById('rpmbar');
  var rpmNum = document.getElementById('rpmNum');
  var speed = document.getElementById('speed');
  var voltage = document.getElementById('voltage');
  var iat = document.getElementById('iat');
  var ect = document.getElementById('ect');
  var tps = document.getElementById('tps');
  var oilTemp = document.getElementById('oilTemp');
  var oilPressure = document.getElementById('oilPressure');

  // RPM progressive bar
  rpmBar.style.setProperty('max-width', '1920px', 'important');
  var rpmbarPercentage = (data.rpm / 9000) * 100;

  // Assign data to UI controls
  rpmBar.style.width = `${rpmbarPercentage}%`;
  rpmNum.textContent = data.rpm;
  speed.textContent = data.speed;
  voltage.textContent = (data.voltage / 10).toFixed(1);
  iat.textContent = data.iat;
  ect.textContent = data.ect;
  tps.textContent = data.tps;
  oilTemp.textContent = data.oilTemp;
  oilPressure.textContent = data.oilPressure;

  // RPM Bar colouring
  var percentInt = parseInt(rpmBar.style.width);
  if (percentInt > 85)
    rpmBar.style.setProperty('background-color', 'red', 'important');
  else if (percentInt > 60)
    rpmBar.style.setProperty('background-color', 'yellow', 'important');
  else
    rpmBar.style.setProperty('background-color', 'green', 'important');
});

socket.on('LapTimer', (data) => {
  var currentMinutes = Math.floor((data.currentLap % 3600000) / 60000);
  var currentSeconds = Math.floor((data.currentLap % 60000) / 1000);
  var currentMilliseconds = data.currentLap % 1000;

  var bestMinutes = Math.floor((data.bestLap % 3600000) / 60000);
  var bestSeconds = Math.floor((data.bestLap % 60000) / 1000);
  var bestMilliseconds = data.bestLap % 1000;

  var lastMinutes = Math.floor((data.lastLap % 3600000) / 60000);
  var lastSeconds = Math.floor((data.lastLap % 60000) / 1000);
  var lastMilliseconds = data.lastLap % 1000;

  var pbMinutes = Math.floor((data.pbLap % 3600000) / 60000);
  var pbSeconds = Math.floor((data.pbLap % 60000) / 1000);
  var pbMilliseconds = data.pbLap % 1000;

  var currentLap = document.getElementById('currentLap');
  var bestLap = document.getElementById('bestLap');
  var lastLap = document.getElementById('lastLap');
  var pbLap = document.getElementById('pbLap');

  currentLap.textContent = `${currentMinutes}:${currentSeconds}.${currentMilliseconds}`;
  bestLap.textContent = `${bestMinutes}:${bestSeconds}.${bestMilliseconds}`;;
  lastLap.textContent = `${lastMinutes}:${lastSeconds}.${lastMilliseconds}`;;
  pbLap.textContent = `${pbMinutes}:${pbSeconds}.${pbMilliseconds}`;;
});