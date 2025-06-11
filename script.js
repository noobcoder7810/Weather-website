
const api_key_weather = "3ad52006b00c4a47846141108251106" ;
const api_key_open = "28f1c07ef5daea2ce084ab44c007f897";


async function getyourweather() {

  let loader = document.getElementsByClassName('loader')[0];
  let weatherblock = document.getElementsByClassName('weather_block')[0];
  let maininfo = document.getElementsByClassName('main_info')[0];

  weatherblock.style.display = 'none' ;
  maininfo.style.display = 'none';
  loader.style.display = 'block';

  navigator.geolocation.getCurrentPosition(success, error);
  async function success(position)
  {
    let user_lat = position.coords.latitude;
    let user_lon = position.coords.longitude;
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key_weather}&q=${user_lat},${user_lon}`)
    

    let data = await response.json();
    console.log(data);

    let main_img_act = document.getElementsByClassName('main_img_act');
    main_img_act[0].src = (`https:${data.current.condition.icon}`) ;
    let blocktemp = document.getElementsByClassName('temp')[0];
    blocktemp.innerHTML = `${data.current.temp_c} &deg;C / ${data.current.temp_f} &deg;F`;
    let descrip = document.getElementsByClassName('descrip')[0];
    descrip.innerHTML = `${data.current.condition.text}.`;
    let feels = document.getElementsByClassName('feels')[0];
    feels.innerHTML = `Feels like&nbsp; ${data.current.feelslike_c} &deg;C / ${data.current.feelslike_f} &deg;F`;
    let forecast = document.getElementsByClassName('forecast')[0];
    forecast.innerHTML = `Forecast : ${data.forecast.forecastday[0].day.maxtemp_c}/${data.forecast.forecastday[0].day.mintemp_c} &deg;C or ${data.forecast.forecastday[0].day.maxtemp_f}/${data.forecast.forecastday[0].day.mintemp_f} &deg;F<br>`;  
    let wind = document.getElementsByClassName('wind')[0];
    wind.innerHTML = `Wind : &nbsp;&nbsp;&nbsp; ${data.current.wind_kph} km/h &nbsp; ${data.current.wind_dir}`
    
    let localtime = (data.location.localtime).toString();
    let lasttime = (data.current.last_updated).toString();

    let values = [
      `${data.location.name +", "+ data.location.country}`,
      `${localtime.slice(11,16) + "("+localtime.slice(8,10)+"-"+localtime.slice(5,8)+localtime.slice(0,4)+")"}`,
      `${lasttime.slice(11,16) + "("+lasttime.slice(8,10)+"-"+lasttime.slice(5,8)+lasttime.slice(0,4)+")"}`,
      `${data.current.vis_km} km`,
      `${data.current.pressure_mb} mbar`,
      `${data.current.humidity}`,
      `${data.current.dewpoint_c} \u00B0C / ${data.current.dewpoint_f} \u00B0F`,
      `${data.current.uv}`
    ]

    let table = document.getElementsByClassName('info')[0];
    let tds = table.getElementsByTagName('td');


    Array.from(tds).forEach((tds,index) => {
      tds.textContent = values[index];
    });


    weatherblock.style.display = 'block' ;
    maininfo.style.display = 'block';
    loader.style.display = 'none';
  }

  function error(error) 
  {
    loader.style.display = 'none';
    console.error("Geolocation error:", error);
  }
}


let city = ['London,uk','New York City,US','Tokyo,JP','Moscow,RU'];

for(let i =0;i<4;i++){
  async function famous() {
  try {  

   document.getElementsByClassName(`loader${i+1}`)[0].style.display = 'flex';
   document.getElementsByClassName(`icon${i+1}`)[0].style.display = 'none';

    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key_weather}&q=${city[i]}`);
    let data = await response.json();
    console.log(data);

    let iconsrc = document.getElementsByClassName(`icon${i+1}`);
    console.log(iconsrc);
    iconsrc[0].src =  (`https:${data.current.condition.icon}`)
    
    document.getElementsByClassName(`loader${i+1}`)[0].style.display = 'none';
    iconsrc[0].style.display = 'block';

    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city[i]}&APPID=${api_key_open}&units=metric`);
    let data2 = await response2.json();
    console.log(data2);

    let page_start_time = Date.now();
    function city_time() {
        let localtime_up = new Date((data2.dt + data2.timezone - 19800) * 1000);
        let now = Date.now();
        let elapsed = (now-page_start_time) / 1000;
        let up_time = new Date((data2.dt + data2.timezone - 19800 + elapsed)*1000)
        return up_time.toString().slice(16,25);
    }


    let localtime_up = new Date((data2.dt + data2.timezone - 19800) * 1000);
    let localtime_upstring1 = localtime_up.toString().slice(0,15);

    let textpart = document.getElementsByClassName(`city${i+1}`)[0];
    console.log(textpart);
    textpart.innerHTML = `
      <p id="citycountry">${data.location.region}, ${data.location.country}</p>
      ${(data.current.temp_c)} &deg;C / ${(data.current.temp_f)} &deg;F
      <br>
      ${data.current.condition.text}
      <br>
      ${localtime_upstring1}
      <br>
      Local Time : <span class="localtime">${city_time()}</span>
    `
    

    setInterval(() => {
    let local_time_elem = document.getElementsByClassName('localtime')[i];
      local_time_elem.textContent = city_time();
    }, 1000);
        // **Here what i was trying that when i was using openweathermap api it was not giving me local time so that i tried to solve                     **  
    // **and for continuos time like the seconds ticking i checked time elapsed between start of web and using setinterval calling function per second**
  } 
  catch (error) {
    console.error(error);
  }
}
famous();
}


let search_bar = document.getElementsByClassName('search_bar')[0];
let search_btn = document.getElementById('searchbtn');

async function search(city) {
  let loader = document.getElementsByClassName('loader')[0];
  let weatherblock = document.getElementsByClassName('weather_block')[0];
  let maininfo = document.getElementsByClassName('main_info')[0];

  weatherblock.style.display = 'none' ;
  maininfo.style.display = 'none';
  loader.style.display = 'block';

  try{
   let response = await fetch (`https://api.weatherapi.com/v1/forecast.json?key=${api_key_weather}&q=${city}`);
  
   if (!response.ok) {
    throw new Error("City not found error");
  }

    let data = await response.json();
    console.log(data);
    let main_img_act = document.getElementsByClassName('main_img_act');
    main_img_act[0].src = (`https:${data.current.condition.icon}`) ;
    let blocktemp = document.getElementsByClassName('temp')[0];
    blocktemp.innerHTML = `${data.current.temp_c} &deg;C / ${data.current.temp_f} &deg;F`;
    let descrip = document.getElementsByClassName('descrip')[0];
    descrip.innerHTML = `${data.current.condition.text}.`;
    let feels = document.getElementsByClassName('feels')[0];
    feels.innerHTML = `Feels like&nbsp; ${data.current.feelslike_c} &deg;C / ${data.current.feelslike_f} &deg;F`;
    let forecast = document.getElementsByClassName('forecast')[0];
    forecast.innerHTML = `Forecast : ${data.forecast.forecastday[0].day.maxtemp_c}/${data.forecast.forecastday[0].day.mintemp_c} &deg;C or ${data.forecast.forecastday[0].day.maxtemp_f}/${data.forecast.forecastday[0].day.mintemp_f} &deg;F<br>`;  
    let wind = document.getElementsByClassName('wind')[0];
    wind.innerHTML = `Wind : &nbsp;&nbsp;&nbsp; ${data.current.wind_kph} km/h &nbsp; ${data.current.wind_dir}`
    
    let localtime = (data.location.localtime).toString();
    let lasttime = (data.current.last_updated).toString();

    let values = [
      `${data.location.name +", " + data.location.country}`,
      `${localtime.slice(11,16) + "("+localtime.slice(8,10)+"-"+localtime.slice(5,8)+localtime.slice(0,4)+")"}`,
      `${lasttime.slice(11,16) + "("+lasttime.slice(8,10)+"-"+lasttime.slice(5,8)+lasttime.slice(0,4)+")"}`,
      `${data.current.vis_km} km`,
      `${data.current.pressure_mb} mbar`,
      `${data.current.humidity}`,
      `${data.current.dewpoint_c} \u00B0C / ${data.current.dewpoint_f} \u00B0F`,
      `${data.current.uv}`
    ]

    let table = document.getElementsByClassName('info')[0];
    let tds = table.getElementsByTagName('td');


    Array.from(tds).forEach((tds,index) => {
      tds.textContent = values[index];
    });

    weatherblock.style.display = 'block' ;
    maininfo.style.display = 'block';
    loader.style.display = 'none';
}
  catch (error) {
    loader.style.display = 'none';
    console.error(error);
  }
}

search_btn.addEventListener("click", () => {
    search(search_bar.value);
} )