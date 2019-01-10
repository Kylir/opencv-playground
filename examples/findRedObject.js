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
        const cont = cvUtils.findRedContours(processed)

        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            if (big.area > 0.1) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`${cont.length} red objects. Biggest at (${c.cX}, ${c.cY}) with area ${big.area}. Deviation to center ${deviation}`)
                //let {leftPwm, rightPwm} = robotUtils.computePwmWithDeviation(deviation, 50)
                //robotUtils.moveForward(leftPwm, rightPwm)
                robotUtils.moveForward(50, 50)
            } else {
                console.log('Nothing big enough')
                robotUtils.circle(100, 100)
            }
            
        } else {
            console.log('No red objects found...')
            robotUtils.circle(100, 100)
        }
    }
}

demoRobotMove()
