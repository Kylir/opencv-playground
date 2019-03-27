// Shamelessly stolen from https://github.com/mskutta/node-red-contrib-vl53l0x
// Thanks a lot!!

/* eslint-disable no-console */
/* eslint-disable no-sync */
/* eslint-disable no-bitwise */

const i2c = require('i2c-bus')

// Returns a range reading in millimeters.
function readRangeMillimeters (i2cBus, address) {
    let timeout = 10
    while ( i2cBus.readByteSync(address, 0x13) & 0x07 === 0 ) {
        if (timeout === 0) {
            console.log('TIMEOUT')
            return 0
        }
        timeout -= 1
    }
    let range = i2cBus.readWordSync(address, (0x14 + 10))
    range = ((range & 0xFF) << 8) | ((range >> 8) & 0xFF)
    i2cBus.writeByteSync(address, 0x0B, 0x01)

    if ((range <= 20) || (range > 1200)) {
        range = 1200
    }

    return range
}

// Performs 5 readings, remove the crazy ones and do an average 
function read5Times (i2cBus, address) {
    let aggrDist = 0
    for (let i = 0; i <= 5; i+=1) {
        const d = readRangeMillimeters(i2cBus, address)
        if ( d < 1200 ) {
            if ( aggrDist === 0) {
                aggrDist = d
            } else {
                aggrDist = Math.floor((aggrDist + d) / 2) 
            }
        }
    }
    return aggrDist
}

// Initialise the sensor with default mode
function initI2cTofSensor (bus, address) {
    const i2cBus = i2c.openSync(bus)
    const i = i2cBus.readByteSync(address, 0x89) | 0x01
    i2cBus.writeByteSync(address, 0x89, i)
    i2cBus.writeByteSync(address, 0x88, 0x00)
    i2cBus.writeByteSync(address, 0x00, 0x02)
    return i2cBus
}

function closeI2cTofSensor (i2cBus) {
    i2cBus.closeSync()
}

module.exports = {
    readRangeMillimeters,
    read5Times,
    initI2cTofSensor,
    closeI2cTofSensor
}
