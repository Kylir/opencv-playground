const cvUtils = require('../src/opencv-utils')
const robotUtils = require('../src/robot-utils')

// DEMO FOR VIDEO CAPTURE
function demoRobotMove () {
    let wCap = cvUtils.openVideo()
    while (true) {
        const frame = wCap.read()
        const processed = cvUtils.processImage(frame)
        const cont = cvUtils.findRedContours(processed)

        if (cont && (cont.length > 0)) {
            const big = cvUtils.findBiggestArea(cont)
            console.log(`${cont.length} red objects. Biggest at (${c.cX}, ${c.cY}) with area ${big.area}.`)
            if (big.area > 0.1) {
                const c = cvUtils.findCentre(big)
                const deviation = cvUtils.xAxisDeviation(c.cX, 300)
                console.log(`Big enough! Deviation to center is ${deviation}`)
                //robotUtils.moveForward(50, 50)
            } else {
                console.log('Nothing big enough. Circling...')
                //robotUtils.circle(50, 50)
            }
            
        } else {
            console.log(`No red objects found...`)
            //robotUtils.circle(50, 50)
        }
    }
}

demoRobotMove()