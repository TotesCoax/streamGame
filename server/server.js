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
    client.emit('init', { data: "Connection established!" })
    console.log("Client connected!")

    client.on('requestBoardState', handleRequestEvent)

    function handleRequestEvent(){
      console.log("Gamestate has been requested.")
      client.emit('gamestate' , Game.newGameState())
      console.log("Gamestate sent out")
    }

    client.on('newGame', handleNewGame)

    function handleNewGame(){
      theMasterController(Game.NewGameSetup())
    }

    client.on('sendChoice', handleChoice)

    function handleChoice(choiceObjectFromClient){
      theMasterController(Game.setPlayerStatus(choiceObjectFromClient))
    }

    client.on('startTurn', handleStartTurn)

    function handleStartTurn(){
      theMasterController(Game.RollingPhase())
    }

    client.on('keepDie', handleKeepDie)

    function handleKeepDie(dieIDFromClient){
      theMasterController(Game.keepDie(dieIDFromClient))
    }

    client.on('submitDie', handleSubmitDie)

    function handleSubmitDie(dieIDFromClient){
      theMasterController(Game.submitDie(dieIDFromClient))
    }

    client.on('roll', handleRoll)

    function handleRoll(){
      theMasterController(Game.rollBoth())
    }

    client.on('useAbility', handleAbility)

    function handleAbility(abilityObjectFromClient){
      theMasterController(Game.useAbility(abilityObjectFromClient))
    }

    client.on('toAttackPhase', handleAttackPhase)

    function handleAttackPhase(){
      theMasterController(Game.AttackPhase())
    }

    client.on('useAttack', handleAttack)

    function handleAttack(attackObjFromClient){
      theMasterController(Game.attack(attackObjFromClient))
    }

    client.on('endAttack', handleEndAttackPhase)

    function handleEndAttackPhase() {
      theMasterController(Game.endAttackPhase())
    }

    //This function dictates the type of communications the client will get, so it can respond accordingly.
    function theMasterController(data){
      console.log(data)
      console.log(data.type)
      switch (data.type) {
        case "prompt":
          console.log("Sending a prompt request!")
          client.emit('prompt', data)
          break;
        case "alert":
          console.log("Sending an alert!")
          client.emit('alert', data)
          break;
        case "itemUsed":
          console.log("Sending an item used notice!")
          client.emit('itemUsed', data)
        default:
          console.log("Sending new gamestate!")
          client.emit('gamestate', data)
          break;
      }

    }


    client.on('disconnect', () => console.log("Client disconnected"))

})



httpServer.listen(3000)


