const fs = require('fs');
const Gpsd = require('node-gpsd-client')
const client = new Gpsd({
  port: 2947,              // default
  hostname: 'localhost',   // default
  parse: true
})

var gpsData = {};

client.on('connected', () => {
  console.log('Gpsd connected')
  client.watch({
    class: 'WATCH',
    json: true,
    scaled: true
  });
});

client.on('error', err => {
  console.log(`Gpsd error: ${err.message}`);
});

client.on('TPV', data => {
  gpsData = {
    lat: data.lat,
    lon: data.lon
  };
});

setInterval(() => {
  if (gpsData.lat !== undefined && gpsData.lon !== undefined) {
    var logMessage = `lat: ${gpsData.lat}, long: ${gpsData.lon}\n`;

    fs.appendFile('gpslog.txt', logMessage, err => {
      if (err)
        console.error('Error writing to file:', err);
      else
        console.log('Data written to file:', logMessage);
    });
  }
}, 2000);

client.connect()
