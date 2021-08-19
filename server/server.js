const Game = require("../gameEngineStuff/mechanics")

const httpServer = require("http").createServer()
const io = require('socket.io')(httpServer, {
    serveClient: false,
    cors: {
      //I don't like using *, but figuring out what the hell was going wrong was too much of a bother when I just want to code a prototype.
      origin: "*",
    }
  });

console.log("Server is on!")

io.on('connection', client => {
    client.emit('init', { data: "Connection established!"})
    console.log("Client connected!")

    client.on('requestBoardState', handleRequestEvent)

    function handleRequestEvent(){
      console.log("Gamestate has been requested.")
      // let exportBoard = Game.gamestate()
      client.emit('gamestate' , Game.gamestate())
      console.log("Gamestate sent out")
    }

    client.on('newGame', handleNewGame)

    function handleNewGame() {
      console.log(client)
      Game.NewGame()
      client.emit('gamestate', Game.gamestate())
    }

    client.on('disconnect', () => console.log("Client disconnected"))

})



httpServer.listen(3000)


