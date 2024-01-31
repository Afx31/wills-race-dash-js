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
  Map.textContent = data.map;

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
  var currentHours = Math.floor(data.currentLap / 3600000);
  var currentMinutes = Math.floor((data.currentLap % 3600000) / 60000);
  var currentSeconds = Math.floor((data.currentLap % 60000) / 1000);
  var currentMilliseconds = data.currentLap % 1000;

  var currentLap = document.getElementById('currentLap');
  var bestLap = document.getElementById('bestLap');
  var lastLap = document.getElementById('lastLap');
  var pbLap = document.getElementById('pbLap');

  currentLap.textContent = `${currentHours}:${currentMinutes}:${currentSeconds}.${currentMilliseconds}`;
  bestLap.textContent = ``;
  lastLap.textContent = ``;
  pbLap.textContent = ``;

  // Now map to control
  console.log(`Timer: ${currentHours}:${currentMinutes}:${currentSeconds}.${currentMilliseconds}`);
});