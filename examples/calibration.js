const path = require('path')
const cvUtils = require('../src/opencv-utils')
const cv = require('opencv4nodejs')

// Goal is to have two sets of functionalities:
// + Retrieve the HSV color of the center of the frame
// + Set this as the new color in the color definition
// + Display the processed image using a color definition

/**
 * Returns a frame from the video
 */
function getImageFromCamera () {
    const wCap = cvUtils.openVideo()
    return wCap.read()
}

function calibration (image, name) {
    // We will get an image that is 300 x 300
    const center = new cv.Point2(150, 150)
    const processed = cvUtils.processImage(image)
    const hsv = processed.at(150, 150)
    
    console.log(`${name} - HSV values at center: ${JSON.stringify(hsv)}`)
    processed.drawCircle(center, 7, new cv.Vec3(255,255,255))

}

function applyMasksAndSaveImages (image) {
    const red = cvUtils.applyRedMask(image)
    const blue = cvUtils.applyBlueMask(image)
    const green = cvUtils.applyGreenMask(image)
    const yellow = cvUtils.applyYellowMask(image)

    cv.imshowWait('red', red)
    cv.imshowWait('blue', blue)
    cv.imshowWait('green', green)
    cv.imshowWait('yellow', yellow)

    console.log(path.resolve(__dirname, '..', 'public', 'red.jpg'))

    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'red.jpg'), red)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'blue.jpg'), blue)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'green.jpg'), green)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'yellow.jpg'), yellow)
}


const images = [
    {name: 'blue_electric.jpg', color: 'blue'},
    {name: 'green_sherwood.jpg', color: 'green'},
    {name: 'red_classic.jpg', color: 'red'},
    {name: 'yellow_goldenrays.jpg', color: 'yellow'},
    {name: 'shapes_black_background.jpg', color: 'red'},
    {name: 'shapes.jpg', color: 'red'},
    {name: 'me_and_a_cup.jpg', color: 'red'}
]

const image = cv.imread(`./images/${images[4].name}`)
const processed = cvUtils.processImage(image)
applyMasksAndSaveImages(processed)
