var socket = io.connect('localhost:3000');

socket.on('CANBusMessage', (data) => {  
  // if (data.changeDisplay === 1)
  //   window.location.href = 'http://localhost:3000/LapTimingDisplay';

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
  var oilTemp = document.getElementById('oilTemp');
  var oilPressure = document.getElementById('oilPressure');

  var shiftLight1 = document.getElementById('shift-light-1');
  var shiftLight2 = document.getElementById('shift-light-2');
  var shiftLight3 = document.getElementById('shift-light-3');
  var shiftLight4 = document.getElementById('shift-light-4');
  var shiftLight5 = document.getElementById('shift-light-5');
  var shiftLight6 = document.getElementById('shift-light-6');
  var shiftLight7 = document.getElementById('shift-light-7');
  
  if (data.rpm < 4500) { shiftLight1.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 4500) { shiftLight1.style.setProperty('background-color', 'blue', 'important'); }
  
  if (data.rpm < 5000) { shiftLight2.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 5000) { shiftLight2.style.setProperty('background-color', 'blue', 'important'); }

  if (data.rpm < 5500) { shiftLight3.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 5500) { shiftLight3.style.setProperty('background-color', 'green', 'important'); }

  if (data.rpm < 6000) { shiftLight4.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 6000) { shiftLight4.style.setProperty('background-color', 'green', 'important'); }

  if (data.rpm < 6500) { shiftLight5.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 6500) { shiftLight5.style.setProperty('background-color', 'yellow', 'important'); }

  if (data.rpm < 7000) { shiftLight6.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 7000) { shiftLight6.style.setProperty('background-color', 'yellow', 'important'); }

  if (data.rpm < 7500) { shiftLight7.style.setProperty('background-color', '', 'important'); }
  if (data.rpm >= 7500) { shiftLight7.style.setProperty('background-color', 'red', 'important'); }


  // Assign data to UI controls
  rpmBar.style.width = ((data.rpm / 9000) * 100) + '%';

  // if (tpsBar.style.height !== data.tps + '%')
    tpsBar.style.height = data.tps + '%';

  // if (rpmNum.textContent !== data.rpm)
    rpmNum.textContent = data.rpm;
  
  // if (speed.textContent !== data.speed)
    speed.textContent = data.speed;
  
  gear.textContent = data.gear;
  voltage.textContent = data.voltage;  
  iat.textContent = data.iat;
  ect.textContent = data.ect;
  tps.textContent = data.tps;
  map.textContent = data.map;
  lambdaRatio.textContent = data.lambdaRatio;  
  // inj.textContent = data.inj;
  // ign.textContent = data.ign;
  oilTemp.textContent = data.oilTemp;
  oilPressure.textContent = data.oilPressure;

  // RPM Bar colouring
  // var percentInt = parseInt(rpmBar.style.width);
  // if (percentInt > 85)
  //   rpmBar.style.setProperty('background-color', 'red', 'important');
  // else if (percentInt > 60)
  //   rpmBar.style.setProperty('background-color', 'yellow', 'important');
  // else
  //   rpmBar.style.setProperty('background-color', 'green', 'important');
});