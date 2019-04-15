# Hue Sensor

Currently, there is no Philips Hue solution to monitor the state history of a Philips Hue device using the native [Philips Hue APIs](https://developers.meethue.com/). 

This project will allow you to log and monitor the state and command history of your local Philips Hue devices in the cloud. 

Hue Sensor is a service that polls the state of a local hue motion sensor and logs the state at a periodic interval. In this sample, I am logging the state of the motion sensor `every 15 seconds` and writing the value to a log file. The service also exposes an api endpoint `GET /sensor/logs` that returns the logs for that sensor. 

## How to run the sample

### Prerequisites 
1. You must have [Node.js](https://nodejs.org/en/download/) installed
2. You must be on the same network as the Philips Hue Bridge. Get the `IP address` of your hue bridge by going to the Phillips Hue mobile app and go to **Settings > Hue Bridges > Tap the info icon**. The IP address should be listed there.
3. Get a `username` that is whitelisted for your API calls. If you do not already have one, get a username by sending a POST request to `http://{BRIDGE_IP_ADDRESS}/api` with the following JSON payload in the body: 

        {"devicetype": "HueLights#API"}
        
     You will then need to press the link button on your hue bridge. Then, re-send the post request. You should see a username returned in the response. That will be the username we will use for all the API requests.

    NOTE: You can use this interactive REST client to perform the POST requests `http://{BRIDGE_IP_ADDRESS}/debug/clip.html`

### Running the sample
1. Clone the repository `git clone https://github.com/amusse/HueSensor.git`
2. Navigate to repo root directory `HueSensor/` and run:  `npm install`
3. In the file `server.js` set the `BRIDGE_IP_ADDRESS` variable to the IP address of your Philips Hue Bridge
4. In the same file, set the `HUE_USERNAME` variable to a username registered for the bridge you are using
5. Get your sensor ID by making a GET request to `http://{BRIDGE_IP_ADDRESS}/api/{HUE_USERNAME}/sensors`. Your sensor ID is likely a 1 or 2 digit number (NOTE it is **NOT** the `uniqueId`, I know, confusing...). Replace the `MOTION_SENSOR_ID` variable value with your sensor id. 
5. Save the file and run `npm start` from the root repository directory. You should see an output like this: 
 
        HueLogs $ npm start

        > huelogs@1.0.0 start {YOUR_PATH}/HueLogs
        > node server.js

        HueSensor listening on port 3000...
        
 6. You should also see that a file named `HueSensor.log` was created
 7. Now, the next time you walk past your hue motion sensor you should see an entry of that change in state in the log file. Here's an example of that entry:
 
        [2019-04-14T21:15:04.271] [ERROR] HueSensor - Room sensor State: true, LastUpdated: Sun Apr 14 2019 21:14:58 GMT-0700 (PDT)
        
 8. Also, you can go to `localhost:3000/sensor/logs` and see the logs outputted there too.
 
 
 ### Making your service public
 
 You can make your service public very quickly for free using a tool called [ngrok](https://ngrok.com/). Ngrok creates a secure tunnel to your local web server. 
 
 1. Run this command in your repository root directory `npm install -g ngrok`. If you run into an access issue run the command in an elevated prompt as sudo or as an administrator (Windows). 
 2. Run the sample project in one terminal window `npm start` and in another terminal window run `ngrok http 3000`.
 3. You should now be able to access your api publically in the format `http://{randomCharacters}.ngrok.io/sensor/logs`
 4. **Beware that there is no authentication here, so anyone who has access to that public url can see your sensor logs**
 
