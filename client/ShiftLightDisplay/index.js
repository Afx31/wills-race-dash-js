var socket = io.connect('localhost:3000');
const shiftLightRange1 = 1000;
const shiftLightRange2 = 1100;
const shiftLightRange3 = 1200;
const shiftLightRange4 = 1300;
const shiftLightRange5 = 1400;
const shiftLightRange6 = 1500;
const shiftLightRange7 = 1600;

socket.on('CANBusMessage', (data) => {
  var rpmBar = document.getElementById('rpmbar');
  var rpmNum = document.getElementById('rpmNum');
  var speed = document.getElementById('speed');
  var gear = document.getElementById('gear');
  var voltage = document.getElementById('voltage');
  var iat = document.getElementById('iat');
  var ect = document.getElementById('ect');
  var tpsBar = document.getElementById('tpsbar');
  // var tps = document.getElementById('tps');
  // var map = document.getElementById('map');
  var lambdaRatio = document.getElementById('lambdaRatio');
  var oilTemp = document.getElementById('oilTemp');
  var oilPressure = document.getElementById('oilPressure');

  var shiftLight1 = document.getElementById('shift-light-1');
  var shiftLight2 = document.getElementById('shift-light-2');
  var shiftLight3 = document.getElementById('shift-light-3');
  var shiftLight4 = document.getElementById('shift-light-4');
  var shiftLight5 = document.getElementById('shift-light-5');
  var shiftLight6 = document.getElementById('shift-light-6');
  var shiftLight7 = document.getElementById('shift-light-7');
  
  if (data.rpm < shiftLightRange1) { shiftLight1.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange1) { shiftLight1.style.setProperty('background-color', 'blue'); }
  
  if (data.rpm < shiftLightRange2) { shiftLight2.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange2) { shiftLight2.style.setProperty('background-color', 'blue'); }

  if (data.rpm < shiftLightRange3) {shiftLight3.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange3) { shiftLight3.style.setProperty('background-color', 'green'); }

  if (data.rpm < shiftLightRange4) { shiftLight4.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange4) { shiftLight4.style.setProperty('background-color', 'green'); }

  if (data.rpm < shiftLightRange5) { shiftLight5.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange5) { shiftLight5.style.setProperty('background-color', 'yellow'); }

  if (data.rpm < shiftLightRange6) { shiftLight6.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange6) { shiftLight6.style.setProperty('background-color', 'yellow'); }

  if (data.rpm < shiftLightRange7) { shiftLight7.style.setProperty('background-color', ''); }
  if (data.rpm >= shiftLightRange7) { shiftLight7.style.setProperty('background-color', 'red'); }

  // Assign data to UI controls
  rpmBar.style.width = ((data.rpm / 9000) * 100) + '%';
  tpsBar.style.height = data.tps + '%';
  rpmNum.textContent = data.rpm;
  speed.textContent = data.speed;
  gear.textContent = data.gear;
  voltage.textContent = data.voltage;
  iat.textContent = data.iat;
  ect.textContent = data.ect;
  // tps.textContent = data.tps;
  // map.textContent = data.map;
  lambdaRatio.textContent = data.lambdaRatio;
  oilTemp.textContent = data.oilTemp;
  oilPressure.textContent = data.oilPressure;
});
