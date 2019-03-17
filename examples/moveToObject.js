/* eslint-disable no-console */
const cvUtils = require('../src/opencv-utils')
const robotUtils = require('../src/robot-utils')


function goToColor (colorName) {
    const wCap = cvUtils.openVideo()
    let isColorReached = false
    // eslint-disable-next-line no-constant-condition
    while (!isColorReached) {
        const frame = wCap.read()
        const processed = cvUtils.processImage(frame)
        const cont = cvUtils.findContoursForColor(processed, colorName)
        
        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} objectsdetected.`)
            console.log(`Biggest has area ${big.area}.`)
            
            if (big.area > 500000) {
                console.log('Color Reached! Stop...')
                isColorReached = true
            } else if (big.area > 20) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`Big enough! Recenter! Deviation is ${deviation}`)
                robotUtils.moveToTarget(80, deviation, 0.5)
            } else {
                console.log('Nothing big enough. Stop...')
                robotUtils.stop()
            }
            
        } else {
            console.log('No objects found. Stop...')
            robotUtils.stop()
        }
    }
}

function searchForColor (colorName) {
    const wCap = cvUtils.openVideo()
    let isColorFound = false
    // eslint-disable-next-line no-constant-condition
    while (!isColorFound) {
        const frame = wCap.read()
        const processed = cvUtils.processImage(frame)
        const cont = cvUtils.findContoursForColor(processed, colorName)
        
        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} objectsdetected.`)
            console.log(`Biggest has area ${big.area}.`)
            
            if (big.area > 20) {
                console.log('Big enough! Color found!')
                isColorFound = true
            } else {
                console.log('Nothing big enough. Keep searching...')
                robotUtils.circle(50, -50)
            }
            
        } else {
            console.log('No objects found. Keep searching...')
            robotUtils.circle(50, -50)
        }
    }


}


searchForColor('green')
goToColor('green')
