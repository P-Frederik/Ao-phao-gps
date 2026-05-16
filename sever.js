const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let lat = 10.7769;
let lng = 106.7009;

/*
==========================
FAKE GPS
==========================
*/

setInterval(() => {
  lat += (Math.random() - 0.5) * 0.001;

  lng += (Math.random() - 0.5) * 0.001;

  const gps = {
    lat,
    lng,
  };

  console.log(gps);

  io.emit("gps", gps);
}, 2000);

io.on("connection", (socket) => {
  console.log("Web connected");
});

server.listen(3000, () => {
  console.log("================================");

  console.log("RUN:");
  console.log("http://localhost:5500");

  console.log("================================");
});
