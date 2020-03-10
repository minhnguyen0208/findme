const output = document.getElementById('output');
const fileInput = document.getElementById('file-input');

if(fileInput) {
    fileInput.addEventListener('change', (e) => doSomethingWithFiles(e.target.files));
}

function doSomethingWithFiles(fileList) {
    console.log(123);
  let file = null;

  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }

  if (file !== null) {
    output.src = URL.createObjectURL(file);
    EXIF.getData(this, function() {

        myData = this;

        console.log(myData.exifdata);

        var latitude = getLocationImage(myData).lat;
        var longitude = getLocationImage(myData).lng;

        document.getElementById("latitude").innerHTML = 'Latitude : '+latitude;
        document.getElementById("longitude").innerHTML = 'Longitude : '+longitude;
    });
  }
}

function getLocationImage(data) {
    // Calculate latitude decimal
    var latDegree = data.exifdata.GPSLatitude[0].numerator;
    var latMinute = data.exifdata.GPSLatitude[1].numerator;
    var latSecond = data.exifdata.GPSLatitude[2].numerator;
    var latDirection = data.exifdata.GPSLatitudeRef;

    var latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);

    // Calculate longitude decimal
    var lonDegree = data.exifdata.GPSLongitude[0].numerator;
    var lonMinute = data.exifdata.GPSLongitude[1].numerator;
    var lonSecond = data.exifdata.GPSLongitude[2].numerator;
    var lonDirection = data.exifdata.GPSLongitudeRef;

    var lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
    var position ={lat: latFinal, lng: lonFinal};
    return position;
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    
    var dd = degrees + (minutes/60) + (seconds/3600);
    
    if (direction == "S" || direction == "W") {
        dd = dd * -1; 
    }
    
    return dd;
}