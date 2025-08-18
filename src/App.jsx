import { useEffect, useState } from 'react';
import './App.css'
import searchIcon from './assets/search.png';
import sunIcon from './assets/sun.png';
import rainIcon from './assets/showerRain.png';
import humidityIcon from './assets/humidity.png'
import drizzleIcon from './assets/showerRain.png';
import clearIcon from './assets/clearsky.png';
import cloudIcon from './assets/cloudy.png';
import windIcon from './assets/wind.png';
import thunderIcon from './assets/thunderstorm.png';
import snowIcon from './assets/snow.png'

const WeatherDetails = ({ icon, temp, city, country,Lat,Long ,humidity,wind}) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt='weather-icon' />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='Lat'>Latitude</span>
          <span>{Lat}</span>
        </div>
        <div>
           <span className='Long'>Longitude</span>
           <span>{Long}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className="element">
          <img src={humidityIcon} alt='humidity' className='icon'></img>
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt='windy' className='icon'></img>
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let api_key = import.meta.env.VITE_WEATHER_API_KEY;

  const [text,setText]=useState("Chennai");
  const[icon,setIcon]=useState(sunIcon);
  const[temp,settemp]=useState(0);
  const[city,setCity]=useState("Chennai");
  const[country,setCountry]=useState("IN");
  const[Lat,setLatitude]=useState(0);
  const[Long,setLongitude]=useState(0);
  const[humidity,setHumidity]=useState(0);
  const[wind,setWind]=useState(0);
  const[cityNotFound,setCityNotFound]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const weatherIconMap={
    "0id":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":rainIcon,
    "04n":rainIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":thunderIcon,
    "10n":thunderIcon,
    "13d":snowIcon,
    "13n":snowIcon
  };

  const search=async()=>{
  setLoading(true);
  let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    try{
      let res=await fetch(url);
      let data=await res.json();
      if(data.cod=="404"){
        console.log("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      settemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      const weatherIconMap=data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconMap] ||clearIcon);
      setCityNotFound(false);

    }catch(error){
      console.error("An error occured:",error.message);
      setError("An error occured while fetching weather data.");
    }finally{
      setLoading(false);
    }
};
const handleCity=(e)=>{
  setText(e.target.value);
};
const handleKeyDown=(e)=>{
  if(e.key=="Enter"){
    search();
  }
}
useEffect(function(){
  search();
},[]);
  return (
    <>
    <title>Weather App</title>
      <div className='container'>
        <div className='input-container'>
          <input type='text'
          className='cityInput'
          placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown}></input>
          <div className='search-icon' onClick={()=>search()}>
            <img src={searchIcon} alt='search'></img>
          </div>
        </div>
        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}
        {!loading && !cityNotFound &&<WeatherDetails icon={icon} temp={temp} city={city} country={country} Lat={Lat} Long={Long} humidity={humidity} wind={wind}></WeatherDetails>}
        <p className='copyright'>
          Designed by <span>Akalya S T</span>
        </p>
      </div>
    </>
  )
}

export default App
