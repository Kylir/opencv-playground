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

function getHSVAtCenter (image) {
    // We will get an image that is 300 x 300
    const processed = cvUtils.processImage(image)
    const hsv = processed.at(150, 150)
    
    return [
        hsv.x,
        hsv.y,
        hsv.z
    ]
}

function applyMasksAndSaveImages (image) {
    const red = cvUtils.applyRedMask(image)
    const blue = cvUtils.applyBlueMask(image)
    const green = cvUtils.applyGreenMask(image)
    const yellow = cvUtils.applyYellowMask(image)

    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'original.jpg'), image)
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

const image = cv.imread(`./images/${images[5].name}`)
const processed = cvUtils.processImage(image)
const hsv = getHSVAtCenter(image)
applyMasksAndSaveImages(processed)
console.log(hsv)

