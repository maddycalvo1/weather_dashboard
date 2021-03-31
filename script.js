var formEl = $("form");
var today = moment().format("L");
var apiKey = "4a4e7e38b950e4866fbd81200ca3d5cb";
formEl.on("submit", pullData)
var stored =[];


// API

function pullData(event){
    event.preventDefault();
    $(".infoContainer").show();
    $(".fiveDayCards").show();
    $(".noInfo").hide();
    $(".fiveDayCards").empty();
    //grabs city from Search box
    var city = $("#searchedCity").val().trim().toUpperCase();
    var state = $("#searchedState").val().trim().toUpperCase();

    if(!city || !state){
        alert("Please enter in a valid city and state")}
        else{
    var cityState = (city+","+state)
    addCity();


    localStorage.setItem("mostRecentSearch", cityState);
    var queryURL =  "https://api.openweathermap.org/data/2.5/forecast?q="+cityState+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
  

    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    console.log(response);
  

    var currentTemp = response.list[0].main.temp;
    var currentFarTemp = (((currentTemp-273.15)*1.8 +32).toFixed(2));
    console.log(currentFarTemp);
    $(".currentTemp").text(currentFarTemp+" °F");

    var lat = response.city.coord.lat;
    console.log(lat);
    var lon = response.city.coord.lon;
    console.log(lon);

    for(var i=0;i<5;i++){
        //loops through dates
        var dateCalc = moment().add(i+1,"d");
        var date = dateCalc.format("L");
        //create card div
        var card = $("<div>");
        card.addClass("card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center");
        //create UL
        var ul = $("<ul>");
        ul.addClass("list-group list-group-flush");
        //create date li element
        var cardDate = $("<li>");
        cardDate.text(date);
        cardDate.addClass("list-group-item cardDate");
 
    

        //pull Temperature
        var dailyTemp = response.list[(i*8)+7].main.temp;
        var dailyFarTemp = (((dailyTemp-273.15)*1.8 +32).toFixed(2));
        var dailyTempEl = $("<li>");
        dailyTempEl.addClass("list-group-item");
        dailyTempEl.text("Temp: "+dailyFarTemp);


         //append to Dom
         $(".fiveDayCards").append(card);
         card.append(ul);
         ul.append(cardDate,dailyPic,dailyTempEl,dailyHumidEl);
    }

    var indexURL = `https:////api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4a4e7e38b950e4866fbd81200ca3d5cb`;
    $.ajax({
        url: indexURL,
        method: "GET"
        }).then(function(response) {
        //get the UV index
        console.log(response)
        var UVIndex = response.value;
        console.log(UVIndex)
        $(".currentUVIndex").text(UVIndex)

        if(UVIndex <=2){
            $(".currentUVIndex").addClass("lowIndex")
        }else if (UVIndex >2 && UVIndex <= 7) {
            $(".currentUVIndex").addClass("medIndex")
        }else{
            $(".currentUVIndex").addClass("highIndex")
        }
        });
    });
    
getStored();
location.reload();
    
    }
}


// search box

$("li").on("click", function(){
    var cityName = $(this).attr("data-city");
    console.log(cityName)
    if(cityName){
        cityState = cityName;
        var queryURL =  "https://api.openweathermap.org/data/2.5/forecast?q="+cityState+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
        $(".fiveDayCards").empty();
        localStorage.setItem("mostRecentSearch", cityState);
        // Ajax call to API
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {

        console.log(response);
        //Fill in Data for Main Result Container
        //fill city and state
        $(".currentCity").text(`${cityState} ${today}`);

            //QuickPic
    
        var quickPic = response.list[0].weather[0].icon
        console.log(quickPic);
        var quickPicURL = `https://openweathermap.org/img/wn/${quickPic}@2x.png`
        console.log(quickPicURL)
        $(".quickPic").attr("src",quickPicURL)
        

        // calculate the temperature (converted from Kelvin)
        var currentTemp = response.list[0].main.temp;
        var currentFarTemp = (((currentTemp-273.15)*1.8 +32).toFixed(2));
        console.log(currentFarTemp);
        $(".currentTemp").text(currentFarTemp+" °F");
        //Current wind speed
        var currentWindSpeed = response.list[0].wind.speed;
        $(".currentWindSpeed").text(currentWindSpeed+" MPH");
        console.log(currentWindSpeed);
        //Current Humidity
        var currentHumidity = response.list[0].main.currentHumidity;
        $(".currentHumidity").text(currentHumidity+"%");
        //Current UV Index
        var lat = response.city.coord.lat;
        console.log(lat);
        var lon = response.city.coord.lon;
        console.log(lon);

        // 5 Day Forecast
        for(var i=0;i<5;i++){
            //loops through dates
            var dateCalc = moment().add(i+1,"d");
            var date = dateCalc.format("L");
            //
            var card = $("<div>");
            card.addClass("card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center");
            //
            var ul = $("<ul>");
            ul.addClass("list-group list-group-flush");
            //
            var cardDate = $("<li>");
            cardDate.text(date);
            cardDate.addClass("list-group-item cardDate");
            
    

            //For Temperature
            var dailyTemp = response.list[(i*8)+7].main.temp;
            var dailyFarTemp = (((dailyTemp-273.15)*1.8 +32).toFixed(2));
            var dailyTempEl = $("<li>");
            dailyTempEl.addClass("list-group-item");
            dailyTempEl.text("Temp: "+dailyFarTemp);


            //append to Dom
            $(".fiveDayCards").append(card);
            card.append(ul);
            ul.append(cardDate,dailyPic,dailyTempEl,dailyHumidEl);
        }

        var indexURL = `https:////api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4a4e7e38b950e4866fbd81200ca3d5cb`;
        $.ajax({
            url: indexURL,
            method: "GET"
            }).then(function(response) {
            console.log(response)
            var UVIndex = response.value;
            console.log(UVIndex)
            $(".currentUVIndex").text(UVIndex)

            if(UVIndex <=2){
                $(".currentUVIndex").removeClass("lowIndex medIndex highIndex");
                $(".currentUVIndex").addClass("lowIndex");
            }else if (UVIndex >2 && UVIndex <= 7) {
                $(".currentUVIndex").removeClass("lowIndex medIndex highIndex");
                $(".currentUVIndex").addClass("medIndex");
            }else{
                $(".currentUVIndex").removeClass("lowIndex medIndex highIndex");
                $(".currentUVIndex").addClass("highIndex");
            }
            });
        });
    }
})