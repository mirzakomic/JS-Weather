// ! ++++++++++ ÜBERPRÜFEN; OB BROWSER LOCAL STORAGE UNTERSTÜTZT ++++++++++

if (typeof Storage !== "undefined") {
  // Wenn Local Storage unterstützt wird, die vorhandenen Elemente laden
  if (localStorage.getItem("cityList")) {
    document.querySelector("#left-list").innerHTML =
      localStorage.getItem("cityList");
  } else {
    alert("Willkommen. Du hast bisher noch keine Städte gespeichert");
  }
} else {
  alert("Local Storage wird in diesem Browser nicht unterstützt");
}

// ! ++++++++++ EIGENE POSITION ++++++++++

navigator.geolocation.getCurrentPosition(function (position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log({ lat }, { lon });

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //! Default-Werte anzeigen, bzw. aktuelle Stadt
      //* Default Temperatur
      let celsiusDef = Math.round(data.main.temp - 273.15);
      document.querySelector("#temperature").innerHTML = celsiusDef + "°C";
      //* Default Humidity
      let humidityDef = data.main.humidity;
      document.querySelector("#humidity").innerHTML = humidityDef + "%";
      //* Default Pressure
      let pressureDef = data.main.pressure;
      document.querySelector("#pressure").innerHTML = pressureDef + "";
      //* Default Name
      let nameDef = data.name;
      document.querySelector("#name").innerHTML += nameDef;
      //*
    });
});

// ! ++++++++++ STADT EINGEBEN & WETTERDATEN LADEN ++++++++++

let city = document.querySelector("#city");

function wetterCheck() {
  let cityName = city.value;
  console.log(cityName);
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let cityLat = data[0].lat;
      let cityLon = data[0].lon;
      console.log({ cityLat }, { cityLon });
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // ! +++++ CELSIUS
          let celsius = Math.round(data.main.temp - 273.15);
          document.querySelector("#temperature").innerHTML = celsius + "°C";
          // ! +++++ HUMIDITY
          let humidity = Math.round(data.main.humidity);
          console.log({ humidity });
          document.querySelector("#humidity").innerHTML = humidity + "%";
          // ! +++++ PRESSURE
          let airPressure = Math.round(data.main.pressure);
          console.log({ airPressure });
          document.querySelector("#pressure").innerHTML = airPressure + " hPa";
          // ! +++++ NAME
          let name = data.name;
          document.querySelector("#name").innerHTML = "";
          document.querySelector("#name").innerHTML += cityName;
          //*

          // - +++++ NEUE CARD ERSTELLEN
          let newCard = document.createElement("article");
          // - +++++ ORTSNAMEN EINFÜGEN
          let newCityName = document.createElement("h2");
          newCityName.classList.add("city-left");
          newCityName.textContent = cityName;
          newCard.appendChild(newCityName);
          // - +++++ TEMPERATUR EINFÜGEN
          let cityTemperature = document.createElement("h2");
          cityTemperature.classList.add("temp-left");
          cityTemperature.textContent = celsius + "°C";
          newCard.appendChild(cityTemperature);
          // - ++++++++++ DELETE BUTTON EINFÜGEN ++++++++++
          let deleteButton = document.createElement("button");
          let deleteText = document.createTextNode("X");
          deleteButton.appendChild(deleteText);
          deleteButton.classList.add("deletebutton");
          newCard.appendChild(deleteButton);
          // - +++++ CARD INS DOCUMENT EINFÜGEN
          document.querySelector("#left-list").appendChild(newCard);
          newCard.addEventListener("click", function () {
            let headingElement = this.querySelector("h2");
            let cityCardName = headingElement.textContent;
            console.log(cityCardName);
            fetch(
              `https://api.openweathermap.org/geo/1.0/direct?q=${cityCardName}&limit=5&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                let cityLat = data[0].lat;
                let cityLon = data[0].lon;
                console.log({ cityLat }, { cityLon });
                fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                    // ! +++++ CELSIUS
                    let celsius = Math.round(data.main.temp - 273.15);
                    document.querySelector("#temperature").innerHTML =
                      celsius + "°C";
                    // ! +++++ HUMIDITY
                    let humidity = Math.round(data.main.humidity);
                    console.log({ humidity });
                    document.querySelector("#humidity").innerHTML =
                      humidity + "%";
                    // ! +++++ PRESSURE
                    let airPressure = Math.round(data.main.pressure);
                    console.log({ airPressure });
                    document.querySelector("#pressure").innerHTML =
                      airPressure + " hPa";
                    // ! ++++ NAME
                    let name = data.name;
                    document.querySelector("#name").innerHTML = "";
                    document.querySelector("#name").innerHTML += cityCardName;
                    //*
                    checkWeatherBg(data);
                  });
              });
          });

          newCard.style.opacity = 0;
          window.getComputedStyle(newCard).opacity;
          newCard.style.opacity = 1;
          // - +++++ DEFAULT WETTER DIREKT ANZEIGEN FÜR DIE AKTUELLE STADT

          // - +++++ IN LOCAL STORAGE SPEICHERN
          localStorage.setItem(
            "cityList",
            document.querySelector("#left-list").innerHTML
          );
          //! Mirza CODE
          checkWeatherBg(data);
        });
    });
}

// ! ++++++++++ DELETE BUTTON FUNCTION ++++++++++
let leftList = document.querySelector("#left-list");

leftList.addEventListener("click", function (event) {
  if (event.target.classList.contains("deletebutton")) {
    // Delete button was clicked
    event.target.parentElement.remove();
    localStorage.setItem(
      "cityList",
      document.querySelector("#left-list").innerHTML
    );
    console.log("Card wurde gelöscht");
  }
});

function checkWeatherBg(weatherData) {
  console.log(weatherData);
  let weatherBg = document.querySelector("#right-detail");
  let weatherContainer = document.querySelector("#detail-img");
  let humidityStyle = document.querySelector("#humidity");
  let pressureStyle = document.querySelector("#pressure");
  let rainProbStyle = document.querySelector("#rain-prob");
  let wolkeWeiss = document.createElement("img");
  let wolkeGrau = document.createElement("img");
  wolkeWeiss.src = "../assets/img/Wolke weiß.png";
  wolkeWeiss.setAttribute("id", "wolkeweiss");
  wolkeGrau.src = "../assets/img/Wolke grau.png";
  wolkeGrau.setAttribute("id", "wolkegrau");
  //* Wetter clear
  if (weatherData.weather[0].main === "Clear") {
    weatherContainer.innerHTML = "";
    weatherBg.style.backgroundImage = "url(/assets/img/Blauer_Himmel.png)";
    let sun = document.createElement("img");
    sun.src = "../assets/img/Sonne.png";
    sun.classList.add("sonneAnimation");
    weatherContainer.appendChild(sun);
    //* Wetter clouds
  } else if (weatherData.weather[0].main === "Clouds") {
    weatherContainer.innerHTML = "";
    weatherBg.style.backgroundImage = "url(/assets/img/Gewitter.png)";
    humidityStyle.style.color = "white";
    pressureStyle.style.color = "white";
    rainProbStyle.style.color = "white";
    weatherContainer.appendChild(wolkeWeiss);
    weatherContainer.appendChild(wolkeGrau);
    //* Wetter Thunderstorm
  } else if (weatherData.weather[0].main === "Thunderstorm") {
    weatherContainer.innerHTML = "";
    weatherBg.style.backgroundImage = "url(/assets/img/Gewitter.png)";
    let thunder = document.createElement("img");
    thunder.src = "../assets/img/Blitz.png";
    thunder.classList.add("thunderAnimation");
    weatherContainer.appendChild(thunder);
    let thunderZwei = document.createElement("img");
    thunderZwei.src = "../assets/img/Blitz.png";
    thunderZwei.classList.add("thunderAnimation2");
    weatherContainer.appendChild(thunderZwei);
    weatherContainer.appendChild(wolkeWeiss);
    humidityStyle.style.color = "white";
    pressureStyle.style.color = "white";
    rainProbStyle.style.color = "white";
    weatherContainer.appendChild(wolkeWeiss);
    weatherContainer.appendChild(wolkeGrau);
    //* Wetter Rain
  } else if (weatherData.weather[0].main === "Rain") {
    weatherContainer.innerHTML = "";
    weatherBg.style.backgroundImage = "url(/assets/img/Gewitter.png)";
    humidityStyle.style.color = "white";
    pressureStyle.style.color = "white";
    rainProbStyle.style.color = "white";
    weatherContainer.appendChild(wolkeWeiss);
    weatherContainer.appendChild(wolkeGrau);
    // Create the rain effect
    function createRain() {
      const rainContainer = document.createElement("div");
      rainContainer.classList.add("rain-container");
      const weatherContainer = document.querySelector("#detail-img");
      const containerWidth = weatherContainer.offsetWidth;
      const containerHeight = weatherContainer.offsetHeight;

      for (let i = 0; i < 50; i++) {
        const rainDrop = document.createElement("div");
        rainDrop.classList.add("rain-drop");
        rainDrop.style.left = `${Math.random() * containerWidth}px`; // Spread the raindrops within the container
        rainDrop.style.top = `${Math.random() * containerHeight}px`;
        rainDrop.style.animationDelay = `${i * 0.1}s`;
        rainDrop.style.animationDuration = `${Math.random() * 5 + 1}s`;
        rainContainer.appendChild(rainDrop);
      }
      weatherContainer.appendChild(rainContainer);
    }
    // Call the createRain function to start the rain effect
    createRain();
  }
}

//! ++++++++++ CARD CLICK FUNCTION ++++++++++

let leftListCard = document.querySelectorAll("#left-list article");

leftListCard.forEach((e) =>
  e.addEventListener("click", function () {
    let headingElement = this.querySelector("h2");
    let cityCardName = headingElement.textContent;
    console.log(cityCardName);
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityCardName}&limit=5&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let cityLat = data[0].lat;
        let cityLon = data[0].lon;
        console.log({ cityLat }, { cityLon });
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=a0b3f65f61d0c176e7f5b42fa8744a3b`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // ! +++++ CELSIUS
            let celsius = Math.round(data.main.temp - 273.15);
            document.querySelector("#temperature").innerHTML = celsius + "°C";
            // ! +++++ HUMIDITY
            let humidity = Math.round(data.main.humidity);
            console.log({ humidity });
            document.querySelector("#humidity").innerHTML = humidity + "%";
            // ! +++++ PRESSURE
            let airPressure = Math.round(data.main.pressure);
            console.log({ airPressure });
            document.querySelector("#pressure").innerHTML =
              airPressure + " hPa";
            // ! ++++ NAME
            // let name = data.name;
            document.querySelector("#name").innerHTML = "";
            document.querySelector("#name").innerHTML += cityCardName;
            checkWeatherBg(data);
          });
      });
  })
);
