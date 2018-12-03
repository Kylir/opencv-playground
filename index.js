const cv = require('opencv4nodejs')

const image = cv.imread('./images/shapes_black_background.jpg')
const image2 = cv.imread('./images/shapes.jpg')

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

    // We want to select only the red shapes
    const redUp = processed.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_up, highRed_mask_up)
    const redLow = processed.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_down, highRed_mask_down)
    const red = redUp.bitwiseOr(redLow)

    // DEBUG
    cv.imshowWait('resized and blurred', processed)
    cv.imshowWait('red mask', red)

    // find contours in the processed image
    let contours = red.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

    // DEBUG
    console.log(`Found ${contours.length} contours:`)
    contours.map(c => {
        console.log(`${c.numPoints} points with area ${c.area}`)
    })

    return contours
}


findRedContours(image)
findRedContours(image2)
