const path = require('path')
const cvUtils = require('./opencv-utils')
const cv = require('opencv4nodejs')

// Goal is to have two sets of functionalities:
// + Retrieve the HSV color of the center of the frame
// + Set this as the new color in the color definition
// + Display the processed image using a color definition

/**
 * Returns a frame from the video
 */
function getImageFromCamera () {
    const video = cvUtils.openVideo()
    const image = video.read()
    video.release()
    return image
    //return cv.imread('./images/blue_electric.jpg')
}

function getHSVAtCenter (image) {
    // image is 300 x 300
    const hsv = image.at(150, 150)
    return [
        hsv.x,
        hsv.y,
        hsv.z
    ]
}

function applyMasksAndSaveImages (image) {
    // mark the center
    image.drawCircle(new cv.Point2(150, 150), 7, new cv.Vec3(255,255,255))
    // Apply masks
    const red = cvUtils.applyRedMask(image)
    const blue = cvUtils.applyBlueMask(image)
    const green = cvUtils.applyGreenMask(image)
    const yellow = cvUtils.applyYellowMask(image)
    // save the results
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'original.jpg'), image)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'red.jpg'), red)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'blue.jpg'), blue)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'green.jpg'), green)
    cvUtils.saveImage(path.resolve(__dirname, '..', 'public', 'yellow.jpg'), yellow)
}

function calibration () {
    const image = getImageFromCamera()
    const processed = cvUtils.processImage(image)
    const hsv = getHSVAtCenter(processed)
    applyMasksAndSaveImages(processed)
    return hsv
}

module.exports = {calibration}
