// New version of the file for the piwars robot

let piwars = require('./piwars-utils')

function moveToTarget (baseSpeed, deviation, k) {
    
    const right = Math.floor(baseSpeed + (k * deviation))
    const left = Math.floor(baseSpeed - (k * deviation))

    console.log(`Parameters: baseSpeed=${baseSpeed}, deviation=${deviation}, k=${k}`)
    console.log(`piwars.drive(${right}, ${left})`)
    
    piwars.drive(right, left)
}

function stop () {
    piwars.drive(0, 0)
}

function circle (pwmLeft, pwmRight) {
    piwars.drive(50, 0)
}
