const express = require('express')
const calib = require('./calibration-utils')

const app = express()
const port = 80

app.use(express.static('public'))

app.get('/masks', (req, res) => {
    const hsv = calib.calibration()
    res.json(hsv)
})

app.listen(port, () => console.log(`Calibration Server started on port ${port}!`))
