const usertab = document.querySelector("[data-userWether]");
const searchtab = document.querySelector("[data-searchWether]");

const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const serchForm = document.querySelector('.form-container');
const LoadingScreen = document.querySelector('.Loading-container');
const userInputContainer = document.querySelector('.User-info-container');
const errorCityNotFound = document.getElementById("error-city-not-found");


//inital veriable need
let currenttab = usertab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currenttab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(Clickedtab) {
    if (Clickedtab != currenttab) {
        currenttab.classList.remove("current-tab");
        currenttab = Clickedtab;
        currenttab.classList.add("current-tab")

        if (!serchForm.classList.contains("active")) {
            userInputContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            serchForm.classList.add("active")
        }
        else {
            //main pahle searchweather wale tab pr thi ab usko invisible karna hai 
            serchForm.classList.remove("active")
            userInputContainer.classList.remove("active")
            //ab main your weather rab me aa gai hu tab yha local storage chack karenge or coorinate chack karenge or uso hisab se weather show lkarenge

            getfromSessionStorage();
        }
    }



}




//switching the tabs
usertab.addEventListener('click', () => {
    //pass clicked tab as parameter
    switchTab(usertab);
})

searchtab.addEventListener('click', () => {
    //pass clicked tb
    switchTab(searchtab);
})


//check if coordinates are already present in local storage
function getfromSessionStorage() {
    const localCoordinate = sessionStorage.getItem("user_coordinates")
    if (!localCoordinate) {
        grantAccessContainer.classList.add("active")
    }
    else {
        const coordinates = JSON.parse(localCoordinate);
        fetchUserWetherInfo(coordinates);
    }
}

async function fetchUserWetherInfo(coordinates) {
    const { lat, lon } = coordinates;
    //make invisible grant location window
    grantAccessContainer.classList.remove("active");
    //make loader visible
    LoadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        LoadingScreen.classList.remove("active");
        userInputContainer.classList.add("active");
        renderWetherInfo(data);
    }
    catch (err) {
        LoadingScreen.classList.remove("active")
        console.log(err)
    }
}

async function renderWetherInfo(wetherInfo) {
    //first fetch all the wether info
    const cityName = document.querySelector("[data-city-name]");
    const contryIcon = document.querySelector("[data-contry-icon]");
    const wetherDesc = document.querySelector("[data-weatherDesc]");
    const wetherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const wind = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudness = document.querySelector("[data-cloudiness]");


    cityName.innerText = wetherInfo?.name;
    contryIcon.src = `https://flagcdn.com/144x108/${wetherInfo?.sys?.country.toLowerCase()}.png`;
    wetherDesc.innerText = wetherInfo?.weather?.[0]?.description;
    wetherIcon.src = `http://openweathermap.org/img/w/${wetherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${wetherInfo?.main?.temp} °C`;
    wind.innerText = `${wetherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${wetherInfo?.main?.humidity} %`;
    cloudness.innerText = `${wetherInfo?.clouds?.all} %`;

}

//get Location Function
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("No Geolocation Support Available for the browser")
    }
}

//Show Position
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user_coordinates", JSON.stringify(userCoordinates));
    fetchUserWetherInfo(userCoordinates);
    console.log(userCoordinates);
}

//Make a listener on grnat Access Lintner button
const grantBtn = document.querySelector("[data-grantAccess]");
grantBtn.addEventListener('click', getLocation)

const searchInput = document.querySelector("[data-searchInput]");
serchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    }
    fetchSearchWetherInfo(cityName);


});
async function fetchSearchWetherInfo(city) {

    LoadingScreen.classList.add("active");
    userInputContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorCityNotFound.classList.remove("active"); // Clear any previous error messages

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (response.status === 404) {
            LoadingScreen.classList.remove("active");
            // City not found, handle the error
            errorCityNotFound.textContent = `City Not Found  :  ${city}`;
            errorCityNotFound.classList.add("active"); // Show the error message
        } else {
            const data = await response.json();
            LoadingScreen.classList.remove("active");
            userInputContainer.classList.add("active");
            renderWetherInfo(data);
        }
    } catch (error) {
        errorCityNotFound.textContent = 'An error occurred while fetching data.';
        errorCityNotFound.classList.add("active"); // Show the error message

        LoadingScreen.classList.remove("active");
        userInputContainer.classList.remove("active");
    }

}





