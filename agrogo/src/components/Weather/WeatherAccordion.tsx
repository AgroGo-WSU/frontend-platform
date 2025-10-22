import Accordion from 'react-bootstrap/Accordion';
import "../../stylesheets/WeatherContainer.css"

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

function WeatherAccordion(weatherInfo: weatherInfoType[]) {

  const weekDays: string[] = [];
  const displayDates: string[] = [];
  const files: string[] = [];
  const weatherTypes: string[] = [];

  for(let i = 0; i < 7; i++) {
    const daytime = weatherInfo[i].time.toString();
    weekDays.push(daytime.slice(0, 3));
    const splitDate = daytime.split(" ");
    const displayDate = splitDate[1] + ". " + splitDate[2];
    displayDates.push(displayDate);

    if(weatherInfo[i].showers > 0) {
      files.push("./src/assets/weather-images/rain.png");
      weatherTypes.push("Rain");

    } else if(weatherInfo[i].clouds > 50) {
      files.push("./src/assets/weather-images/partial-clouds.png");
      weatherTypes.push("Cloudy");
    } else {
      files.push("./src/assets/weather-images/sun.png");
      weatherTypes.push("Sunny");
    }
    }

  return (
    <Accordion className="accordion-main">
			<Accordion.Item eventKey="0">
				<Accordion.Header>Today</Accordion.Header>
				<Accordion.Body>
				{displayDates[0]}: {weatherTypes[0]}, high {Math.round(weatherInfo[0].max)}, low {Math.round(weatherInfo[0].min)} 
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="1">
				<Accordion.Header>Tomorrow</Accordion.Header>
				<Accordion.Body>
				{displayDates[1]}: {weatherTypes[1]}, high {Math.round(weatherInfo[1].max)}, low {Math.round(weatherInfo[1].min)} 
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="2">
				<Accordion.Header>{weekDays[2]}</Accordion.Header>
				<Accordion.Body>
				{displayDates[2]}: {weatherTypes[2]}, high {Math.round(weatherInfo[2].max)}, low {Math.round(weatherInfo[2].min)} 
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="3">
				<Accordion.Header>{weekDays[3]}</Accordion.Header>
				<Accordion.Body>
				{displayDates[3]}: {weatherTypes[3]}, high {Math.round(weatherInfo[3].max)}, low {Math.round(weatherInfo[3].min)} 
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="4">
				<Accordion.Header>{weekDays[4]}</Accordion.Header>
				<Accordion.Body>
				{displayDates[4]}: {weatherTypes[4]}, high {Math.round(weatherInfo[4].max)}, low {Math.round(weatherInfo[4].min)} 
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="5">
				<Accordion.Header>{weekDays[5]}</Accordion.Header>
				<Accordion.Body>
				{displayDates[5]}: {weatherTypes[5]}, high {Math.round(weatherInfo[5].max)}, low {Math.round(weatherInfo[5].min)} 
				</Accordion.Body>
			</Accordion.Item>
      <Accordion.Item eventKey="6">
				<Accordion.Header>{weekDays[6]}</Accordion.Header>
				<Accordion.Body>
				{displayDates[6]}: {weatherTypes[6]}, high {Math.round(weatherInfo[6].max)}, low {Math.round(weatherInfo[6].min)} 
				</Accordion.Body>
			</Accordion.Item>
			</Accordion>
  );
}

export default WeatherAccordion;