/* eslint-disable no-console */
const cvUtils = require('../src/opencv-utils')

// DEMO FOR VIDEO CAPTURE
function demoVideo () {
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
                console.log(`${cont.length} red objects. Biggest at (${c.cX}, ${c.cY}) with area ${big.area}`)
            } else {
                console.log('Nothing big enough')
            }
            
        } else {
            console.log('No red objects found...')
        }
    }
}

demoVideo()
