/* eslint-disable no-console */
const cvUtils = require('../src/opencv-utils')
//const robotUtils = require('../src/robot-utils')


function demoRobotMove (colorName) {
    const wCap = cvUtils.openVideo()
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const frame = wCap.read()
        const processed = cvUtils.processImage(frame)
        //const cont = cvUtils.findRedContours(processed)
        const cont = cvUtils.findContoursForColor(processed, colorName)
        
        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} objectsdetected.`)
            console.log(`Big: ${JSON.stringify(big)}`)
            console.log(`Biggest at (${big.cX}, ${big.cY}) with area ${big.area}.`)
            
            if (big.area > 500000) {
                console.log('Too big! Stop...')
            } else if (big.area > 200) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`Big enough! Recenter! Deviation is ${deviation}`)
                //robotUtils.moveToTarget(100, deviation, 0.2)
            } else {
                console.log('Nothing big enough. Stop...')
                //robotUtils.stop()
            }
            
        } else {
            console.log('No objects found. Stop...')
            //robotUtils.stop()
        }
    }
}

demoRobotMove('red')
