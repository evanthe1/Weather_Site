//Not 100% about if I have input this api key correctly!
const apiKey = '16e444700cd8d7823f2797bbe881ae8f';

//To start we are declaring the divs from our HTML file so we are able to interact with and add information to them with JS
const weatherContainer = document.getElementById('weather');
const city = document.getElementById('city');
const error = document.getElementById('error');

//This is an argument we are going to pass to our API call, but we are also going to use it to teck what units should be displayed when we fetch the weather, as open weather will just return a number with no units
const units = 'metric';
let tempSymbol = units == 'metric' ? 'C' : 'F';

async function fetchWeather() {
    try {
        //This is actiing as a 'clear' function, getting these 2 divs to be empty so the previous search results are not displayed
        weatherContainer.innerHTML = '';
        //Interacting with these is neat, we call the divs which are constants, but these divs contain information that CAN be edited without changing the value of the div itself, hense the const declaration
        error.innerHTML = '';
        city.innerHTML = '';
        
        //This is the number of 3 hour blocks we will call open weather for
        const cnt = 10;
        //Getting the value of the textbox element named 'city input'
        const cityInputByUser = document.getElementById('cityInput').value;
        
        //This is where we will make our call to! Uses data obtained from the user and some constants we provide
        const apiUrl = `api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=${apiKey}`;
        
        //First variable is what makes the call, stores the raw data that is transmitted by open weather
        const response = await fetch(apiUrl);
        //This variable takes what open AI returns and makes it into useable data
        const data = await response.json();
        
        //Now some actual function
        //Displays an error message if invalid city, no city, or no data
        if (data.cod == '400' || data.cod == '404') {
            error.innerHTML = `Not valid city. Please input a valid city`;
            return;
            //If the data returned by open weather is condition 400 or 404, there wont be any infor to display to the user, and our other functions wouldnt work. This is our emergency catch
        }
        
        //Display weather data in 3 hour incriments, base on the cnt variable
        data.list.forEach(data => {
            //First we pass the entire weather data for a block into a function that selects what information we want to display. Open weather will often send more data than we are intersted in.
            //The list item is a built in function of the API call we are making
            const hourlyWeatherData = createWeatherDesc(data);
            //Once processed, this block is added as a child node to the weatherContainer node, essentially adding the just processed data to a list that will be filled with the coming blocks
            weatherContainer.appendChild(hourlyWeatherData);
            //With more knowledge I know now that weather container is just an array of HTML divs! They all share the same class id so we can manipluate them with css
        });
        
        //displays the city name based on lat and long, not sure how we're going to ge tthat lol
        city.innerHTML = `Hourly Weather for ${data.city.name}`;
    } catch (error) {
        console.log(error);
    }
}

function convertToLocalTime(dt) {
    //This function works by taking the unix timestamp and multiplying it by 1000, which converts it to milliseconds
    //It will also take this onformation and compare it to the users onboard clock to determine timezone
    
    //the Date keyword is a special function that ustilizes the computers built in clock
    const date = new Date(dt * 1000);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); //Months are 0 based, meaning in 0 = january. We add one to make it easy for user
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); //Converts 24hr clock to 12
    const minutes = Sting(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    
    //Returns a nice simple string formatted date and time
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;
}

function createWeatherDesc(weatherData) {
    //Weather data passed into this function, only the main weather data and the date and time is extracted and added to an item weatherData
    const {main, dt} = weatherData;
    
    //we create a new variable, description, and assign it to be an HTML div
    const description = document.createElement("div");
    //Open weather uses unix to display date and time. No one can read that so we need to convert it!
    const convertedDateAndTime = convertToLocalTime(dt);
    
    //Now we are actually editing teh div we made earlier. We tell index that the description variable is a div with the class 'weather_discription' and the text in that div will have been created by our java script. So while the index cannot read JS, JS will have already convered this line into a string, which is what index would be expecting to read.
    description.innerHTML = `<div class = "weather_description">${main.temp}${tempSymbol} - ${convertedDateAndTime.substring(10)} - ${convertedDateAndTime.substring(5, 10)}</div>`;
    
    //See above, but basically we are returning HTML code in the form of a JS string, to be read by index.
    return description;
}



