// https://openweathermap.org/weather-conditions - Weather condition codes for OpenWeatherMap API

export const getWeatherIcon = (weatherData: any) => {
  const iconId = weatherData.weather[0].id;
  const windSpeed = weatherData.wind_speed;

  if (iconId >= 600 && iconId <= 622) {
    return 'snow';
  } else if (iconId >= 500 && iconId <= 531) {
    return 'rain';
  } else if (iconId === 741) {
    return 'fog';
  } else if (windSpeed > 3.5) {
    return 'wind';
  } else if (iconId === 801) {
    return 'cloudy';
  } else if (iconId === 802 || iconId === 803) {
    return 'partly-cloudy-day';
  } else if (iconId === 800) {
    return 'clear-day';
  } else {
    return 'clear-day';
  }
};
