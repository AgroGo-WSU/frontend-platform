import '../../stylesheets/WeatherContainer.css';
import { fetchWeatherApi } from 'openmeteo';
import WeatherCard from './WeatherCard';
import LargeWeatherCard from './LargeWeatherCard';

// this is data from OpenMeteo
const params = {
	"latitude": 42.3314,
	"longitude": -83.0457,
	"daily": ["temperature_2m_max", "temperature_2m_min", "rain_sum", "showers_sum", "snowfall_sum", "cloud_cover_max", "wind_speed_10m_max", "uv_index_max", "weather_code"],
	"hourly": "temperature_2m",
	"timezone": "America/New_York",
	"wind_speed_unit": "mph",
	"temperature_unit": "fahrenheit",
	"precipitation_unit": "inch",
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone: ${timezone} ${timezoneAbbreviation}`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);

const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	hourly: {
		time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
			(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
	},
	daily: {
		time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
			(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m_max: daily.variables(0)!.valuesArray(),
		temperature_2m_min: daily.variables(1)!.valuesArray(),
		rain_sum: daily.variables(2)!.valuesArray(),
		showers_sum: daily.variables(3)!.valuesArray(),
		snowfall_sum: daily.variables(4)!.valuesArray(),
		cloud_cover_max: daily.variables(5)!.valuesArray(),
		wind_speed_10m_max: daily.variables(6)!.valuesArray(),
		uv_index_max: daily.variables(7)!.valuesArray(),
		weather_code: daily.variables(8)!.valuesArray(),
	},
};

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
console.log("\nHourly data", weatherData.hourly)
console.log("\nDaily data", weatherData.daily)


// type for the info we will pass to weather cards
interface weatherInfoType {
	id: number
	time: Date;
	max: number;
	min: number;
	uvIndex: number;
	clouds: number;
	showers: number;
	rain: number;
	wind: number;
}

// we will use this array for the mapping function to dynamically render components
const weatherInfo: weatherInfoType[] = [];

// this loop starts on 1 instead of 0 because the 1st instance of this data will be passed to the LargeWeatherCard outside of the mapping function
for(let i = 1; i < 7; i++) {
	const temp = {
		id: i,
		time: weatherData.daily.time ? weatherData.daily.time[i] : new Date(0),
		max: weatherData.daily.temperature_2m_max ? weatherData.daily.temperature_2m_max[i] : 0,
		min: weatherData.daily.temperature_2m_min ? weatherData.daily.temperature_2m_min[i] : 0,
		uvIndex: weatherData.daily.uv_index_max ? weatherData.daily.uv_index_max[i] : 0,
		clouds: weatherData.daily.cloud_cover_max ? weatherData.daily.cloud_cover_max[i] : 0,
		showers: weatherData.daily.showers_sum ? weatherData.daily.showers_sum[i] : 0,
		rain: weatherData.daily.rain_sum ? weatherData.daily.rain_sum[i] : 0,
		wind: weatherData.daily.wind_speed_10m_max ? weatherData.daily.wind_speed_10m_max[i] : 0,
	} as weatherInfoType;
	weatherInfo.push(temp);
}

// the first instance of the data for large weather card
const largeCardInfo = {
		id: 0,
		time: weatherData.daily.time ? weatherData.daily.time[0] : new Date(0),
		max: weatherData.daily.temperature_2m_max ? weatherData.daily.temperature_2m_max[0] : 0,
		min: weatherData.daily.temperature_2m_min ? weatherData.daily.temperature_2m_min[0] : 0,
		uvIndex: weatherData.daily.uv_index_max ? weatherData.daily.uv_index_max[0] : 0,
		clouds: weatherData.daily.cloud_cover_max ? weatherData.daily.cloud_cover_max[0] : 0,
		showers: weatherData.daily.showers_sum ? weatherData.daily.showers_sum[0] : 0,
		rain: weatherData.daily.rain_sum ? weatherData.daily.rain_sum[0] : 0,
		wind: weatherData.daily.wind_speed_10m_max ? weatherData.daily.wind_speed_10m_max[0] : 0,
	} as weatherInfoType;

function WeatherContainer() {

    return(
        <div>
        <div className="weather-container mx-auto p-2 justify-content-evenly">
        <div className="main-weather-card"><LargeWeatherCard { ...largeCardInfo }/></div>
		<div className="weather-flex-container">
			{weatherInfo.map(item => (
                <div className="weather-card-items">
                <WeatherCard key={item.id}
				id = {item.id}
				time = {item.time}
                max = {item.max}
                min = {item.min}
                uvIndex = {item.uvIndex}
                clouds = {item.clouds}
                showers = {item.showers}
                rain = {item.rain}
				wind = {item.wind}/>
                </div>
          ))}
		  </div>
          {/* <WeatherCard day="Tomorrow"   date="Sept. 23"   weather="Cloudy with a high of 71"  			image="../src/assets/weather-images/partial-clouds.png"/>
          <WeatherCard day="Wednesday"  date="Sept. 24"   weather="Rainy with a high of 67"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Thursday"   date="Sept. 25"   weather="Rainy with a high of 71"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Friday"     date="Sept. 26"   weather="Sunny with a high of 75"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Saturday"   date="Sept. 27"   weather="Sunny with a high of 77"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Sunday"     date="Sept. 28"   weather="Cloudy with a high of 72"  			image="../src/assets/weather-images/partial-clouds.png"/> */}
        </div>
        </div>
    )
}

export default WeatherContainer;