const cv = require('opencv4nodejs')
const hsvColors = require('../data/colorCalibration.json')

// Colours from https://www.bluetin.io/opencv/opencv-color-detection-filtering-python/
//icol = (36, 202, 59, 71, 255, 255)    // Green
//icol = (18, 0, 196, 36, 255, 255)  // Yellow
//icol = (89, 0, 0, 125, 255, 255)  // Blue
//icol = (0, 100, 80, 10, 255, 255)   // Red

function openVideo () {
    let wCap
    const devicePort = 0
    try {
        wCap = new cv.VideoCapture(devicePort)
    } catch (err) {
        throw new Error('Error: can\'t open the video. Did you load the driver?\nsudo modprobe bcm2835-v4l2\n' )
    }
    return wCap
}

/**
 * Save an image on the disk.
 * @param {String} path where to save
 * @param {*} image The opencv image to save
 */
function saveImage (path, image) {
    try {
        cv.imwrite(path, image)
        return 0
    } catch (err) {
        console.log(err)
        return 1
    }
}

function processImage (image) {
    return image.resize(300, 300).gaussianBlur(new cv.Size(5,5), 0)
}

function applyRedMask (image) {
    // Red is at the upper and lower Hue - we need two masks
    const lowRed_mask_up = new cv.Vec3(...hsvColors.redUp_low)
    const highRed_mask_up = new cv.Vec3(...hsvColors.redUp_high)
    const lowRed_mask_down = new cv.Vec3(...hsvColors.redDown_low)
    const highRed_mask_down = new cv.Vec3(...hsvColors.redDown_high)
    // Find low red and high red and OR the two
    const redUp = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_up, highRed_mask_up)
    const redLow = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_down, highRed_mask_down)
    const red = redUp.bitwiseOr(redLow)
    return red
}

/**
 * Find the contours of the red shapes in an image.
 * Uses two masks.
 * @param {Mat} image
 * @param {boolean} debug optional - wil open the filtered image if set to true
 * @returns {Array} the contours of the red objects
 */
function findRedContours (image) {
    const red = applyRedMask(image)
    // return the contours of the red shapes
    return red.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}


function applyGreenMask (image) {
    const highGreen_mask = new cv.Vec3(...hsvColors.green_high)
    const lowGreen_mask = new cv.Vec3(...hsvColors.green_low)
    const green = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowGreen_mask, highGreen_mask)
    return green
}

/**
 * Find the contours of the Green shapes in an image.
 * @param {Mat} image
 * @param {boolean} debug Optional parameter. if set to true it will try to open the result of the filter
 * @returns {Array} the contours of the Green objects
 */
function findGreenContours (image) {
    const green = applyGreenMask(image)
    // return the contours of the shapes
    return green.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}


function applyBlueMask (image) {
    const highBlue_mask = new cv.Vec3(...hsvColors.blue_high)
    const lowBlue_mask = new cv.Vec3(...hsvColors.blue_low)
    const blue = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowBlue_mask, highBlue_mask)
    return blue
}

/**
 * Find the contours of the blue shapes in an image.
 * @param {Mat} image
 * @param {boolean} debug Optional parameter. if set to true it will try to open the result of the filter
 * @returns {Array} the contours of the blue objects
 */
function findBlueContours (image) {
    const blue = applyBlueMask(image)
    // return the contours of the shapes
    return blue.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}


function applyYellowMask (image) {
    const highYellow_mask = new cv.Vec3(...hsvColors.yellow_high)
    const lowYellow_mask = new cv.Vec3(...hsvColors.yellow_low)
    const yellow = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowYellow_mask, highYellow_mask)
    return yellow
}

/**
 * Find the contours of the Yellow shapes in an image.
 * @param {Mat} image
 * @param {boolean} debug Optional parameter. if set to true it will try to open the result of the filter
 * @returns {Array} the contours of the Yellow objects
 */
function findYellowContours (image) {
    const yellow = applyYellowMask(image)
    // return the contours of the shapes
    return yellow.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}

/**
 * The generic function to call the color specific ones
 * @param {*} image The image to analyze
 * @param {String} colorName The name of the color (red, blue, yellow, green)
 * @param {Boolean} debug set it to true to display the images of the contours
 */
function findContoursForColor (image, colorName) {
    switch (colorName) {
        case 'red': return findRedContours(image)
        case 'blue': return findBlueContours(image)
        case 'yellow': return findYellowContours(image)
        case 'green': return findGreenContours(image)
        default: break;
    }
    return null;
}

/**
 * Browse a list of contour and finds the one with the biggest area
 * @param {Array of Contour} contours
 * @returns {Contour} the contour with the biggest area 
 */
function findBiggestArea (contours) {
    return contours.reduce((biggest, contour) => {
        if (contour.area > biggest.area) {
            return contour
        } else {
            return biggest
        }
    })
}

/**
 * Find the center point of a contour
 * @param {Contour} contour
 * @returns {cX, cY} the coordinates of the center 
 */
function findCentre (contour) {
    const m = contour.moments()
	const cX = Math.round(m.m10 / m.m00)
    const cY = Math.round(m.m01 / m.m00)
    return {cX, cY}
}

/**
 * return the difference between the shape and the center of the image 
 * @param {number} xShape
 * @param {number} imageWidth
 */
function xAxisDeviation (xShape, imageWidth) {
    return (imageWidth/2 - xShape)
}

// export all the utility functions
module.exports = {
    openVideo,
    processImage,
    saveImage,
    applyBlueMask,
    applyGreenMask,
    applyRedMask,
    applyYellowMask,
    findRedContours,
    findGreenContours,
    findBlueContours,
    findYellowContours,
    findContoursForColor,
    findBiggestArea,
    findCentre,
    xAxisDeviation
}

