const axios = require('axios');
var utm = require('utm')
var fs = require('graceful-fs')

var delay = require('axios-delay')
const delayAdapterEnhancer = delay.delayAdapterEnhancer
 
const api = axios.create({
  adapter: delayAdapterEnhancer(axios.defaults.adapter)
});

const getData = async () => {

    fs.writeFile("./data.csv", "longitude,latitude,coord_x,coord_y,coord_easting,coord_northing,time,dt,co,no,no2,o3,so2,pm2_5,pm10,nh3\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    fs.writeFile("./latlog.csv", "longitude,latitude,coord_x,coord_y\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was created!");
    }); 

    const key = ""
    const start = "1612915200"
    const end = "1613520000"

    const interest = [ "0,0", "0,-19000", "0,19000" , "19000,-19000", "19000,0", "19000,19000" ]

    const { easting, northing, zoneNum, zoneLetter } = utm.fromLatLon(3.1160019681294817,101.32495701586585)
    for (x = 0; x <= 19000; x=x+500) { 
        const newEasting = easting + x
        for (y = 0; y <= 19000; y=y+500) { 
            // setTimeout( function () {})
            const newNorthing = northing + y
            const secondNewNorthing = northing - y
            const newCoord = utm.toLatLon(newEasting, newNorthing, zoneNum, undefined, true, strict = true)
            const lat = newCoord.latitude
            const lon = newCoord.longitude
                    // setTimeout( function () {
                        api.get(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${key}`, {
                            delay: 10000 // delay 1 second
                          })
                        .then(res=>{
                            const data = res.data
                            const airData = data.list
                            airData.map( dataPoint => {

                                let time = new Date(dataPoint.dt * 1000)  //epoch

                                fs.appendFile('./data.csv', `${data.coord.lon},${data.coord.lat},${newEasting - easting},${newNorthing - northing},${newEasting},${newNorthing},${time},${dataPoint.dt},${dataPoint.components.co},${dataPoint.components.no},${dataPoint.components.no2},${dataPoint.components.o3},${dataPoint.components.so2},${dataPoint.components.pm2_5},${dataPoint.components.pm10},${dataPoint.components.nh3}\n`, function (err) {
                                    if (err) throw err;
                                    // console.log('Saved!');
                                });
                            } )
                            
                            
                            if (interest.includes(`${newEasting - easting},${newNorthing - northing}`)){
                                
                                fs.appendFile('./latlog.csv', `${data.coord.lon},${data.coord.lat},${newEasting - easting},${newNorthing - northing}\n`, function (err) {
                                    if (err) throw err;
                                    console.log('set!');
                                });
                            }
                            

                            console.log(northing,  secondNewNorthing, northing - secondNewNorthing )
                            const newCoord2 = utm.toLatLon(newEasting, secondNewNorthing, zoneNum, undefined, true, strict = true)
                            const lat2 = newCoord2.latitude
                            const lon2 = newCoord2.longitude
                            // setTimeout( function () {
                                api.get(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat2}&lon=${lon2}&start=${start}&end=${end}&appid=${key}`, {
                                    delay: 10000 // delay 1 second
                                  })
                                .then(res=>{
                                    const data = res.data
                                    const airData = data.list

                                    if (interest.includes(`${newEasting - easting},${northing - secondNewNorthing}`)){
                                        fs.appendFile('./latlog.csv', `${data.coord.lon},${data.coord.lat},${newEasting - easting},${northing - secondNewNorthing}\n`, function (err) {
                                            if (err) throw err;
                                            console.log('set!');
                                        });
                                    }

                                    
                                    airData.map( dataPoint => {

                                        const time2 = new Date(dataPoint.dt * 1000)  //epoch

                                        fs.appendFile('./data.csv', `${data.coord.lon},${data.coord.lat},${newEasting - easting},${northing - secondNewNorthing},${newEasting},${secondNewNorthing},${time2},${dataPoint.dt},${dataPoint.components.co},${dataPoint.components.no},${dataPoint.components.no2},${dataPoint.components.o3},${dataPoint.components.so2},${dataPoint.components.pm2_5},${dataPoint.components.pm10},${dataPoint.components.nh3}\n`, function (err) {
                                            if (err) throw err;
                                            // console.log('Saved!');
                                        });
                                    } )
                                })
                            // },15*1000)
                            
                        })
                    // }, 15*1000)
            // }, 30 * 1000);
        }
    }
}

getData() 
