// New version of the file for the piwars robot

const piwars = require('./piwars-utils')

function moveToTarget (baseSpeed, deviation, k, serial) {
    
    //const right = Math.floor(baseSpeed + (k * deviation))
    //const left = Math.floor(baseSpeed - (k * deviation))

    let right
    let left

    if (deviation > 10) {
        right = baseSpeed
        left = baseSpeed - 10
    } else if (deviation < -10) {
        right = baseSpeed -10
        left = baseSpeed
    } else {
        right = baseSpeed
        left = baseSpeed
    }

    console.log(`Parameters: baseSpeed=${baseSpeed}, deviation=${deviation}, k=${k}`)
    console.log(`piwars.drive(${right}, ${left})`)
    
    piwars.drive(left, right, serial)
}

function stop (serial) {
    piwars.drive(0, 0, serial)
}

function circle (serial) {
    console.log('Circling...')
    piwars.drive(50, 0, serial)
}

function circleOpposite (serial) {
    console.log('Circling in the opposite direction...')
    piwars.drive(0, 50, serial)
}

function back(serial) {
    console.log('Going back!')
    piwars.drive(-30, -30, serial)
}

module.exports = { moveToTarget, stop, circle, circleOpposite, back }
