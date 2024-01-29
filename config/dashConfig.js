const CanData = {
  rpm: 0,
  speed: 0,
  gear: 0,
  voltage: 0,
  iat: 0,
  ect: 0,
  tps: 0,
  map: 0,
  inj: 0,
  ign: 0,
  lambdaRatio: 0,
  lambda: 0
}

const CanPIDConfig = {
  honda: {
    rpm: { ids: [660, 1632], offset: 0, size: 2 },
    speed: { ids: [660, 1632], offset: 2, size: 2 },
    gear: { ids: [660, 1632], offset: 4, size: 1 },
    voltage: { ids: [660, 1632], offset: 5, size: 1 },
    iat: { ids: [661, 1633], offset: 0, size: 2 },
    ect: { ids: [661, 1633], offset: 2, size: 2 },
    tps: { ids: [662, 1634], offset: 0, size: 2 },
    map: { ids: [662, 1634], offset: 2, size: 2 },
    inj: { ids: [663, 1635], offset: 0, size: 2 },
    ign: { ids: [663, 1635], offset: 2, size: 2 },
    lambdaRatio: { ids: [664, 1636], offset: 0, size: 2 },
    lambda: { ids: [664, 1636], offset: 2, size: 2 }
  },
  mazda: {
    // rpm: { ids: [201, 513], offset: 0, size: 2},
    tps: { ids: [201, 513], offset: 6, size: 1 }
  }
};

const LapTimer = {
  currentLap: 0,
  lastLap: 0,
  bestLap: 0,
  pbLap: 0,

  startLap: function () {
    // Start a new lap by resetting current lap time
    this.currentLapTime = 0;
  },

  finishLap: function () {
    if (this.currentLap > 0) {
      // Compare and update best lap times
      if (this.bestLap === null || this.currentLap < this.bestLap)
        this.bestLap = this.currentLap;

      if (this.pbLap === null || this.currentLap < this.pbLap)
        this.pbLap = this.currentLap
    }
  },

  updateLap: function (elapsedTime) {
    this.currentLap = elapsedTime;
  },

  getCurrentLapTime: function () {
    return this.currentLapTime;
  },

  getBestTodayLapTime: function () {
    return this.bestTodayLapTime;
  },

  getBestEverLapTime: function () {
    return this.bestEverLapTime;
  }
};

module.exports = { CanData, CanPIDConfig, LapTimer };