import React, { useEffect, useState } from 'react';
import './weather.css';
import Time from '../Timeinfo/Time';
import { FaTemperatureLow, FaCloudRain, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

// Import assets
import { assets } from '../resource_asset/asset'; // Adjust path if necessary

// Define your background images based on temperature ranges
const getBackgroundImage = (temp) => {
  if (temp < 0) return `url(${assets.snow})`;
  if (temp >= 0 && temp < 10) return `url(${assets.clear_sky})`;
  if (temp >= 10 && temp < 20) return `url(${assets.raining})`;
  if (temp >= 20 && temp < 30) return `url(${assets.hot_sun})`;
  return `url(${assets.rain_up})`; // Default image
};

const Weather = () => {
  const [search, setSearch] = useState('jaipur');
  const [weather, setWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const weather_uri = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=2d1ee743b6e44a6c6f47bd48223b03af&units=metric`;
      const forecast_uri = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=2d1ee743b6e44a6c6f47bd48223b03af&units=metric`;
  
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(weather_uri),
          fetch(forecast_uri)
        ]);
  
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
  
        setWeather(weatherData.main);

        // Aggregate data into 4-hour periods
        const aggregatedData = aggregateData(forecastData.list);

        setForecastData(aggregatedData.slice(0, 6)); // Only take the first 6 periods
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchApi();
  }, [search]);

  const timeLabels = ["Early Morning", "Morning", "Afternoon", "Evening", "Night", "Late Night"];

  const getLabel = (index) => timeLabels[index] || 'Unknown';

  const aggregateData = (data) => {
    const result = [];
    for (let i = 0; i < data.length; i += 8) { // 8 entries for 4 hours
      const period = data.slice(i, i + 8);

      // Calculate averages
      const average = period.reduce((acc, item) => {
        acc.temp += item.main.temp;
        acc.humidity += item.main.humidity;
        acc.rain += item.rain ? item.rain['3h'] : 0;
        acc.wind += item.wind.speed;
        acc.count += 1;
        return acc;
      }, { temp: 0, humidity: 0, rain: 0, wind: 0, count: 0 });

      result.push({
        temp: (average.temp / average.count).toFixed(1),
        humidity: (average.humidity / average.count).toFixed(1),
        rain: average.rain.toFixed(1),
        wind: (average.wind / average.count).toFixed(1),
        hour: new Date(period[0].dt_txt).getHours()
      });
    }
    return result;
  };

  const backgroundImage = weather ? getBackgroundImage(weather.temp) : `url(${assets.clear_sky_up})`;

  return (
    <div className='frame' style={{ backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h1>Weather Information</h1>
      <div className="inne_frame">
        <div className='navbar'>
          <div className="logo">
            <h2>Logo</h2>
          </div>
          <div className='text'>
            <h2>Weather Information of:</h2>
          </div>
          <div className='search'>
            <input 
              type="search" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className='info'>
          <div className='collection1'>
            <div className='temp'>
              <div className='icon_1'><FaTemperatureLow /></div>
              <div className='label_1'> {weather?.temp}°C</div>
            </div>

            <div className='humidity'>
              <div className='icon_1'><WiHumidity /></div>
              <div className='label_1'> {weather?.humidity}%</div>
            </div>
          </div>
          <div className='info_2'>
            <div className='rain'>
              <div className='icon_1'><FaCloudRain /></div>
              <div className='label_1'> {forecastData[0]?.rain} mm</div>
            </div>
            <div className='wind_Speed'>
              <div className='icon_1'><FaWind /></div>
              <div className='label_1'> {forecastData[0]?.wind} m/s</div>
            </div>
          </div>
        </div>
      </div>
      <div className='day'>
        <div className='frame_2'>
          {forecastData.map((item, index) => {
            const label = getLabel(index);
            return (
              <Time
                key={index}
                temp={item.temp}
                humidity={item.humidity}
                rain={item.rain}
                wind={item.wind}
                label={label}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Weather;
