// New version of the file for the piwars robot

const piwars = require('./piwars-utils')

function moveToTarget (baseSpeed, deviation, k, serial) {
    
    const right = Math.floor(baseSpeed + (k * deviation))
    const left = Math.floor(baseSpeed - (k * deviation))

    console.log(`Parameters: baseSpeed=${baseSpeed}, deviation=${deviation}, k=${k}`)
    console.log(`piwars.drive(${right}, ${left})`)
    
    piwars.drive(right, left, serial)
}

function stop (serial) {
    piwars.drive(0, 0, serial)
}

function circle (serial) {
    piwars.drive(70, 0, serial)
}

module.exports = { moveToTarget, stop, circle }
