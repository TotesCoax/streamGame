//Game engine import
const Game = require("./gameEngineStuff/mechanics")

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
      theMasterController(Game.newGameState())
    }

    client.on('newGame', handleNewGame)

    function handleNewGame(){
      console.log("New game has been requested.")
      theMasterController(Game.NewGameSetup())
    }

    client.on('sendChoice', handleChoice)

    function handleChoice(choiceObjectFromClient){
      console.log("Choice has been received.")
      theMasterController(Game.setPlayerStatus(choiceObjectFromClient))
    }

    client.on("useItem", handleItem)

    function handleItem(data){
      console.log("Item use has been received.")
      theMasterController(Game.useConsumable(data))
    }

    client.on('startTurn', handleStartTurn)

    function handleStartTurn(){
      console.log("New turn has been requested.")
      theMasterController(Game.RollingPhase())
    }

    client.on('startScenario', handleNewScneario)

    function handleNewScneario(){
      console.log("Start scenario has been requested.")
      theMasterController(Game.startNewScenario())
    }

    client.on('itemOver', handleItemOver)

    function handleItemOver(){
      console.log("Item phase is over.")
      theMasterController(Game.ItemPhaseDone())
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
      console.log("Roll has been requested.")
      theMasterController(Game.rollBoth())
    }

    client.on('useAbility', handleAbility)

    function handleAbility(abilityObjectFromClient){
      console.log("Ability use has been received.")
      theMasterController(Game.useAbility(abilityObjectFromClient))
    }

    client.on('toAttackPhase', handleAttackPhase)

    function handleAttackPhase(){
      console.log("Attack Phase has been requested.")
      theMasterController(Game.AttackPhase())
    }

    client.on('useAttack', handleAttack)

    function handleAttack(attackObjFromClient){
      console.log("Attack declaration has been received.")
      theMasterController(Game.attack(attackObjFromClient))
    }

    client.on('endAttack', handleEndAttackPhase)

    function handleEndAttackPhase() {
      console.log("End attack phase has been requested.")
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
        case "itemsNotice":
          console.log("Sending an items notice!")
          client.emit('itemsNotice', data)
          break;
        case "itemUsed":
          console.log("Sending an item used notice!")
          client.emit('itemUsed', data)
          break;
        case "scenarioDefeated":
          console.log("Sending a scenario defeated notice")
          client.emit('scenarioDefeated', data)
          break;
        default:
          console.log("Sending new gamestate!")
          client.emit('gamestate', data)
          break;
      }

    }


    client.on('disconnect', () => console.log("Client disconnected"))

})



httpServer.listen(process.env.PORT || 3000)


