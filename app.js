const express = require("express");
const http = require("http");

const port = process.argv[2] || 3000;
const app = express();

const {WebSocketServer, WebSocket} = require("ws")

app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);

server.listen(port)

console.log(`Server running on port ${port}`)

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/splash.html")
})

app.get("/game", function (req, res) {
  res.sendFile(__dirname + "/public/game.html")
}) 

const wss = new WebSocketServer({server})

let playerCounter = 0

let playerQueue = [];

let lowest_turns;

let amount_of_games = 0;

let highest_streak = 0;

let games = []

wss.on("connection", function (socket, req) {
  const player = socket

  player.id = playerCounter++

  if (playerQueue.length < 1) {

    playerQueue.push(player);

  } else {

    const otherPlayer = playerQueue.shift();
    let game = new Game(amount_of_games++, player, otherPlayer);

    games[player.id] = game
    games[otherPlayer.id] = game

    otherPlayer.send("gamestart")
    player.send("gamestart")
    
  }


  player.send(JSON.stringify())

  player.onmessage = function({data}) {
    if(data == "hello") return
    
    const {actionName, action} = JSON.parse(data)

    console.log(actionName, action, data)

    if(actionName == "card") {
      if(!games[player.id].images[action-1].turned) {
        player.send(JSON.stringify({image: games[player.id].images[action-1].image, card: action}))
        games[player.id].images[action-1].turned = true
      }
    }
  }

})

function shuffleArray(array) {
  let copyArray = [...array]
  for (let i = copyArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      const temp = copyArray[i]
      copyArray[i] = copyArray[j]
      copyArray[j] = temp
  }
  return copyArray
}

const images = [
                    "arch-building.png",
                    "arch-building.png", 
                    "aula.png",
                    "aula.png",
                    "civil-eng.png",
                    "civil-eng.png",
                    "ewi.png",
                    "ewi.png",
                    "fellowship.png",
                    "fellowship.png",
                    "library.png",
                    "library.png",
                    "maritime-tech.png",
                    "maritime-tech.png",
                    "pulse.png",
                    "pulse.png",
                    "X-tudelft.png",
                    "X-tudelft.png"
                ];



function Game(id, one, two) {
    this.id = id

    this.player1 = one
    this.player2 = two
    
    this.player1_score = 0
    
    this.player2_score = 0
    
    this.player1_turn = true
    
    this.thereIsWinner = false
    this.winner = 0
    
    this.amount_turns = 0
  
    this.amount_streak = 0

    this.highest_streak = 0

    this.lastMove = null

    this.images = shuffleArray(images).map(image => ({image, turned: fase}))
     
}