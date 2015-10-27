1. clone to your local machine
2. create a `top-secret.js` file in the `server` directory
3. add your Forecast and TriMet API keys to the `top-secret.js` file:
      
      
        // top-secret.js
        API_KEY_FORECAST = "asdfasdfasdfasdfsadfsafsd";
        API_KEY_TRIMET = "ADFASDFASDFASDFASDFF";


4. start up the app by typing `meteor` at the command line
5. log in as `joe@schmoe.com`, password is `password`

The app will find your location (lat/lng) using the browser's built-in geolocation features. *You must allow the browser to locate you since there is no manual location selection at this point!* Once you are located, the app will determine if you are at Home, Work, or School. It will then fetch the weather for your location and show you the bus arrivals that you care about at that location.

Locations and bus lines are set in the `fixtures.js` file. Feel free to edit that however you like. **NOTE**: After editing the `fixtures.js` file, kill the meteor app, run `meteor reset` to blow away all stored data, then run `meteor` to start up the app again and bring in the data from the `fixtures.js` file.
