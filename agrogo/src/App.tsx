import './stylesheets/App.css'
import FunctionCard from './components/FunctionCard'

function App() {

  return (
    <div className="dashboard">
      <div className="top-blank">I'm top blank</div>
      <div className="bottom-blank">I'm bottom blank</div>
      <div className="left-menu">I'm left menu</div>
      <div className="right-blank">I'm right blank</div>
      <div className="topnav">I'm the topnav</div>
      <div className="welcome-title">I'm the welcome title</div>
      <div className="weather">I'm the weather cards</div>
      <div className="zones">I'm the zones<FunctionCard/></div>
      <div className="footer">I'm the footer</div>
    </div>
  )
}

export default App
