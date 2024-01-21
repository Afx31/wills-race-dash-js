const canPIDConfig = {
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

module.exports = canPIDConfig;