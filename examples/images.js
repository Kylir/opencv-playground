const cv = require('opencv4nodejs')
const utils = require('../src/utils')

// DEMO for static images
// Find the biggest red-ish shape and highlight its center
function demoImage (image) {
    const processed = utils.processImage(image)
    const cont = utils.findRedContours(image)
    const big = utils.findBiggestArea(cont)
    const c = utils.findCentre(big)
    
    processed.drawCircle(new cv.Point2(c.cX, c.cY), 7, new cv.Vec3(255,255,255))
    cv.imshowWait('Center 1', processed)
}

const image = cv.imread('./images/shapes_black_background.jpg')
const image2 = cv.imread('./images/shapes.jpg')
const cup = cv.imread('./images/me_and_a_cup.jpg')

demoImage(image)
demoImage(image2)
demoImage(cup)
