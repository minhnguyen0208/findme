const output = document.getElementById('output');
const fileInput = document.getElementById('file-input');

if(fileInput) {
    fileInput.addEventListener('change', (e) => doSomethingWithFiles(e.target.files));
}

window.addEventListener('load',function(){
    if(fileInput) {
        fileInput.addEventListener('change', (e) => doSomethingWithFiles(e.target.files));
    }
});

function doSomethingWithFiles(fileList) {
  let file = null;

  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }

  if (file !== null) {
    //output.src = URL.createObjectURL(file);
    EXIF.getData(file, function() {
        myData = this;
        if(getLocationImage(myData).lat !== 0 || getLocationImage(myData).lng !== 0) {
            var position = getLocationImage(myData);
            var latitude = position.lat;
            var longitude = position.lng;
    
            document.getElementById("latitude").innerHTML = 'Latitude : '+latitude;
            document.getElementById("longitude").innerHTML = 'Longitude : '+longitude;

            initMap(latitude,longitude);
        }else {
            alert('Not found location');
        }
    });
  }
}

function getLocationImage(data) {
    var position ={lat: 0, lng: 0};
    // Calculate latitude decimal
    if(data.exifdata !== undefined) {
        var latDegree = data.exifdata.GPSLatitude[0].numerator/data.exifdata.GPSLongitude[0].denominator;
        var latMinute = data.exifdata.GPSLatitude[1].numerator/data.exifdata.GPSLongitude[1].denominator;
        var latSecond = data.exifdata.GPSLatitude[2].numerator/data.exifdata.GPSLongitude[2].denominator;
        var latDirection = data.exifdata.GPSLatitudeRef;
    
        var latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);
    
        // Calculate longitude decimal
        var lonDegree = data.exifdata.GPSLongitude[0].numerator/data.exifdata.GPSLongitude[0].denominator;
        var lonMinute = data.exifdata.GPSLongitude[1].numerator/data.exifdata.GPSLongitude[1].denominator;
        var lonSecond = data.exifdata.GPSLongitude[2].numerator/data.exifdata.GPSLongitude[2].denominator;
        var lonDirection = data.exifdata.GPSLongitudeRef;
    
        var lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);

        var position ={lat: latFinal, lng: lonFinal};
        document.getElementById('output').innerHTML = '<a href="http://www.google.com/maps/place/'+latFinal+','+lonFinal+'" target="_blank">Google Maps</a>';
    }
    return position;
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes/60) + (seconds/3600);
    
    if (direction == "S" || direction == "W") {
        dd = dd * -1; 
    }
    return dd;
}