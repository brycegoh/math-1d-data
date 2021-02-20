const csv = require('csv-parser');
const fs = require('fs');

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


var x = fs.readFileSync('coords.txt', 'utf8');
const data = x.replace(/(\r)/gm, "").split("\n")
let container = ""

fs.writeFile("./distance.csv", "longitude,latitude,distance\n", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 

data.forEach(i=>{
    const coords = i.split(",")
    const distance = getDistanceFromLatLonInKm( parseFloat(coords[1]) , parseFloat(coords[0]) , 3.116, 101.325  )
    if(parseFloat(coords[1]) == 3.116 && parseFloat(coords[0])==101.325){
      console.log(coords)
    }
    container = container + `${parseFloat(coords[0])},${parseFloat(coords[1])},${distance}\n`
})

// console.log(parseFloat(coords[0]),parseFloat(coords[1]) )
    fs.appendFile('./distance.csv', container, function (err) {
        if (err) throw err;
        // console.log('set!');
    });
