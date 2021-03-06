/* eslint-disable no-console */
const cvUtils = require('../src/opencv-utils')
const robotUtils = require('../src/robot-utils')

// DEMO FOR VIDEO CAPTURE
function demoRobotMove () {
    const wCap = cvUtils.openVideo()
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const frame = wCap.read()
        const processed = cvUtils.processImage(frame)
        //const cont = cvUtils.findRedContours(processed)
        const cont = cvUtils.findBlueContours(processed)
        
        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} objects. Biggest at (${big.cX}, ${big.cY}) with area ${big.area}.`)
            if (big.area > 5) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`Big enough! Recenter! Deviation is ${deviation}`)
                robotUtils.recenter(deviation)
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

demoRobotMove()
