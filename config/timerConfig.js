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
  lapStartTime: 0,
  currentLap: 0,
  lastLap: 118374,
  bestLap: 113293,
  pbLap: 117394,

  startLap: function () { this.lapStartTime = new Date().getTime(); },
  
  updateCurrentLap: function () {
    const currentTime = new Date().getTime();
    this.currentLap = currentTime - this.lapStartTime;
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
};

module.exports = { TrackStartFinishLines, GPSData, LapTimer };