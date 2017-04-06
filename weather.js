// Weather Functionality
var weatherSetup = function() {
	// Self Referentiation
	var self = this;
	
	//Dependencies
	var Client = require("ibmiotf");

	// Variables for Limiting the Quantity of Weather Based Information Responses
	var timesGetWeatherCalled = 0;
	self.weatherIntervalID = 0;

	// IOT Device Configuration and Connection
	var config = {
		"org" : "6g69mu",
		"id" : "Weather-ID",
		"domain": "internetofthings.ibmcloud.com",
		"type" : "weather-iot",
		"auth-method" : "token",
		"auth-token" : "7048419193"
	};
	var deviceClient = new Client.IotfDevice(config);
	deviceClient.connect();


	// When the device connects
	deviceClient.on("connect", function() {
		console.log("Device connected!");
	});

	// When the device receives an error
	deviceClient.on("error", function(err) {
		console.log("Error! - " + err);
	});


	// Function to publish forecast information to IOT Device
	self.getWeather = function(request, response)
	{
		// Disconnect from Device after N iterations
		if (timesGetWeatherCalled > 3)
		{
			clearInterval(self.weatherIntervalID);
			deviceClient.disconnect();
		}
		else
		{
			console.log("WEATHER!!!");
			var callURL = "https://f009d899-2257-48b2-b823-04f754f47a25:tCSvWb9N8N@twcservice.mybluemix.net/api/weather/v1/geocode/" + response.lat1 + "/" + response.long1 + "/forecast/hourly/48hour.json?units=m&language=en-US";
			request.get(callURL, {
				json: true
			},
			function (error, response, body) {
				console.log("forecast: " + JSON.stringify(body.forecasts[0]));
				deviceClient.publish("status", "json", JSON.stringify(body.forecasts[0]));
			});
		}
		++timesGetWeatherCalled;
	}
}

module.exports = weatherSetup;

