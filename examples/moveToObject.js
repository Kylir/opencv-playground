/* eslint-disable max-params */
/* eslint-disable no-console */
const cvUtils = require('../src/opencv-utils')
const robotUtils = require('../src/robot-utils')
const tof = require('../src/tof-utils')
const raspi = require('raspi')
const Serial = require('raspi-serial').Serial

function goToColor (colorName, video, bus, address, serial) {
    console.log(`Starting to go to color ${colorName}`)
    let isColorReached = false
    // eslint-disable-next-line no-constant-condition
    while (!isColorReached) {
        const frame = video.read()
        const processed = cvUtils.processImage(frame)
        const cont = cvUtils.findContoursForColor(processed, colorName)
        
        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} objectsdetected.`)
            console.log(`Biggest has area ${big.area}.`)
            const dist = tof.readNTimes(10, bus, address)
            console.log(`Distance to target is ${dist}mm.`)
            if (dist < 100 && dist !== 0) {
                console.log('Color Reached! Stop...')
                isColorReached = true
            } else if (big.area > 20) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`Big enough! Recenter! Deviation is ${deviation}`)
                robotUtils.moveToTarget(30, deviation, 0.5, serial)
            } else {
                console.log('Nothing big enough. Stop...')
                robotUtils.stop(serial)
            }
            
        } else {
            console.log('No objects found. Stop...')
            robotUtils.stop(serial)
        }
    }
}

function searchForColor (colorName, video, serial) {
    console.log(`Starting to search for color ${colorName}`)
    let isColorFound = false
    // eslint-disable-next-line no-constant-condition
    while (!isColorFound) {
        const frame = video.read()
        const processed = cvUtils.processImage(frame)
        const cont = cvUtils.findContoursForColor(processed, colorName)
        
        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} objectsdetected.`)
            console.log(`Biggest has area ${big.area}.`)
            
            if (big.area > 200) {
                console.log('Big enough! Color found!')
                robotUtils.stop(serial)
                isColorFound = true
            } else {
                console.log('Nothing big enough. Keep searching...')
                robotUtils.circle(100, 100, serial)
            }
            
        } else {
            console.log('No objects found. Keep searching...')
            robotUtils.circle(100, 100, serial)
        }
    }
}

// Open the video feed
const wCap = cvUtils.openVideo()
// Init the tof sensor
const address = 0x29
const busNumber = 1
const bus = tof.initI2cTofSensor(busNumber, address)

const firstDist = tof.readNTimes(100, bus, address)
console.log(`First distance is ${firstDist}`)

raspi.init(() => {
    const serial = new Serial({portId: '/dev/ttyS0'})
    
    serial.open(() => {
    
        serial.on('data', (data) => {
            process.stdout.write(data)
        })

        // Red, Blue, Yellow and, finally, Green.
        searchForColor('red', wCap, serial)
        goToColor('red', wCap, bus, address, serial)

        searchForColor('blue', wCap, serial)
        goToColor('blue', wCap, bus, address, serial)

        searchForColor('yellow', wCap, serial)
        goToColor('yellow', wCap, bus, address, serial)

        searchForColor('green', wCap, serial)
        goToColor('green', wCap, bus, address, serial)

    });
})

setTimeout(() => {
    robotUtils.stop()
    console.log('Terminating.')
}, 1000);
