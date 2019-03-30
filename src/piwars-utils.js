/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable max-params */

const LEFT_SERVO = 0
const RIGHT_SERVO = 1
const TREAD = 150.0
const WHEELBASE = 160.0

// first one is right 
// right servo greater is counter clockwise
const servo_calibration_data = [
    {	
        midpos: 310,
        stepsize: 1.7,
        max: 500,
        min: 100
    },
    {
        midpos: 310,
        stepsize: 1.7,
        max: 500,
        min: 100
    }
]

function uart_send_bytes (buf, serial) {
    const b = Buffer.from(buf)
    serial.write(b)
}

function calc_checksum (checksum, value) {
    checksum += value;
    while (checksum > 255) {
        checksum -= 256;
    }
    return checksum;
}

function add_byte (buf, value) {
    switch (value) {
        case 0xa5:
            buf.push(0xa4);
            buf.push(0x01);
            break;
        case 0xa4:
            buf.push(0xa4);
            buf.push(0x00);
            break;
        default:
            buf.push(value);
            break;
    }
}

function send_cmd (cmd, serial) {
    let data = [],
        cs = 0;

    data.push(0xa5);
    data.push(cmd.length);

    for (let i = 0; i < cmd.length; i++) {
        add_byte(data, cmd[i]);
        cs = calc_checksum(cs, cmd[i]);
    }
    add_byte(data, cs);

    console.log(`serial data: ${data}`)

    uart_send_bytes(data, serial);
}

function servo_deg_to_val (servo_id, deg) {
    const calib = servo_calibration_data[servo_id]
    let value = Math.round(calib.midpos + deg * calib.stepsize);
    
    if (value > calib.max) {
        value = calib.max;
    }
    if (value < calib.min) {
        value = calib.min;
    }
    return value;
}

function set_motors (angle_right, angle_left, speed_left, speed_right, serial) {
    const servo_left_value = servo_deg_to_val(LEFT_SERVO, angle_left),
        servo_right_value = servo_deg_to_val(RIGHT_SERVO, angle_right);

    send_cmd([
        0x70,                       // command
        servo_left_value >> 8,        // left servo value
        servo_left_value & 0xff,
        servo_right_value >> 8,       // right servi value
        servo_right_value & 0xff,
        (speed_right < 0) ? (-speed_right) | 0x80 : speed_right,
        (speed_left < 0) ? (-speed_left) | 0x80 : speed_left,
        0,
        0
    ], serial);
}

function get_radius_from_diff (diff) {
    if (diff === 1.0) {
        return -1;
    }
    return Math.round(-TREAD / (1.0 - 1.0 / diff));
}

function get_inner_angle (R) {
    const val = WHEELBASE / R;
    return (R === -1) ? 0 : Math.round(180.0 * Math.atan(val) / Math.PI);
}

function get_outer_angle (R) {
    const val = WHEELBASE / (R + TREAD);
    return (R === -1) ? 0 : Math.round(180.0 * Math.atan(val) / Math.PI);
}

function drive (speed_right, speed_left, serial) {

    // right and left to be in teh interval -127 to +127
    if (speed_right < -127) {
        speed_right = -127
    }
    if (speed_right > 127) {
        speed_right = 127
    }
    if (speed_left < -127) {
        speed_left = -127
    }
    if (speed_left > 127) { 
        speed_left = 127
    }

    const turning_direction = (speed_left > speed_right) ? 1 : -1;
    let step_diff;

    if (speed_left < speed_right) {
        step_diff = (speed_right) ? speed_left / speed_right : 0.0;
    } else {
        step_diff = (speed_left) ? speed_right / speed_left : 0.0;
    }

    const turning_radius = get_radius_from_diff(step_diff);

    const inner_angle = get_inner_angle(turning_radius);
    const outer_angle = get_outer_angle(turning_radius);

    const angle_left = (turning_direction === 1) ? outer_angle : -inner_angle;
    const angle_right = (turning_direction === 1) ? inner_angle : -outer_angle;

    console.log(`Servo ${angle_left}, ${angle_right}`);
    console.log(`Speed ${speed_left}, ${speed_right}`);

    set_motors(angle_left, angle_right, speed_left, speed_right, serial);
}


module.exports = {
    uart_send_bytes,
    calc_checksum,
    add_byte,
    send_cmd,
    set_motors,
    servo_deg_to_val,
    get_radius_from_diff,
    get_inner_angle,
    get_outer_angle,
    drive
};