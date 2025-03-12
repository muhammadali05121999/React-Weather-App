import React, { useEffect, useRef, useState } from "react";
import search from "../assets/search.png";
import clear from "../assets/clear.png";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import humidity from "../assets/humidity.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";

export function Weather() {
  const inputRef = useRef();
  const getWeatherIcon = (temperature, weatherCode) => {
    if (temperature >= 30) {
      return clear; // Hot Weather (Sunny)
    } else if (temperature >= 20 && temperature < 30) {
      return cloud; // Mild Weather (Cloudy)
    } else if (temperature >= 10 && temperature < 20) {
      return drizzle; // Cool Weather (Drizzle)
    } else if (temperature >= 0 && temperature < 10) {
      return rain; // Cold Weather (Rainy)
    } else {
      return snow; // Freezing Weather (Snow)
    }
  };

  const [weatherData, setWeatherData] = useState(null); // Set initial state to null

  const Search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      const temperature = Math.floor(data.main.temp);
      const weatherCode = data.weather[0].icon; // Keep for backup
      const icon = getWeatherIcon(temperature, weatherCode); // Use our function

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    Search("Karachi");
  }, []);

  return (
    <div className="bg-teal-100 h-screen flex items-center justify-center">
      <div className="bg-gray-600 rounded-lg h-auto w-96 flex flex-col justify-center items-center p-5 pt-[20px]">
        <div className="flex flex-row w-full justify-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="w-[60%] flex text-center border-gray-400 border-2 rounded-xl mr-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                Search(inputRef.current.value);
              }
            }}
          />
          <img
            src={search}
            alt=""
            className="w-auto bg-slate-400 rounded-lg p-3 cursor-pointer"
            onClick={() => Search(inputRef.current.value)}
          />
        </div>

        {weatherData ? (
          <>
            <img src={weatherData.icon} alt="" className="w-[150px]" />
            <p className="text-white text-4xl">{weatherData.temperature}°C</p>
            <p className="text-white text-xl">{weatherData.location}</p>
            <div className="flex space-x-40">
              <div className="flex flex-col">
                <img src={humidity} alt="" className="w-[50px]" />
                <div>
                  <p className="text-white text-xl">{weatherData.humidity}%</p>
                  <span className="text-white text-xl">Humidity</span>
                </div>
              </div>
              <div className="flex flex-col">
                <img src={wind} alt="" className="w-[50px]" />
                <div>
                  <p className="text-white text-xl">
                    {weatherData.windSpeed} km/h
                  </p>
                  <span className="text-white text-xl">Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-white text-xl mt-5">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Weather;
