const cv = require('opencv4nodejs')

// Colours from https://www.bluetin.io/opencv/opencv-color-detection-filtering-python/
//icol = (36, 202, 59, 71, 255, 255)    // Green
//icol = (18, 0, 196, 36, 255, 255)  // Yellow
//icol = (89, 0, 0, 125, 255, 255)  // Blue
//icol = (0, 100, 80, 10, 255, 255)   // Red

function findRedContours (image) {
    // Red is at the upper and lower Hue - we need two masks
    const lowRed_mask_up = new cv.Vec3(170, 100, 100)
    const highRed_mask_up = new cv.Vec3(180, 255, 255)
    const lowRed_mask_down = new cv.Vec3(0, 100, 100)
    const highRed_mask_down = new cv.Vec3(15, 255, 255)
    // Resize and blur
    const processed = image.resize(300, 300).gaussianBlur(new cv.Size(5,5), 0)
    // Find low red and high red and OR the two
    const redUp = processed.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_up, highRed_mask_up)
    const redLow = processed.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_down, highRed_mask_down)
    const red = redUp.bitwiseOr(redLow)

    // DEBUG to see the red selection.
    //cv.imshowWait('red', red)

    // return the contours of the red shapes
    return red.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
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

/*
// DEMO for static images
// Find the biggest red-ish shape and highlight its center
function demoImage (image) {
    const cont = findRedContours(image)
    const big = findBiggestArea(cont)
    const c = findCentre(big)
    
    const processed = image.resize(300, 300).gaussianBlur(new cv.Size(5,5), 0)
    processed.drawCircle(new cv.Point2(c.cX, c.cY), 7, new cv.Vec3(255,255,255))
    cv.imshowWait('Center 1', processed)
}

const image = cv.imread('./images/shapes_black_background.jpg')
const image2 = cv.imread('./images/shapes.jpg')
const cup = cv.imread('./images/me_and_a_cup.jpg')

demoImage(image)
demoImage(image2)
demoImage(cup)
*/

// DEMO FOR VIDEO CAPTURE
function demoVideo () {
    const devicePort = 0
    try {
        const wCap = new cv.VideoCapture(devicePort)
    } catch (err) {
        throw new Error('Error: can\'t open the video. Did you load the driver?\nsudo modprobe bcm2835-v4l2' )
    }
    while (true) {
        const frame = wCap.read()
        const cont = findRedContours(frame)

        if (cont && (cont.length > 0)) {    
            const big = findBiggestArea(cont)
            if (big.area > 0.1) {
                const c = findCentre(big)
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