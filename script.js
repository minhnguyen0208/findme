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
    // Not allow location 
    //alert('You must allow location to view map !!!')
    // fetch(`http://ip-api.com/json`)
    // .then( res => res.json())
    // .then(response => {
    //     initMap(response.lat,response.lon);
    //     console.log("User's Location Info: ", response)
    //  })
    //  .catch(status => {
    //     console.log('Request failed.  Returned status of', status)
    //  })
    initAutocomplete();
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function reverseGeocodingWithGoogle(longitude,latitude) {
  var APIKEY = 'AIzaSyC87_S3_JC050DTISg0eYJY16RS4kF4IOM';
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${APIKEY}`)
  .then( res => res.json())
  .then(response => {
      initMap(latitude,longitude);
      console.log("User's Location Info: ", response)
   })
   .catch(status => {
      console.log('Request failed.  Returned status of', status)
   })
}

function initMap(latitude =0 ,longitude=0 ) {
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18
  });
  map.setCenter( {lat: latitude, lng: longitude});
      new google.maps.Marker({
        map: map,
        position:  {lat: latitude, lng: longitude}
  });
}

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    var latitude=markers[0].getPosition().lat();
    var longitude=markers[0].getPosition().lng();
    document.getElementById("latitude").innerHTML = 'Latitude : '+latitude;
    document.getElementById("longitude").innerHTML = 'Longitude : '+longitude;
  });
}