const cv = require('opencv4nodejs')
const utils = require('../src/utils')

// DEMO FOR VIDEO CAPTURE
function demoVideo () {
    let wCap
    const devicePort = 0
    try {
        wCap = new cv.VideoCapture(devicePort)
    } catch (err) {
        throw new Error('Error: can\'t open the video. Did you load the driver?\nsudo modprobe bcm2835-v4l2' )
    }
    while (true) {
        const frame = wCap.read()
        const processed = utils.processImage(frame)
        const cont = utils.findRedContours(processed)

        if (cont && (cont.length > 0)) {
            const big = utils.findBiggestArea(cont)
            if (big.area > 0.1) {
                const c = utils.findCentre(big)
                console.log(`${cont.length} red objects. Biggest at (${c.cX}, ${c.cY}) with area ${big.area}`)
            } else {
                console.log('Nothing big enough')
            }
            
        } else {
            console.log(`No red objects found...`)
        }
    }
}

demoVideo()