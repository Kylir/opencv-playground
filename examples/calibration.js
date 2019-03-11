const cv = require('opencv4nodejs')
const utils = require('../src/opencv-utils')

// DEMO for static images
// Find the biggest red-ish shape and highlight its center
function calibration (image, name) {
    // We will get an image that is 300 x 300
    const center = new cv.Point2(150, 150)
    const processed = utils.processImage(image)
    const hsv = processed.at(150, 150)
    
    console.log(`${name} - HSV values at center: ${JSON.stringify(hsv)}`)
    processed.drawCircle(center, 7, new cv.Vec3(255,255,255))
    cv.imshowWait(name, processed)
}

const images = [
    'blue_electric.jpg',
    'green_sherwood.jpg',
    'red_classic.jpg',
    'yellow_goldenrays.jpg'
]

images.forEach((name) => {
    const image = cv.imread(`./images/${name}`)
    calibration(image, name)
})
