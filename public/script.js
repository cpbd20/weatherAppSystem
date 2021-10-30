var cityMap = document.querySelectorAll('svg path');
// var cityMapAll = document.querySelectorAll('svg path');
// cityMap.addEventListener('mouseover', function(){
//     alert('nice');
// })
const possiblePlace = ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya']
var resultTitle = document.querySelector('#result h2');
for (let i = 0; i < cityMap.length; i++) {
    cityMap[i].addEventListener("mouseover", function() {
        // if(possiblePlace.includes(cityMap[i].getAttribute('title'))){
        //     setTimeout(() => {
        //         weather.fetchWeather(cityMap[i].getAttribute('title'))
        //     }, 500)
        // }
        weather.fetchWeather(cityMap[i].getAttribute('title'))
        weather.fetchvenue(cityMap[i].getAttribute('title'))
        resultTitle.innerText = "Available Places in " + cityMap[i].getAttribute('title');
    });
}
let weather = {
    apiKey: "9a888db6c3136d8be807e980d9706a8c",
    fetchWeather: function (city) {
        fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        var weatherCard = document.querySelector('.weather');
        var cardImage = document.querySelector('#cardImage');
        // var cardImage = document.querySelector('.card');
        weatherCard.classList.remove('d-none');
        // cardImage.classList.remove('d-none');
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        // document.querySelector(".icon").src =
        // "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        // document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".temp").innerText = temp;
        document.querySelector(".humidity").innerText = humidity + "%";
        document.querySelector(".wind").innerText = speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.querySelector('#cardImage').src ="https://source.unsplash.com/1700x1000/?" + name;
        
        // document.body.style.backgroundImage =    
        // "url('https://source.unsplash.com/1600x900/?" + name + "')";
        // cardImage.style.backgroundImage =
        // "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
        this.fetchvenue(document.querySelector(".search-bar").value);
        var resultTitle = document.querySelector('#result h2');
        resultTitle.innerText = "Available Places in " + document.querySelector(".search-bar").value;

    },
    displayVenue: function (data) {
        // console.log(data[9].name)
        const element = document.querySelector('#foursquare');
        var html = '';
        // const html = data.map((d) => {
        //     return `<li>${d.name}</li>`;
        // })
        element.innerHTML = '';
        function getCat(data){
            newHtml = '';
            for(x=0;x!=data.length;x++){
                newHtml = `<span class="badge badge-warning d-inline-block">${data[x].name}</span>`;
            }
            return newHtml;
        }
        function getAddress(data){
            newHtml = '';
            if(data.length > 0){
                newHtml += `<div class="my-2">`;
                for(x=0;x!=data.length;x++){
                    // if(data[x] !== 'Japan'){
                        newHtml += `<p class="m-0">${data[x]}</p>`;
                    // }
                    // else if(data.length == 2){
                    //     newHtml += `<p>${data[0]}</p>`;
                    //     newHtml += `<p>${data[1]}</p>`;
                    // }
                }
                newHtml += `</div>`;
            }else{
                newHtml += `<p>Click the button to view address</p>`;
            }
            
            return newHtml;
        }
        // console.log()

        for(i=0;i!=data.length;i++){
            this.getImageVenue(data[i].id)
            // ${getAddress(data[i].location.formattedAddress)}
            element.innerHTML += 
            `<div class="col-lg-4 col-md-6 col-sm-12 my-2"><div class="card custom_card2">
                <img class="card-img-top" src="https://asti.dost.gov.ph/pedro/img/no-image.png">
                <div class="card-body">
                    <h5 class="card-title text-truncate">${data[i].name}</h5>
                    ${getCat(data[i].categories)}
                    <div class="my-4 place_description${i}">
                    ${this.getSearchDescription(data[i].name, i)}
                    </div>
                    <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${data[i].name}" class="btn btn-outline-warning text-dark col-md-12">
                    <img src="http://127.0.0.1:8000/svg/place-svgrepo-com.svg" height="30" alt="" class="mr-1" />
                    Find Location</a>
                </div>
            </div></div>`;
        }
    },
    fetchvenue: function (search) {
        const d = new Date();
        const date = d.toISOString().slice(0, 10);
        var stringDate = date.replace(/-/g, "");
        const client_id = 'ITXP2TX2DLBRDIFFIAGPYCGKCMM0YHEISB0XOAOGSABLLHXT';
        const client_secret = 'YPHKTVUKBHOTJE2HWO1220VEUADDPW2KMXTRJ1DQGW1BSZN4';
        //backup
        // const client_id = 'IOR3FSZXJMPBBM0T5A0SHJIWVHZYCLLFK5ABSX3PQDRMVYU0';
        // const client_secret = 'BRPPSBSHOMCVHZLESMU35K22Q5UNLRGSE4AQMR3IEWLTUZM0';
        fetch(`https://api.foursquare.com/v2/venues/search?client_id=${client_id}&client_secret=${client_secret}&ll=40.7,-74&query=${search}&near=${search}&v=${stringDate}`).then((res) => {
            if (!res.ok) {
                throw new Error("No venue found.");
            }
            return res.json();
        })
        .then((data) => {
            this.displayVenue(data['response']['venues']);
        });
    },
    getImageVenue: function (id) {
        const d = new Date();
        const date = d.toISOString().slice(0, 10);
        var stringDate = date.replace(/-/g, "");
        const client_id = 'ITXP2TX2DLBRDIFFIAGPYCGKCMM0YHEISB0XOAOGSABLLHXT';
        const client_secret = 'YPHKTVUKBHOTJE2HWO1220VEUADDPW2KMXTRJ1DQGW1BSZN4';
            fetch(`https://api.foursquare.com/v2/venues/${id}/photos?client_id=${client_id}&client_secret=${client_secret}&ll=40.7,-74&v=${stringDate}
            `)
            .then((res) => {
                console.log(res)
            })
    },
    getSearchDescription: function (search, n){
        // fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${search}&format=json`, {
        //     mode: 'cors',
        //     headers: {
        //         'Access-Control-Allow-Origin':'*'
        //     }
        // })
        //     .then((response) => console.log(response));
        var url = "https://en.wikipedia.org/w/api.php"; 

        var params = {
            action: "query",
            list: "search",
            srsearch: search,
            format: "json"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

        // var newHtml = 'asdkasoi';
        fetch(url)
            .then(function(response){return response.json();})
            .then(function(response) {
                // console.log(response.query.search[0].snippet !== undefined)
                // console.log(params.srsearch)
                // if (response.query.search[0].title === "Nelson Mandela"){
                //     console.log("Your search page 'Nelson Mandela' exists on English Wikipedia" );
                // }
                var newHtml = '';
                // const search = response.query.search;
                // for(x=0;x!=search.length;x++){
                //     if(response.query.search[x].title === search){
                    // if(response.query.search[0].snippet !== undefined){
                // console.log(response.query.search[0].snippet)
                        const element = document.querySelector(`.place_description${n}`);
                        if(response.query.search.length === 0){
                            element.innerHTML = `<p>No Description Available</p>`;
                        }else{
                            element.innerHTML = response.query.search[0].snippet;
                        }
                    // }
                //     }
                // }
                    // return console.log(newHtml)
                // return this.newHtml;
                // console.log(response.query.search[0].snippet)
            })
            .catch(function(error){console.log(error);});
    }
}
            
// document.querySelector(".search button").addEventListener("click", function () {
// weather.search();
// });

document
.querySelector(".search-bar")
.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
    weather.search();
    }
});
function clearSearch(){
    var weatherCard = document.querySelector('.weather');
    // var cardImage = document.querySelector('#cardImage');
    weatherCard.classList.add('d-none');
    // cardImage.classList.add('d-none');
}
clearSearch();
// console.log(weather.fetchWeather("Tokyo"))
weather.fetchWeather("Tokyo")
weather.fetchvenue("Tokyo")
resultTitle.innerText = "Available Places in Tokyo";
// weather.getSearchDescription("Tokyo Opera City");
// https://source.unsplash.com/1600x900/?map

function changeImage() {   
    var BackgroundImg = [`url(https://images.pexels.com/photos/4058530/pexels-photo-4058530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
                    `url(https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
                    `url(https://images.pexels.com/photos/356269/pexels-photo-356269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`];
    var i = Math.floor((Math.random() * 3));
    const element = document.querySelector('.hero');
    // console.log(element.style.backgroundImage = BackgroundImg[i]);
    element.style.backgroundImage = BackgroundImg[i];
}

// changeImage();
setInterval(() => {
    changeImage();
}, 3000)