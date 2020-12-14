const cityName = document.getElementById('cityName');
const submitBtn = document.getElementById('submitBtn');
const city_name = document.getElementById('city_name');

// const temp = document.getElementById('temp');
const temp_real_val = document.getElementById('temp_real_val');

const temp_status = document.getElementById('temp_status');

const datahide = document.querySelector('.middle_layer');

const getInfo = async(event) => {
    event.preventDefault();
    // alert("Weather data show");

    let cityVal = cityName.value;
    if (cityVal === "") {
        city_name.innerText = `Please Write the name before search`;
        datahide.classList.add('data_hide');
        // alert("Weather city name enter");
    } else {
        try {
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=b14425a6554d189a2d7dc18a8e7d7263`;
            const responce = await fetch(url);
            const data = await responce.json();
            const arrData = [data];

            city_name.innerText = `${arrData[0].name}, ${arrData[0].sys.country}`;
            // temp.innerText = arrData[0].main.temp;            
            temp_real_val.innerText = arrData[0].main.temp;
            // temp_status.innerText = arrData[0].weather[0].main;

            const tempMood = arrData[0].weather[0].main;
            //condiition to check sunny or cloudy
            if (tempMood == "Clear") {
                temp_status.innerHTML = "<i class='fa fa-sun' style='color:#eccc68;'></i>";
            } else if (tempMood == "Clouds") {
                temp_status.innerHTML = "<i class='fa fa-cloud' style='color:#f1f2f6;'></i>";
            } else if (tempMood == "Rain") {
                temp_status.innerHTML = "<i class='fa fa-rain' style='color:#a4b0be;'></i>";
            } else {
                temp_status.innerHTML = "<i class='fa fa-sun' style='color:#eccc68;'></i>";
            }
            datahide.classList.remove('data_hide');
            // console.log(data);
        } catch {
            city_name.innerText = `Please enter the city name properly`;
            datahide.classList.add('data_hide');
        }

    }
}



submitBtn.addEventListener('click', getInfo);