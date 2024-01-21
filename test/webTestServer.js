var express = require('express');
var http = require('http');
var WebSocket = require('ws');

var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server });

var canbusData = {
  rpm: 0,
  speed: 0,
  gear: 1,
  voltage: 14,
  iat: 27,
  ect: 80,
  tps: 10,
  map: 40,
  inj: 4,
  ign: 6,
  lambdaRatio: 46686,
  lambda: 22999
}

app.use(express.static(__dirname + '/client'));

wss.on('connection', function(ws) {
  console.log('Client connected');

  // Send initial data when a client connects
  ws.send(JSON.stringify(canbusData));
});

setInterval(() => {
  // Simulate data for testing
  canbusData.rpm += 100;
  canbusData.tps += 10;
  canbusData.speed += 10;
  canbusData.gear += 1;
  
  if (canbusData.rpm === 9000)
    canbusData.rpm = 0;

  if (canbusData.tps === 100)
    canbusData.tps = 0;

  if (canbusData.speed === 400)
    canbusData.speed = 0;

  if (canbusData.gear === 7)
    canbusData.gear = 1;
  
  // Send data to all connected clients
  wss.clients.forEach(function(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(canbusData));
    }
  });
}, 100);

server.listen(3000, function() {
  console.log('Server listening on port 3000');
});