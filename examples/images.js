const cv = require('opencv4nodejs')
const utils = require('../src/opencv-utils')

// DEMO for static images
// Find the biggest red-ish shape and highlight its center
function demoImage (image, color) {
    const processed = utils.processImage(image)
    const cont = utils.findContoursForColor(processed, color)
    const big = utils.findBiggestArea(cont)
    const c = utils.findCentre(big)
    
    processed.drawCircle(new cv.Point2(c.cX, c.cY), 7, new cv.Vec3(255,255,255))
    cv.imshowWait('Center 1', processed)
}

const images = [
    {name: 'blue_electric.jpg', color: 'red'},
    {name: 'green_sherwood.jpg', color: 'green'},
    {name: 'red_classic.jpg', color: 'red'},
    {name: 'yellow_goldenrays.jpg', color: 'yellow'},
    {name: 'shapes_black_background.jpg', color: 'red'},
    {name: 'shapes.jpg', color: 'red'},
    {name: 'me_and_a_cup.jpg', color: 'red'}
]

images.forEach((obj) => {
    const image = cv.imread(`./images/${obj.name}`)
    demoImage(image, obj.color)
})

