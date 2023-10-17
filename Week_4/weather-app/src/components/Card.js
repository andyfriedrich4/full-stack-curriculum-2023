import React from "react";
import "../index.css";

export default function Card(props) {
  // weekdays
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  // Check if props.card and props.card.daily are defined
  if (!props.card || !props.card.daily) {
    return (
      <div>
        <p>Data is unavailable</p>
      </div>
    );
  }

  // Check if props.val is within the valid range
  if (props.val < 0 || props.val >= props.card.daily.length) {
    return (
      <div>
        <p>Invalid data</p>
      </div>
    );
  }

  // Access data within props.card.daily with proper checks
  const dailyData = props.card.daily[props.val];
  const dayDate = new Date(dailyData.dt * 1000);

  return (
    <div>
      <div className="daily">
        <div className="container">
          <h4 className="date" id="day">
            {weekday[dayDate.getDay()] +
              " " +
              dayDate.getDate()}
          </h4>
          {/* <img id="image" alt="bruh" src={`../icons/${dailyData.weather[0].icon}.svg`} /> */}
          <img id="image" alt="bruh" src={`/icons/09d.svg`} />
          <h2 id="low-hi">
            {dailyData.temp.min.toFixed(0)}° to{" "}
            {dailyData.temp.max.toFixed(0)}°
          </h2>
        </div>
      </div>
    </div>
  );
}
