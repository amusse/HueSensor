const express = require('express')
const request = require("request-promise");
const fs = require('fs');
const log4js = require('log4js');

const app = express();

const PORT = 3000;
const BRIDGE_IP_ADDRESS = ""; // Enter your Hue Bridge IP address here
const HUE_BASE_URL = `http://${BRIDGE_IP_ADDRESS}/api`;
const HUE_USERNAME = ""; // Enter your Hue Username here
const MOTION_SENSOR_ID = "13"; // Replace this with your motion sensor ID
const PACIFIC_TIME_OFFSET = 7;
const SENSOR_LOG_FILENAME = 'HueSensor.log'
const MINUTES = 0.25;
const INTERVAL = MINUTES * 60 * 1000;

var timer;

log4js.configure({
    appenders: { HueSensor: {type: 'file', filename: SENSOR_LOG_FILENAME}},
    categories: { default: { appenders: ['HueSensor'], level: 'error' } }
});
  
const logger = log4js.getLogger('HueSensor'); 

app.get('/sensor/logs', (req, res) => {
    fs.readFile(SENSOR_LOG_FILENAME, 'utf8', function(err, data) {  
        if (err) {
            res.send(err);
        } else {
            res.header("Content-Type",'text/plain');
            res.send(data);
        }
    });
})

app.listen(PORT, () => {
    console.log(`HueSensor listening on port ${PORT}...`);
    getSensorLogs();
    timer = setInterval(getSensorLogs, INTERVAL);
});

function getSensorLogs() {
    const url = `${HUE_BASE_URL}/${HUE_USERNAME}/sensors/${MOTION_SENSOR_ID}`;
    request.get(url).then(response => {
        var sensor;
        try {
            sensor = JSON.parse(response);
        } catch (error) {
            logger.error("Error parsing response...");
        }
        if (sensor && sensor.state) {
            const lastUpdated = new Date(sensor.state.lastupdated);
            lastUpdated.setHours(lastUpdated.getHours() - PACIFIC_TIME_OFFSET);
            if (sensor.state.presence) {
                logger.error(`${sensor.name} State: ${sensor.state.presence}, LastUpdated: ${lastUpdated}`);
            } else {
                logger.info(`${sensor.name} State: ${sensor.state.presence}, LastUpdated: ${lastUpdated}`);
            }
        } else {
            console.log(sensor);
            clearInterval(timer);
        }
    });
}