const axios = require('axios');
var utm = require('utm')
var fs = require('graceful-fs')

const getData = async () => {

    fs.writeFile("./data.csv", "longitude,latitude,coord_x,coord_y,coord_easting,coord_northing,time,dt,co,no,o3,so2,pm2_5,pm10,nh3\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    const promise = []

    const container = []

    
    const start = "1612915200"
    const end = "1613520000"

    let { easting, northing, zoneNum, zoneLetter } = utm.fromLatLon(3.1160019681294817,101.32495701586585)
    for (x = 0; x < 19100; x=x+100) { 
        let newEasting = easting + x
        for (y = 0; y < 19100; y=y+100) { 
            let newNorthing = northing + y
            let secondNewNorthing = northing - y
            let newCoord = utm.toLatLon(newEasting, newNorthing, zoneNum, zoneLetter, undefined, strict = true)
            let lat = newCoord.latitude
            let lon = newCoord.longitude
            // promise.push(
                axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${key}`)
                .then(res=>{
                    const data = res.data
                    const airData = data.list
                    airData.map( dataPoint => {

                        let time = new Date(dataPoint.dt * 1000)  //epoch

                        fs.appendFile('./data.csv', `${data.coord.lon},${data.coord.lat},${newEasting - easting},${newNorthing - northing},${newEasting},${newNorthing},${time},${dataPoint.dt},${dataPoint.components.co},${dataPoint.components.no},${dataPoint.components.o3},${dataPoint.components.so2},${dataPoint.components.pm2_5},${dataPoint.components.pm10},${dataPoint.components.nh3}\n`, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                          });
                    } )

                    let newCoord2 = utm.toLatLon(newEasting, secondNewNorthing, zoneNum, zoneLetter, undefined, strict = true)
                    let lat2 = newCoord2.latitude
                    let lon2 = newCoord2.longitude
                    axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat2}&lon=${lon2}&start=${start}&end=${end}&appid=${key}`)
                    .then(res=>{
                        const data = res.data
                        const airData = data.list
                        airData.map( dataPoint => {

                            let time = new Date(dataPoint.dt * 1000)  //epoch

                            fs.appendFile('./data.csv', `${data.coord.lon},${data.coord.lat},${newEasting - easting},${secondNewNorthing - northing},${secondNewNorthing},${newNorthing},${time},${dataPoint.dt},${dataPoint.components.co},${dataPoint.components.no},${dataPoint.components.o3},${dataPoint.components.so2},${dataPoint.components.pm2_5},${dataPoint.components.pm10},${dataPoint.components.nh3}\n`, function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            });
                        } )
                    })

                    

                })
            // )
        }
    }
    // Promise.all(promise)
    // .then(()=>{
    //     console.log(container)
    //     let csv = '';
    //     let header = Object.keys(container[0]).join(',');
    //     let values = container.map(o => Object.values(o).join(',')).join('\n');

    //     csv += header + '\n' + values;
    //     console.log(csv)
    //     fs.writeFile("./data.csv", csv, function(err) {
    //         if(err) {
    //             return console.log(err);
    //         }
    //         console.log("The file was saved!");
    //     }); 
    // })
}

// {
//     status: 'success',
//     data: {
//       city: 'Klang',
//       state: 'Selangor',
//       country: 'Malaysia',
//       location: { type: 'Point', coordinates: [Array] },
//       current: { weather: [Object], pollution: [Object] }
//     }
// }

// const main = () => {

//     const { easting, northing, zoneNum, zoneLetter } = utm.fromLatLon(3.1160019681294817,101.32495701586585)

//     console.log(utm.fromLatLon(3.1160019681294817,101.32495701586585))

//     // data = getData( 3.12400657403947 ,101.3259114631907 )

// }

getData() 


//3. Set up CSV


