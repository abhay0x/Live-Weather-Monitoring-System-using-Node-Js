const http=require('http');
const fs=require('fs')
const requests=require('requests');

const homefile=fs.readFileSync('home.html','utf-8');
 
const replaceVal = (tempVal, orgVal) => {
  let cel=(orgVal.main.temp)-273;
    let temperature = tempVal.replace("{%tempval%}", cel);
    temperature = temperature.replace("{%minval%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%maxval%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };

const server = http.createServer((req, res) => {
    if (req.url == "/") {
      requests(
        `https://api.openweathermap.org/data/2.5/weather?lat=18.32&lon=73.51&appid=2cfa06566683ef96e9df83a182037e8c`
      )
        .on("data", (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
          // console.log(arrData[0].main.temp);
          const realTimeData = arrData
            .map((val) => replaceVal(homefile, val))
            .join("");
          res.write(realTimeData);
          // console.log(realTimeData);
        })
        .on("end", (err) => {
          if (err) return console.log("connection closed due to errors", err);
          res.end();
        });
    } else {
      res.end("File not found");
    }
  });



server.listen(8000,'127.0.0.1',()=>{
    console.log('sever is lisning on port 8000')
});