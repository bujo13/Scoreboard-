const express = require("express"); la 
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let game = {
  home: 0,
  away: 0,
  time: 0,
  running: false
};

io.on("connection", (socket) => {
  socket.emit("game", game);
console.log("CLIENT CONECTAT", socket.id);
  socket.on("homePlus", () => {
    game.home++;
    io.emit("game", game);


  socket.on("awayPlus", () => {
    game.away++;
    io.emit("game", game);
  });

  socket.on("start", () => {
    game.running = true;
    io.emit("game", game);
  });

  socket.on("stop", () => {
    game.running = false;
    io.emit("game", game);
  });

  socket.on("reset", () => {
    game.home = 0;
    game.away = 0;
    game.time = 0;
    game.running = false;
    io.emit("game", game);
  });

  socket.on("setTime", (seconds) => {
    game.time = Math.max(0, Number(seconds) || 0);
    io.emit("game", game);
  });
});

setInterval(() => {
  if (game.running) {
    game.time++;
    io.emit("game", game);
  }
}, 1000);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Scoreboard running on port ${PORT}`);
});
