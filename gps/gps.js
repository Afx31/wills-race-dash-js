//const fs = require('fs');
const Gpsd = require('node-gpsd-client')
const client = new Gpsd({
  port: 2947,
  hostname: 'localhost',
  parse: true
});
const { GPSData } = require('../config/lapTimingConfig');

function GetGPSLocation() {
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
    if (GPSData.lat !== undefined && GPSData.lon !== undefined) {
      GPSData.lat = data.lat;
      GPSData.lon = data.lon;
    }

    // var testDate = new Date()
    // var hours = testDate.getHours();
    // var minutes = testDate.getMinutes();
    // var seconds = testDate.getSeconds();
  });
}

// Write to file logging
// setInterval(() => {
//   console.log(gpsData)
//   if (gpsData.lat !== undefined && gpsData.lon !== undefined) {
//     var logMessage = `lat: ${gpsData.lat}, lon: ${gpsData.lon}\n`;

//     fs.appendFile('gpslogtest.txt', logMessage, err => {
//       if (err)
//         console.error('Error writing to file:', err);
//       else
//         console.log('Data written to file:', logMessage);
//     });
//   }
// }, 2000);

client.connect()

module.exports = { GetGPSLocation }