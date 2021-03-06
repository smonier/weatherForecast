function weatherForecast(apiKey, locationIQKey, units, uuid) {

    var apiKey = apiKey; // PLEASE SIGN UP FOR YOUR OWN API KEY
    var uuid = uuid;
    var url = 'https://api.openweathermap.org/data/2.5/onecall';
    var unit = "<sup>°C</sup>";
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (units == "us") {
        unit = "<sup>°F</sup>";
    }
    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        if (units == "us") {
            unitCall = "imperial";
        }
        if (units == "si") {
            unitCall = "metric";
        }


        console.log('Latitude is ' + latitude + '° <br> Longitude is ' + longitude + '°');

        $.getJSON(url + "?lat=" + latitude + "&lon=" + longitude + "&units=" + unitCall + "&appid=" + apiKey, function (data) {
            var city = (data.timezone).split("/");
            var d = new Date(data.current.dt * 1000);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://us1.locationiq.com/v1/reverse.php?key=" + locationIQKey + "&lat=" + latitude + "&lon=" + longitude + "&format=json",
                "method": "GET"
            }

            $.ajax(settings).done(function (response) {
                $('#timezone-' + uuid).html(response.address.city + ", " + response.address.country);
                $('#wCity1-' + uuid).html(response.address.city + ", " + response.address.country);
                document.getElementById("cityPic-" + uuid).src = 'https://source.unsplash.com/featured/?' + response.address.city + ',' + data.current.weather[0].main;

                console.log(response);

            })
            $('#temp-' + uuid).html(Math.round(data.current.temp) + unit);

            $('#wDate-' + uuid).html(d.toDateString());
            $('#wDate1-' + uuid).html(d.toDateString());
            $('#wTime-' + uuid).html(d.toLocaleTimeString());
            $('#wTime1-' + uuid).html(d.toLocaleTimeString());
            document.getElementById("iconow-" + uuid).src = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
            $('#dailySummary-' + uuid).html(data.current.weather[0].description);
            $('#summary-' + uuid).html(data.current.weather[0].description);
            for (var i = 0; i < data.daily.length; i++) {
                var dailyTemp = data.daily[i];
                var d1 = new Date(dailyTemp.dt * 1000);
                $('#day' + (i + 1) + '-' + uuid).html(d1.getDate() + ' ' + months[d1.getMonth()]);
                document.getElementById("iconow" + (i + 1) + '-' + uuid).src = 'http://openweathermap.org/img/wn/' + dailyTemp.weather[0].icon + '@2x.png';
                $('#templow' + (i + 1) + '-' + uuid).html(Math.round(dailyTemp.temp.night) + unit);
                $('#temphigh' + (i + 1) + '-' + uuid).html(Math.round(dailyTemp.temp.day) + unit);
            }
            console.log(data.currently.temperature + unit + " " + data.timezone);
        });

    }

    function error(err) {
        console.warn(`Unable to retrieve your location (${err.code}): ${err.message}`);
    }


}

