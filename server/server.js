'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const state = {}
const clientRooms = {}

const server = express()
.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
.listen(PORT, () => console.log(`Listening on ${PORT}`));

//Game engine import
const Game = require("./gameEngineStuff/mechanics")
const { makeid } = require('./utils')

const io = socketIO(server);
console.log("Server is on!")

io.on('connection', client => {
    client.emit('init', { data: "Connection established!" })
    console.log("Client connected!", client.id)

    client.on('newSession', handleNewSession)

    function handleNewSession(data){
      console.log(data)
      let roomName = makeid(5)
      clientRooms[client.id] = roomName
      client.emit('sessionCode', roomName)

      state[roomName] = Game.serverGameState()

      client.join(roomName)
      client.username = data
      console.log("New session created: ", roomName)
    client.emit('sessionCreated', client.username)
    }

    client.on('joinSession', handleJoinSession)

    function handleJoinSession(dataFromServer){
      let sessionCode = dataFromServer.gamecode,
          username = dataFromServer.username
      const room = io.sockets.adapter.rooms.get(sessionCode)
      // console.log(io.sockets.adapter.rooms)
      console.log(username ," is trying to connect to: ", sessionCode)
      // console.log(room)
      // console.log(room.size)
      if (room){
        if (room.size === 0){
          // console.log("No session triggered")
          return
        } else if (room.size > 5){
          // console.log("Too many players triggered");
          client.emit('tooManyPlayers')
          return
        }
      }
      else {
        client.emit('noSession')
        return
      }
      clientRooms[client.id] = sessionCode
      client.join(sessionCode)
      client.emit('sessionCode', sessionCode)
      console.log(username, " joined: ", sessionCode, "Size is now: ", room.size)
      client.username = username
      client.emit('playerJoined', client.username)  
    }

    client.on('requestBoardState', handleRequestEvent)

    function handleRequestEvent(){
      console.log("Gamestate has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.newGameState(), roomName)
    }

    client.on('newGame', handleNewGame)

    function handleNewGame(){
      console.log("New game has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.NewGameSetup(), roomName)
    }

    client.on('sendChoice', handleChoice)

    function handleChoice(choiceObjectFromClient){
      console.log("Choice has been received.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.setPlayerStatus(choiceObjectFromClient), roomName)
    }

    client.on("useItem", handleItem)

    function handleItem(data){
      console.log("Item use has been received.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.useConsumable(data), roomName)
    }

    client.on('startTurn', handleStartTurn)

    function handleStartTurn(){
      console.log("New turn has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.RollingPhase(), roomName)
    }

    client.on('startScenario', handleNewScneario)

    function handleNewScneario(){
      console.log("Start scenario has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.startNewScenario(), roomName)
    }

    client.on('itemOver', handleItemOver)

    function handleItemOver(){
      console.log("Item phase is over.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.ItemPhaseDone(), roomName)
    }

    client.on('keepDie', handleKeepDie)

    function handleKeepDie(dieIDFromClient){
      let roomName = clientRooms[client.id]
      theMasterController(Game.keepDie(dieIDFromClient), roomName)
    }

    client.on('submitDie', handleSubmitDie)

    function handleSubmitDie(dieIDFromClient){
      let roomName = clientRooms[client.id]
      theMasterController(Game.submitDie(dieIDFromClient), roomName)
    }

    client.on('roll', handleRoll)

    function handleRoll(status){
      console.log("Roll has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.wantsReroll(status), roomName)
    }

    client.on('useAbility', handleAbility)

    function handleAbility(abilityObjectFromClient){
      console.log("Ability use has been received.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.useAbility(abilityObjectFromClient), roomName)
    }

    client.on('toAttackPhase', handleAttackPhase)

    function handleAttackPhase(){
      console.log("Attack Phase has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.AttackPhase(), roomName)
    }

    client.on('useAttack', handleAttack)

    function handleAttack(attackObjFromClient){
      console.log("Attack declaration has been received.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.attack(attackObjFromClient), roomName)
    }

    client.on('endAttack', handleEndAttackPhase)

    function handleEndAttackPhase() {
      console.log("End attack phase has been requested.")
      let roomName = clientRooms[client.id]
      theMasterController(Game.endAttackPhase(), roomName)
    }

    //This function dictates the type of communications the client will get, so it can respond accordingly.
    function theMasterController(data, roomName){
      state[roomName] = Game.serverGameState()
      // console.log("States:", state)
      // console.log(data.type)
      switch (data.type) {
        case "prompt":
          console.log("Sending a prompt request!")
          client.emit('prompt', data)
          break;
        case "alert":
          console.log("Sending an alert!")
          emitGamestateRoom(data.type, roomName, data)
          break;
        case "itemsNotice":
          console.log("Sending an items notice!")
          emitGamestateRoom(data.type, roomName, data)
          break;
        case "itemUsed":
          console.log("Sending an item used notice!")
          emitGamestateRoom(data.type, roomName, data)
          break;
        case "scenarioDefeated":
          console.log("Sending a scenario defeated notice")
          emitGamestateRoom(data.type, roomName, data)
          break;
        default:
          console.log("Sending new gamestate!")
          emitGamestateRoom('gamestate', roomName, data)
          break;
      }

    }

    function emitGamestateRoom(code, roomName, data){
      // console.log(roomName, code, data)
      io.to(roomName).emit(code, data)
    }

    client.on('disconnect', () => console.log("Client disconnected"))

})

