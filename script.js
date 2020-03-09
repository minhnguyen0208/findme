// Excerpt from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

function geoFindMe() {
    if (!navigator.geolocation){
     console.log("Geolocation is not supported by your browser");
      return;
    }
    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      document.getElementById("latitude").innerHTML = 'Latitude : '+latitude;
      document.getElementById("longitude").innerHTML = 'Longitude : '+longitude;
      reverseGeocodingWithGoogle(longitude, latitude)
    }
    function error() {
      alert('You must allow location to view map !!!')
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function reverseGeocodingWithGoogle(latitude, longitude) {
    var APIKEY = 'AIzaSyC87_S3_JC050DTISg0eYJY16RS4kF4IOM';
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${longitude},${latitude}&key=${APIKEY}`)
    .then( res => res.json())
    .then(response => {
        initMap(longitude,latitude);
        console.log("User's Location Info: ", response)
     })
     .catch(status => {
        console.log('Request failed.  Returned status of', status)
     })
  }

  function initMap(latitude =0 ,longitude=0 ) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
    });
    map.setCenter( {lat: latitude, lng: longitude});
        new google.maps.Marker({
          map: map,
          position:  {lat: latitude, lng: longitude}
    });
  }
