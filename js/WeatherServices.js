/****************************************************
 *
 * @type {{getWeatherByCityId: getWeatherByCityId, getWeatherByCityZipCode: getWeatherByCityZipCode, getWeatherByCityName: getWeatherByCityName, getWeatherByCityCoordinates: getWeatherByCityCoordinates}}
 */

var Services = (function IIFE(window,document,$) {

    var PATH = 'http://localhost:8080/api';

    var getWeatherByCityId = function( city_id, callbak) {
        var pathTemp = PATH + '/weather/cities/' + city_id;
        $.ajax({
            url: pathTemp,
            method: 'GET',
            headers: {  'Access-Control-Allow-Origin': '*' },
            success: function (response) {
                callbak(response);
            },
            error: function () {
                alert('The service is unavailable.');
            }
        });
    };

    var getWeatherByCityName = function (city_name, callback) {
        var pathTemp = PATH + '/weather/cities/name/' + city_name;
        $.ajax({
            url: pathTemp,
            method: 'GET',
            headers: {  'Access-Control-Allow-Origin': '*' },
            success: function (response) {
                callback(response);
            },
            error: function () {
                alert('The service is unavailable.');
            }
        });
    };

    var getWeatherByCityCoordinates = function (city_lat, city_lon, callback) {
        var pathTemp = PATH + '/weather/cities/coord/' + city_lat +'/' + city_lon;
        $.ajax({
            url: pathTemp,
            method: 'GET',
            headers: {  'Access-Control-Allow-Origin': '*' },
            success: function (response) {
                callback(response);
            },
            error: function () {
                alert('The service is unavailable.');
            }
        });
    };

    var getWeatherByCityZipCode = function (city_zipCode, city_countryCode, callback) {
        var pathTemp = PATH + '/weather/cities/zipcode/' + city_zipCode +'/countrycode/' + city_countryCode;
        $.ajax({
            url: pathTemp,
            method: 'GET',
            headers: {  'Access-Control-Allow-Origin': '*' },
            success: function (response) {
                callback(response);
            },
            error: function () {
                alert('The service is unavailable.');
            }
        });
    };


    return {
        getWeatherByCityId: getWeatherByCityId,
        getWeatherByCityName: getWeatherByCityName,
        getWeatherByCityCoordinates:getWeatherByCityCoordinates,
        getWeatherByCityZipCode:getWeatherByCityZipCode
    };

})(window,document,$);

/**********************************************************
 *
 * @type {{renderByCityName: renderByCityName, renderByZipCode: renderByZipCode, renderResponse: renderResponse, hideOptions: hideOptions, renderByCityId: renderByCityId, renderByCoordinate: renderByCoordinate}}
 */
var Render = (function (window, document, $) {

    var renderByCityId = function () {
        hideOptions();
        $('.option_cityID').show();
    };

    var renderByCityName = function () {
        hideOptions();
        $('.option_cityName').show();
    };

    var renderByCoordinate = function () {
        hideOptions();
        $('.option_cityCoord').show();
    };

    var renderByZipCode = function () {
        hideOptions();
        $('.option_cityZipcode').show();
    };


    var hideOptions = function () {
        $('.option').hide();
        $('#renderResponse').empty();
    };

    var renderResponse = function ( data ) {

        $('#renderResponse').empty();
        var responseBuilder = '';

        if ( data.code === 200 ) {
           responseBuilder +=   '<div class="content" align="center">' +
                                    '<label>Current DateTime: <b>'+ data.todayDate+'</b> </label>'+
                                    '<br/>'+
                                    '<label>City Name: <b>'+ data.cityName + '</b></label>'+
                                    '<br/>'+
                                    '<label>Weather Description: <b>'+ data.weatherDescription +'</b></label>'+
                                    '<br/>'+
                                    '<label>Fahrenheit: <b>'+ data.temperatureFahrenheit +'º</b></label>'+
                                    '<br/>'+
                                    '<label>Celsius: <b>'+ data.temperatureCelsius +'º</b></label>'+
                                    '<br/>'+
                                    '<label>Sunrise Time: <b>'+ data.sunriseTime +'</b></label>'+
                                    '<br/>'+
                                    '<label>Sunset Time:<b>'+ data.sunsetTime+'</b></label>'+
                                '</div>';
        } else {
           responseBuilder +=   '<div>' +
                                    '<label><b>'+data.msg+'</b></label>'+
                                '</div>';
        }

        $('#renderResponse').append($(responseBuilder));
    };

    return {
        renderByCityId: renderByCityId,
        renderByCityName: renderByCityName,
        renderByCoordinate: renderByCoordinate,
        renderByZipCode: renderByZipCode,
        hideOptions:hideOptions,
        renderResponse:renderResponse
    };

})(window, document, $);


/*****************************************************
 *                  INIT Function                    *
 *****************************************************/

var Init = (function (window, document, $) {
    
    $(document).ready(function () {
        Render.hideOptions();
    });
    
})(window, document, $);


/*****************************************************************
 *
 * @type {{getWeatherByCityId: getWeatherByCityId, getWeatherByCityZipCode: getWeatherByCityZipCode, getWeatherByCityName: getWeatherByCityName, getWeatherByCityCoordinates: getWeatherByCityCoordinates}}
 */
var Controller = (function (window, document, $) {

    var getWeatherByCityId = function ( element ) {
        var city_id = Number($(element).val());

        if ( city_id === -1 ) {
            return;
        } else if( city_id.length === 0  || city_id <= 0 ) {
            alert('A City ID must be provided or it must be greater than zero.') ;
        } else {
            Services.getWeatherByCityId(city_id, Render.renderResponse);
        }
    };

    var getWeatherByCityName = function () {
        var city_name = $('#city_name').val();
        $('#city_name').val('');

        if ( city_name.length === 0 ) {
            alert('A Name must be provided.');
        } else {
            Services.getWeatherByCityName(city_name, Render.renderResponse);
        }
    };

    var getWeatherByCityCoordinates = function () {
        var city_lat = $('#city_lat').val();
        var city_lon = $('#city_lon').val();
        $('#city_lat').val('');
        $('#city_lon').val('');

        if ( city_lat.length === 0 || city_lon === 0 ) {
            alert('Latitude and Longitude must be provided.');
        } else {
            Services.getWeatherByCityCoordinates(city_lat, city_lon, Render.renderResponse);
        }
    };

    var getWeatherByCityZipCode = function () {
        var city_zipcode = $('#city_zipcode').val();
        var city_countrycode = $('#city_countrycode').val();
        $('#city_zipcode').val('');
        $('#city_countrycode').val('');

        if ( city_zipcode.length === 0 || city_countrycode.length === 0 ) {
            alert('ZipCode and Country Code must be provided.');
        } else {
            Services.getWeatherByCityZipCode(city_zipcode, city_countrycode, Render.renderResponse);
        }

    };

    return {
        getWeatherByCityId: getWeatherByCityId,
        getWeatherByCityName:getWeatherByCityName,
        getWeatherByCityZipCode:getWeatherByCityZipCode,
        getWeatherByCityCoordinates:getWeatherByCityCoordinates,

    }


})(window, document, $);