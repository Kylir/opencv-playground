const cv = require('opencv4nodejs')

// Colours from https://www.bluetin.io/opencv/opencv-color-detection-filtering-python/
//icol = (36, 202, 59, 71, 255, 255)    // Green
//icol = (18, 0, 196, 36, 255, 255)  // Yellow
//icol = (89, 0, 0, 125, 255, 255)  // Blue
//icol = (0, 100, 80, 10, 255, 255)   // Red

export function processImage (image) {
    return image.resize(300, 300).gaussianBlur(new cv.Size(5,5), 0)
}

/**
 * Find the contours of the red shapes in an image.
 * Uses two masks.
 * @param {Mat} image
 * @param {boolean} debug optional - wil open the filtered image if set to true
 * @returns {Array} the contours of the red objects
 */
export function findRedContours (image, debug) {
    // Red is at the upper and lower Hue - we need two masks
    const lowRed_mask_up = new cv.Vec3(170, 100, 100)
    const highRed_mask_up = new cv.Vec3(180, 255, 255)
    const lowRed_mask_down = new cv.Vec3(0, 100, 100)
    const highRed_mask_down = new cv.Vec3(15, 255, 255)
    // Find low red and high red and OR the two
    const redUp = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_up, highRed_mask_up)
    const redLow = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_down, highRed_mask_down)
    const red = redUp.bitwiseOr(redLow)

    // DEBUG to see the red selection.
    if (debug) {
        cv.imshowWait('Filered image', red)
    }
    // return the contours of the red shapes
    return red.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}

/**
 * Find the contours of the Green shapes in an image.
 * @param {Mat} image
 * @param {boolean} debug Optional parameter. if set to true it will try to open the result of the filter
 * @returns {Array} the contours of the Green objects
 */
export function findGreenContours (image, debug) {
    const highGreen_mask = new cv.Vec3(71, 255, 255)
    const lowGreen_mask = new cv.Vec3(36, 202, 59)
    const green = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowGreen_mask, highGreen_mask)
    
    // DEBUG to see the filter.
    if (debug) {
        cv.imshowWait('Filered image', green)
    }
    
    // return the contours of the shapes
    return green.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}

/**
 * Find the contours of the blue shapes in an image.
 * @param {Mat} image
 * @param {boolean} debug Optional parameter. if set to true it will try to open the result of the filter
 * @returns {Array} the contours of the blue objects
 */
export function findBlueContours (image, debug) {
    const highBlue_mask = new cv.Vec3(125, 255, 255)
    const lowBlue_mask = new cv.Vec3(89, 0, 0)
    const blue = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowBlue_mask, highBlue_mask)
    
    // DEBUG to see the filter.
    if (debug) {
        cv.imshowWait('Filered image', blue)
    }
    
    // return the contours of the shapes
    return blue.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}

/**
 * Find the contours of the Yellow shapes in an image.
 * @param {Mat} image
 * @param {boolean} debug Optional parameter. if set to true it will try to open the result of the filter
 * @returns {Array} the contours of the Yellow objects
 */
export function findYellowContours (image, debug) {
    const highYellow_mask = new cv.Vec3(36, 255, 255)
    const lowYellow_mask = new cv.Vec3(18, 0, 196)
    const yellow = image.cvtColor(cv.COLOR_BGR2HSV).inRange(lowYellow_mask, highYellow_mask)
    
    // DEBUG to see the filter.
    if (debug) {
        cv.imshowWait('Filered image', yellow)
    }
    
    // return the contours of the shapes
    return yellow.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
}


/**
 * Browse a list of contour and finds the one with the biggest area
 * @param {Array of Contour} contours
 * @returns {Contour} the contour with the biggest area 
 */
export function findBiggestArea (contours) {
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
export function findCentre (contour) {
    const m = contour.moments()
	const cX = Math.round(m.m10 / m.m00)
    const cY = Math.round(m.m01 / m.m00)
    return {cX, cY}
}

/**
 * return the difference between the 
 * @param {number} xShape
 * @param {number} imageWidth
 */
export function xAxisDeviation (xShape, imageWidth) {
    return (imageWidth/2 - xShape)
}