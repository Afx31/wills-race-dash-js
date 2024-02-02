const TrackStartFinishLines = {
  home: {
    lat: 0,
    lon: 0
  },
  smsp: {
    lat: -33.803778,
    lon: 150.870944
  },
  wakefield: {
    lat: 0,
    lon: 0
  },
  winton: {
    lat: 0,
    lon: 0
  },
  morganPark: {
    lat: 0,
    lon: 0
  }
}

const GPSData = {
  lat: 0,
  lon: 0
}

const LapTimer = {
  currentLap: 0,
  lastLap: 118374,
  bestLap: 113293,
  pbLap: 117394,

  startLap: function () {
    // Starting a new lap
    this.currentLapTime = 0;
    
    var intervalStartLap = setInterval(() => {
      this.currentLap++;
      // console.log('Time: ', this.currentLap)
    }, 1);
  },

  finishLap: function () {
    if (this.currentLap > 0) {
      this.lastLap = this.currentLap;

      if (this.currentLap > this.bestLap)
        this.bestLap = this.currentLap;

      if (this.bestLap > this.pbLap)
        this.pbLap = this.bestLap;
    }
  },

  // updateLap: function (elapsedTime) {
  //   this.currentLap = elapsedTime;
  // },

  // getCurrentLapTime: function () {
  //   return this.currentLapTime;
  // },

  // getBestTodayLapTime: function () {
  //   return this.bestTodayLapTime;
  // },

  // getBestEverLapTime: function () {
  //   return this.bestEverLapTime;
  // }
};

module.exports = { TrackStartFinishLines, GPSData, LapTimer };