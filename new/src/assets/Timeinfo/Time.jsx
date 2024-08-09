import React from 'react';
import './Time.css';
import { FaTemperatureLow, FaCloudRain, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

const Time = ({ label, temp, humidity, rain, wind }) => {
  return (
    <div className='time'>
      <div className='time-label'>{label}</div>
      <div className='temp_time'>
        <div className='icon'><FaTemperatureLow /></div>
        <div className='label'>{temp}°C</div>
      </div>
      <div className='humidity_time'>
        <div className='icon'><WiHumidity /></div>
        <div className='label'>{humidity}%</div>
      </div>
      <div className='rain_time'>
        <div className='icon'><FaCloudRain /></div>
        <div className='label'>{rain}</div>
      </div>
      <div className='wind_Speed_time'>
        <div className='icon'><FaWind /></div>
        <div className='label'>{wind} m/s</div>
      </div>
    </div>
  );
}

export default Time;
