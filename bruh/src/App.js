import logo from './logo.svg';
import './App.css';
import Greeting from './Greeting'; 

function App() {

  const names = ["Anakin", "Maul", "Cad Bane"]; 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          What up Biches? 
          
        </h1>

        <Greeting></Greeting>
        <Greeting name = "oooooga"></Greeting>

        {names.map((name, index) => <Greeting name = {name} key = {index}></Greeting>)}
      </header>
    </div>
  );
}

export default App;
