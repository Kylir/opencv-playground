/* eslint-disable no-console */
/* eslint-disable no-sync */
/* eslint-disable no-bitwise */

const i2c = require('i2c-bus')

// Returns a range reading in millimeters.
function readRangeMillimeters (i2cBus, address) {
    let timeout = 10
    // wait until reading available, or timeout:
    while ( i2cBus.readByteSync(address, 0x13) & 0x07 === 0 ) {
        if (timeout === 0) {
            console.log('TIMEOUT')
            return 0
        }
        timeout -= 1
    }
    // get range in mm (just deal with erroneous readings in calling routine).
    let range = i2cBus.readWordSync(address, (0x14 + 10))
    // byte swap
    range = ((range & 0xFF) << 8) | ((range >> 8) & 0xFF)

    // clear interrupt (is this needed for a simple polling scheme?):
    i2cBus.writeByteSync(address, 0x0B, 0x01)

    return range
}

function initI2cTofSensor (bus, address) {
    const i2cBus = i2c.openSync(bus)
    // lidar config VL53L0X_DataInit() stuff:
    //   (just the basic stuff)

    // set 2.8V mode (register 0x89):
    // read and set lsb
    const i = i2cBus.readByteSync(address, 0x89) | 0x01
    // then write it back
    i2cBus.writeByteSync(address, 0x89, i)
    // set I2C standard mode:
    i2cBus.writeByteSync(address, 0x88, 0x00)
    // lidar start continuous back-to-back ranging measurements:
    i2cBus.writeByteSync(address, 0x00, 0x02)

    return i2cBus
}


function closeI2cTofSensor (i2cBus) {
    i2cBus.closeSync()
}


function adjustRange (range) {

    let newRange = range
    // so, the max range of this gizmo is about 2000mm, but we will use it in
    // "default mode," which is specified to 1200mm (30 ms range timing budget).
    // note: 20mm or 8190mm seems to be returned for bogus readings, so trap/limit:
    if ((newRange <= 20) || (newRange > 1200)) {
        newRange = 1200
        return newRange
    }
    // --- super-simple "calibration" by surlee:
    if (newRange > 400) {
        newRange -= 50
    } else if (newRange > 160) {
        newRange -= 40
    } else if (newRange > 100) {
        newRange -= 35
    } else {
        newRange -= 30
    }
    return newRange

}

const address = 0x29
const bus = initI2cTofSensor()
const range = readRangeMillimeters(bus, address)
console.log(range)
console.log(adjustRange(range))
closeI2cTofSensor(bus)
