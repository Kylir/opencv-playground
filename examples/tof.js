/* eslint-disable no-console */
const tof = require('../src/tof-utils')

const address = 0x29
const busNumber = 1
const bus = tof.initI2cTofSensor(busNumber, address)
const range = tof.read5Times(bus, address)
console.log(range)
tof.closeI2cTofSensor(bus)
