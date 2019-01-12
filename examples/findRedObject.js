/* eslint-disable no-console */
const cvUtils = require('../src/opencv-utils')
//const robotUtils = require('../src/robot-utils')

// DEMO FOR VIDEO CAPTURE
function demoRobotMove () {
    const wCap = cvUtils.openVideo()
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const frame = wCap.read()
        const processed = cvUtils.processImage(frame)
        const cont = cvUtils.findRedContours(processed)

        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} red objects. Biggest at (${big.cX}, ${big.cY}) with area ${big.area}.`)
            if (big.area > 1) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`Big enough! Deviation to center is ${deviation}`)
                //robotUtils.moveForward(50, 50)
            } else {
                console.log('Nothing big enough. Circling...')
                //robotUtils.circle(50, 50)
            }
            
        } else {
            console.log('No red objects found. Circling...')
            //robotUtils.circle(50, 50)
        }
    }
}

demoRobotMove()
