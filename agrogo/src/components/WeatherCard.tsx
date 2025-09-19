import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';

//I'm another React Bootstrap component! It's called "Kitchen Sink". CSS for me can found at \frontend-platform\agrogo\node_modules\bootstrap\dist\css\bootstrap.css

function WeatherCard() {
  return (
    <Card style={{ width: "15vw" }}>
      <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Text that will turn into props-managed state
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default WeatherCard;