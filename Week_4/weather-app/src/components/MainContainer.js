import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer
import Card from "./Card"; 

function MainContainer(props) {

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */
  
  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */
  const [weather, setWeather] = useState(" "); 
  const [card, setCard] = useState([]); 
  const [dataLoaded, setDataLoaded] = useState(false); 
  const apiKey = '482077a69851b3a52657d892f35a699b'; // Your OpenWeatherMap API key here

  const days = [1, 2, 3, 4, 5]; 
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];



  
  /*
  STEP 3: Fetch Weather Data When City Changes.
  
  Whenever the selected city (passed as a prop) changes, you should make an API call to fetch the 
  new weather data. For this, use the 'useEffect' hook.

  The 'useEffect' hook lets you perform side effects (like fetching data) in functional components. 
  Set the dependency array of the 'useEffect' to watch for changes in the city prop. When it changes, 
  make the API call.

  After fetching the data, use the 'setWeather' function from the 'useState' hook to set the weather data 
  in your state.
  */

  useEffect(() => {
    console.log("City Changed");
    // If city object is empty
    if(Object.keys(props.selectedCity).length !== 0){
      let apiCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&units=imperial&appid=${apiKey}`;
      // let aqiCall = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&units=imperial&appid=396b57b412e2e85115f9385a9656e2c7`;


      // calls the API
      const apiPromise = fetch(apiCall).then((response) => response.json())
      // const aqiProimse = fetch(aqiCall).then((response) => response.json())
      
      Promise.all([apiPromise]).then(data => {
        const apiData = data[0]
        // const aqiData = data[1]
        // Handle API Stuff
        setCard(apiData);
        setDataLoaded(true);
        // setAqi(aqiData.list[0].main.aqi);
      })
    }
  }, [props.selectedCity]);
    
  
  
  return (
    dataLoaded === true ? (
      <div id="main-container">
        <div className="head">
          <h4 className="date" id="today">
            {card && card.daily && card.daily[0] ?
              `${weekday[new Date(card.daily[0].dt * 1000).getDay()]} ${new Date(card.daily[0].dt * 1000).getDate()}`
              : "Date Unavailable"
            }
          </h4>
          <h1 id="location">
            Weather for {props.selectedCity.fullName}
          </h1>
        </div>
  
        <div className="current">
          <div className="flex-container">
            <div>
              <div>
                <h4 id="weather">
                  {card && card.current && card.current.weather && card.current.weather[0] ? card.current.weather[0].main : "Weather Unavailable"}
                </h4>
                <h2 id="temp">
                  {card && card.current && card.current.temp ? `${card.current.temp}°` : "Temperature Unavailable"}
                </h2>
              </div>
              <div>
                <img id="image" alt="bbruh" src={card && card.current && card.current.weather && card.current.weather[0] ?
                  `../icons/${card.current.weather[0].icon}.svg` : "Image Unavailable"}
                />
              </div>
            </div>
          </div>
        </div>
        <div id="weather-container">
          <div className="flex-container">
            {days.map((i) => (
              <Card key={i} val={i} card={card}></Card>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div id="main-container">
        <div id="weather-container">
          {/* Loading state */}
          <p>Loading...</p>
        </div>
      </div>
    )
  );
  
}


export default MainContainer;

