How it should work:  
- on app launch, get the location
- whenever the location has changed, fetch the weather for that new location
  - but don't actually change the lat/lng if it hasn't changed enough since it was last saved
- fetching weather happens on the server side with a Meteor Method
  - first check to see if there's recent weather data for that location saved in the server cache
  - also, only actually call out to Forecast.io if it's been a while since the last call
- getting weather data back then saves the relevant parts to Session vars
- template helpers return the values of those weather Session vars
