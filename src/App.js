import './styles/App.css';

import React, { useState, useEffect } from 'react';

const App = () => {
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData();
      fetchWeatherForecast();
    }
  }, [latitude, longitude]);

  
  
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        ` https://api.ambeedata.com/weather/latest/by-lat-lng?lat=${latitude}&lng=${longitude}`,
        {
          headers: {
            'x-api-key': '9ba4ba864050b2415484037660457eb5f011b773158628acd8eed451c26b003c',
          },
        }
      );
      const data = await response.json();
      setWeatherData(data);
      console.log(data)
      setError(null);

    } catch (error) {
      setWeatherData(null);
      setError('Failed to fetch weather data');
    }
  };

  const fetchWeatherForecast= async () => {
    try {
      const response = await fetch(
        `https://api.ambeedata.com/weather/forecast/by-lat-lng?lat=${latitude}&lng=${longitude}`,
        {
          headers: {
            'x-api-key': 'f2de489cca5258fa4b962af0bdc9a25b1f1cd118e6b33c34c1e5cb39d2c2d65e',
          },
        }
      );
      const dataForecast = await response.json();
      setWeatherForecast(dataForecast.data.forecast);
      setError(null);

    } catch (error) {
      setWeatherData(null);
      setError('Failed to fetch weather data');
    }
  };


  const handleLocationSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=AIzaSyCfiJPHCaEYbNRpU8Z06VGa9siL_OA0kXc`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const {lat, lng} = data.results[0].geometry.location;
        setLatitude(lat);
        setLongitude(lng);
        setError(null);
      } else {
        setError('Invalid location');
      }
    } catch (error) {
      setError('Failed to fetch location data');
    }
  };

  const dayOfWeek= (unixTimestamp)=>{
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return dayOfWeek
  }


  return (
    <div className="container">
      <h1>Weather App</h1>
      <form onSubmit={handleLocationSubmit} style={{ marginTop: '20px' }}>
        <input type="text" value={location} onChange={(event)=> setLocation(event.target.value)}  placeholder="Enter location" />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-data">
          <h2 className="location">{location}</h2>
          <p>Temperature: {weatherData.data.apparentTemperature}°C</p>
          <p>Wind speed: {weatherData.data.windSpeed}</p>
          <p>Humidity: {weatherData.data.humidity}</p>
          
          <h3 className="forecast-heading">Weather Forecast for the next 7 days:</h3>

          {weatherForecast.map((day, idx) => {
            if((idx)%11===0)return(
            <div key={idx}>
              <h4  className="location"><strong>Date: {dayOfWeek(day.time)}</strong></h4>
              <p>Temperature: {day.apparentTemperature}°C</p>
              <p>Condition: {day.weather}</p>
              <p>Humidity: {day.humidity}</p>
            </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default App;


