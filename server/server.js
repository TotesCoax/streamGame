//Game engine import
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
      client.emit('gamestate' , Game.gamestate())
      console.log("Gamestate sent out")
    }

    client.on('newGame', handleNewGame)

    function handleNewGame(){
      theMasterController(Game.NewGameSetup())
    }

    client.on('sendPlayerStatus', handlePlayerStatus)

    function handlePlayerStatus(choiceObject){
      theMasterController(Game.setPlayerStatus(choiceObject))
    }

    client.on('keepDie', handleKeepDie)

    function handleKeepDie(dieID){
      theMasterController(Game.keepDie(dieID))
    }

    client.on('roll', handleRoll)

    function handleRoll(){
      theMasterController(Game.rollBoth())
    }

    client.on('useAbility', handleAbility)

    function handleAbility(abilityObject){
      theMasterController(Game.useAbility(abilityObject))
    }

    client.on('toAttackPhase', handleAttackPhase)

    function handleAttackPhase(){
      theMasterController(Game.AttackPhase())
    }

    //This function dictates the type of communications the client will get, so it can respond accordingly.
    function theMasterController(data){
      console.log(data)
      switch (data.type) {
        case "playerRequest":
          console.log("Sending a prompt request!")
          client.emit('prompt', data)
          break;
        case "alert":
          console.log("Sending an alert!")
          client.emit('alert', data)
          break;
        default:
          console.log("Sending new gamestate!")
          client.emit('gamestate', Game.gamestate())
          break;
      }

    }


    client.on('disconnect', () => console.log("Client disconnected"))

})



httpServer.listen(3000)


