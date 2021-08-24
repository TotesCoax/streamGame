//Class imports
const {Die, Player, Scenario, EngineOutput, Alert, Prompt, ItemsNotice, Refresh} = require("../gameEngineStuff/classIndex")
//Card Data import
const {Boons} = require("../gameEngineStuff/decks/boons")
const {Playstyle} = require("../gameEngineStuff/decks/characters")
const {lootDeck} = require("../gameEngineStuff/decks/items")
const {scenarios} = require("../gameEngineStuff/decks/scenarioDecks")

//YOU SHOULD CONVERT PLAYSTYLE AND CARDS INTO CLASSES SOONtm

//This function is used to send the gamestate info to the front end on request.
exports.newGameState = function newExport() {
    //Gameboard object to export - use this to hide game information from the front end
    let boardExport = {
        players: board.players,
        level: board.level,
        scenarios: board.scenarios,
        dicePool: {
            active: board.dicePool.active,
            support: board.dicePool.support
        },
        attackHand: board.attackHand,
        boon: board.boon.drawn,
        gameState: gameState
    }
    return new Refresh('raw', exportGamestate())
}
//Global Object reservations
let board, gameState

//Gameboard object. To create some global variables
function resetBoard(){
    board = {
        players: [],
        level: 0,
        itemDeck: [],
        scenarios: [],
        dicePool: {
            active: [],
            support: []
        },
        attackHand: [],
        boon: {
            deck: [],
            drawn: []
        }
    }
    console.log("Board object reset")
}
resetBoard()

//Game state object to help handle some stage effects and track some fun things.
function resetGamestate(){
    gameState = {
        turnCounter: 0,
        switchCounter: 0,
        noConsumables: false,
        noAbilities: false,
        itemPhase: false,
        gameOver:  false
    }
    console.log("Gamestate object reset")
}
resetGamestate()

function exportGamestate() {
    //Gameboard object to export - use this to hide game information from the front end
    let boardExport = {
        players: board.players,
        level: board.level,
        scenarios: board.scenarios,
        dicePool: {
            active: board.dicePool.active,
            support: board.dicePool.support
        },
        attackHand: board.attackHand,
        boon: board.boon.drawn,
        gameState: gameState
    }
    return boardExport
}

//Global functions

//Deck shuffler ~ confirmed to work
function shuffle(array) {
    let m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

//Hand operations

function rollHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        hand[i].rollDie()
    }
    console.log(hand)
}

//Game over check
function isGameOver(){
    if (gameState.gameOver){
        return new Alert("The game ended! You have to start a new game.")
    }
}


//Dev object - I created this to make some coding shorthands for testing - set after Rolling phase.
let dev = {}
function setDev(){
    dev = {
        activePlay: board.players.find(player => player.status === "active"),
        supportPlay: board.players.find(player => player.status === "support"),
        currScen: board.scenarios[board.level],
        currStage: board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter],
        activeDice: board.dicePool.active,
        supportDice: board.dicePool.support,
        attackHand: board.attackHand
    }
    console.log("Dev object has been set")
}

//Dev Functions - this might get reworked for players to trade items. Right now only searches the item deck.
function devGiveItem(player, itemName) {
    let itemObject = board.itemDeck.find(item => item.name.toLowerCase() === itemName.toLowerCase()),
        itemIndex = board.itemDeck.indexOf(itemObject)
    if (itemObject){
        player.inventory.push(itemObject)
        board.itemDeck.splice(itemIndex,1)
        console.log(itemObject, " has been moved to ", player.username)
    } else {
        console.log("No item of that name found")
    }
}

//--------------------//
//Pre-Game setup functions
//--------------------//

    //Test Player generator
    //Perhaps include a sort of ready check in the future before this function executes
    //This will later be filled with some fancy shit that lets twitch users log in and control
    function populatePlayers(players){
            //Count the number of players
            //Populate the player array
        for (let i = 0; i < players.length; i++){
            //Create a Player object for each user logged in
            let user = players[i].username,
                style = players[i].style
            board.players[i] = new Player(user, style)
            console.log(board.players[i].username, " has been added")
        }
        console.log("Player array has been populated")
        console.log(board.players)
    }

    //This is just to speed up testing
    function TESTFILLpopulatePlayers(){
        board.players.length = 4
        board.players[0] = new Player("me","brash")
        board.players[1] = new Player("you","elegant")
        board.players[2] = new Player("she","staunch")
        board.players[3] = new Player("them","sly")
        console.log("TEST Function run, Player array has been populated")
        console.log(board.players)
    }

    //Prepare the item deck
    //This snags the item deck object and shuffles it around.
    //This shuffled in place so I do need to find a way to clone objects that also brings functions.
    function prepareItemDeck(){
        console.log("Preparing the item deck")
        board.itemDeck = shuffle(lootDeck)
        console.log("Item deck has been shuffled")
        console.log(board.itemDeck)
    }

    //Prepare the boon deck

    function prepareBoonDeck(){
        console.log("Preparing the boon deck")
        //Cloning and shuffling the item deck, moving it
        board.boon.deck = shuffle(Boons)
        console.log("Boon deck has been shuffled")
        console.log(board.boon.deck)
    }

    //Prepare all player abilities counter based on the number of players and their level, level is board.level in most cases.
    //This should be run before any scenario effects that might modify their ability usage
    //This runs once in preGame setup but then all other instances use refresh function in end phase section
    function prepareAbilities(level, players){
        console.log("Setting the abilty counts for the scenario")
        for (let i = 0; i < players.length; i++){
            let numberOfPlayers = players.length - 2 //There must always be two players, and this works with the abilityMax array to grant the right number
            console.log("For player: " + players[i].username + " Ability max from card:" + players[i].playstyle.abilityMax[level][numberOfPlayers])
            players[i].abilityScenarioMax = players[i].playstyle.abilityMax[level][numberOfPlayers]
            console.log("Default bility count set to:" + players[i].abilityScenarioMax)
        }
        console.log("The ability counter has been prepared")
    }




//--------------------//
//Scenario setup phase
//--------------------//

function setupScenario(deck, level){
    prepareScenario(deck, level)
    console.log("The scenario for level " + (Number(level) + 1) + " has been prepared.")
}

//Activate a scenario
//This clones and shuffles the deck and draws on scenario, then adds that scenario to global board object
function prepareScenario(deck, level){
    console.log("Pulling the scenario card");
    let clone = shuffle(deck[level])
    board.scenarios.push(new Scenario(clone[0]))
    console.log("The scenario card has been pulled")
    console.log(board.scenarios)
}


//Populating the player hands based on drawn scenario
function setHands(scenario){
    console.log("Setting player hands for the scenario")
    console.log(scenario.card.activeDice, scenario.card.suppDice)

    function populateHand(hand, num){
        for (let i = 0; i < num; i++){
        hand[i] = new Die(Math.round(Date.now() * Math.random()))
        }
        //console.log(hand)
    }
    populateHand(board.dicePool.active, scenario.card.activeDice)
    populateHand(board.dicePool.support, scenario.card.suppDice)
    console.log("The hands have been populated")
    console.log(board.dicePool.active)
    console.log(board.dicePool.support)
}

//Currently this is a blanket reset without targetting any specific pool of players based on the max they are allowed by the stage.
//I am keeping it like this to allow some player swaps mid-turn if I want to implement that.
function setRerolls() {
    //Setting the rerolls for every player
    console.log("Setting the reroll counts for each player")
    for (let i = 0; i < board.players.length; i++){
        board.players[i].currentRerolls = board.players[i].currentRerollsMax
        console.log(board.players[i].username, board.players[i].currentRerolls);
    }
    //Looking for items that boost rerolls
    board.players.forEach(player => {
        if (player.inventory.find(item => item.timing === "reroll")){
            console.log("Reroll item found!")
            player.inventory.find(item => item.timing === "reroll").ability(player)
        }
    })
    console.log("Rerolls have been set")
}

//Applying the effect of the current stage
function applyStageEffect(currentStage){
    currentStage.effect(board.players)
}

//--------------------//
//End of Scenario setup
//--------------------//

//--------------------//
//Player Turn Setup Functions
//--------------------//

//Cycle the player statuses
function cyclePlayerStatus(players){
    //Check previously duo players status and update them
    for (let i = 0; i < players.length; i++){
        console.log(players[i].username, players[i].status)
        switch (players[i].status) {
            case "active":
                players[i].status = "inactive"
                console.log(players[i].username, " is now inactive.");
                break;

            case "support":
                players[i].status = "active"
                console.log(players[i].username, " is now active.");
                break;
    
            default:
                console.log(players[i].username + ": no status update. ", players.length)
                break;
            }
        }
    console.log("Players status has been cycled")
}

//This takes the response from the client to set the player status.
exports.setPlayerStatus = function setPlayerStatus(choiceObject){
    let chosenPlayer = board.players.find(player =>
        player.username === choiceObject.choice)
    chosenPlayer.status = choiceObject.requestCode
    if (choiceObject.requestCode === "support"){
        chosenPlayer.exhausted = true
    }
    console.log(chosenPlayer)
    if (choiceObject.requestCode === "active"){
        return startOfTurnItemsPhase()
    } else {
        let username = board.players.find(player => player.status === "active").username
        return new Alert(`It is now ${username}'s turn!`)
    }
}

function requestPlayerStatusChoice(status){
    console.log("Game is saying I need to know who is: ", status)
    let validChoices = []
    for (let i = 0; i < board.players.length; i++){
        // console.log(board.players[i].username)
        if ((board.players[i].exhausted === false) && (board.players[i].status !== "active")){
            validChoices.push(board.players[i].username)
            //console.log(validChoices)
        }
    }
    console.log(validChoices)
    //Send this to server
    return new Prompt(status, `Please pick the ${status} player`, validChoices)
}

//All Exhausted and refresh check
    //Before asking to pick a support, these will verify there are supports to pick
    //Refresh Function
    function allExhaustedRefresh(players){
        console.log("Checking if all are exhausted: ", allExhaustedQuery(players))
        if (allExhaustedQuery(players) === true){
            for (let i = 0; i < players.length; i++){
                players[i].exhausted = false
            }
        }
        console.log("allExhaustRefresh has completed")
    }
        //Checking function
        function allExhaustedQuery(players){
            console.log("exhaust check loop")
            for (let i = 0; i < players.length; i++){
                console.log(players[i].username, "exhausted: ", players[i].exhausted)
                if (players[i].exhausted === false){
                    return false
                }
            }
            return true
        }

//Check for consumable items
function checkConsumables(){
    let playersWithItems = []
    //Check each player for an inventory
    for (let i = 0; i < board.players.length; i++){
        //if that player has an items in their inventory
        if (board.players[i].inventory.length > 0){
            //check each item in their inventory if they are a type:consumable
            for (let j = 0; j < board.players[i].inventory.length; j++){
                if (board.players[i].inventory[j].type === "consumable")
                //add the username and item name to a list to export
                playersWithItems.push({username: board.players[i].username, itemname: board.players[i].inventory[j].name, consumed: board.players[i].inventory[j].consumed})
            }
        }
    }
    console.log("Players with consumables: ", playersWithItems)
    //export the list
    return playersWithItems
}

//Use consumable
function useConsumable(itemChoiceObject){
    if (gameState.itemPhase === false){
        console.log("not in phase")
        return new Alert("You can only use consumables at the start of the turn!")
    }
    let item = board.players.find(player => player.username === itemChoiceObject.username).inventory.find(item => item.name),
        target = board.players.find(player => player.usernameitem.split(" ").join("").toLowerCase() = itemChoiceObject.target.split(" ").join("").toLowerCase())
    //Checking to see if game state allows consumables
    if (gameState.noConsumables === false){
        //Checking if item is consumed
        if (!item.consumed){
            item.ability(target)
            item.consumed = true
        } else {
            console.log("Item was previously consumed", item)
            return new Alert("This item has already been used!")
        }
    } else {
        return new Alert("An effect is preventing you from using items!")

    }
}

function isAnyoneActive(){
    let foundPlayer = board.players.find(player => player.status === "active")
    console.log("Active player?: ", foundPlayer)
    return foundPlayer
}

//This function will search and apply any damage over time effects
function damageOverTimeEffect(){

    //Checking for poison status on players
    board.players.forEach(player => {
        if (player.poison > 0){
            console.log(player, " is poisoned and will take: ", player.poison, "damage")
            console.log(player.dmgCounter, " -> ", player.dmgCounter += player.poison)
            player.dmgCounter += player.poison
        }
    //Checking for that one scenario that poisons itself as a mechanic
    if (board.scenarios[board.level].poison > 0){
        console.log(board.scenarios[board.level].card.name, "detected. Applying poison countdown")
        board.scenarios[board.level].dmgCounter += board.scenarios[board.level].poison
    }
    })
}

function cleansePoison(players){
    players.forEach(player => player.poison = 0)
}


//--------------------//
//End of Player Turn Setup Functions
//--------------------//

//--------------------//
//Rolling Phase Functions
//--------------------//


//Checking for rerolls on players
function hasRerollsremaining(player){
    if (player.currentRerolls > 0){
        return true
    } else {
        return false
    }
}

//This function will look for a die ID in all the pools in the game and return it's location and die object in a response object.
function findDie(dieID){
    if (board.dicePool.active.find(die => die.id === dieID)) {
        console.log("Found in active pool!")
        return {
            loc: "active",
            die: board.dicePool.active.find(die => die.id === dieID)
        }
    } else if (board.dicePool.support.find(die => die.id === dieID)){
        console.log("Found in support pool!")
        return {
            loc: "supp",
            die: board.dicePool.support.find(die => die.id === dieID)
        }
    } else if (board.attackHand.find(die => die.id === dieID)){
        console.log("Found in attack pool!")
        return {
            loc: "attack",
            die: board.attackHand.find(die => die.id === dieID)
        }
    } else {
        return new Alert("That die was not found. We're gonna try a gamestate refresh to get your client up to date!")
    }

}

exports.keepDie = function keepDie(dieID){
    let foundDie = findDie(dieID)
    if (foundDie.type === "noDice"){
        return foundDie
    } else if (foundDie.loc !== "attack") {
        foundDie.die.toggleKeep()
        return new Refresh("diceChange", exportGamestate())
    }
}

exports.submitDie = function submitDie(dieID) {
    let foundDie = findDie(dieID)
    if (foundDie.type === "noDice"){
        return foundDie
    } else if (foundDie.loc === "attack") {
        foundDie.die.toggleSubmit()
        return new Refresh("diceChange", exportGamestate())
    }

}

exports.rollBoth = function rollBoth() {
    let active = board.players.find(player => player.status === "active"),
        support = board.players.find(player => player.status === "support")

    let activeCheck = rollActive(active),
        suppCheck = rollSupport(support)

    if (!activeCheck && !suppCheck){
        return new Alert("Both players have no rerolls remaining.")
    }
    return new Refresh("diceChange", exportGamestate())
}

function rollActive(player) {
    if((player.status === "active") && hasRerollsremaining(player)){
        rollHand(board.dicePool.active)
        console.log("Active pool has been rerolled: ", board.dicePool.active)
        player.currentRerolls--
        console.log("Reroll deducted, now checking both rerolls:")
        return moveToAttackPhaseCheck()
    } else {
        console.log(player.status, player.currentRerolls)
        return false
    }
}

function rollSupport(player){
    if((player.status === "support") && hasRerollsremaining(player)){
        rollHand(board.dicePool.support)
        console.log("Support pool has been rerolled: ", board.dicePool.support)
        player.currentRerolls--
        console.log("Reroll deducted, now checking both rerolls:")
        return moveToAttackPhaseCheck()
    } else {
        console.log(player.status, player.currentRerolls)
        return false
    }
}

//Move to attack phase? function
function moveToAttackPhaseCheck(){
    let activePlayer = board.players.find(player => player.status === "active"),
        supportPlayer = board.players.find(player => player.status === "support")

    console.log("Checking rerolls", "Active:", activePlayer.currentRerolls, " Support:", supportPlayer.currentRerolls)
    if (!hasRerollsremaining(activePlayer) && !hasRerollsremaining(supportPlayer)){
        console.log("Move to attack phase initiated.")
        return new Alert("You have run out of rerolls! Time to move to attack phase.")
    } else {
        console.log("There are rerolls remaining.")
        return true
    }
}



//--------------------//
//End Rolling Phase Functions
//--------------------//

//--------------------//
//Attack Phase Functions
//--------------------//

//Attack function

    //Clones the dice objects and generated the attack pool
    function createAttackHand() {
        let counter = 0
        for (let i = 0; i < board.dicePool.active.length; i++){
            board.attackHand[counter] = new Die(Math.round(Date.now() * Math.random()))
            board.attackHand[counter].value = board.dicePool.active[i].value
            board.attackHand[counter].keep = true
            counter++
        }
        for (let i = 0; i < board.dicePool.support.length; i++){
            board.attackHand[counter] = new Die(Math.round(Date.now() * Math.random()))
            board.attackHand[counter].value = board.dicePool.support[i].value
            board.attackHand[counter].keep = true
            counter++
        }
        board.attackHand.sort(function(a,b) {
            return a.value - b.value
        })
        console.log(board.attackHand)
        board.dicePool.active = []
        board.dicePool.support = []
    }

    //Generate an attack submisison
    function createAttackSubmission(hand){
        let submission = []
        for (let i = 0; i < hand.length; i++){
            console.log(hand[i])
            if (hand[i].submitted === true){
                console.log("Die Moved")
                submission.push(hand[i])
                hand.splice(i,1)
                i--
            }
        }
        console.log(submission)
        return submission
    }

    //Dmg calc for scenario
    function applyDMGtoScenario(player, dmg, level) {
        let calcDmg = dmg,
            inv = player.inventory.filter(item => item.timing === "attack")
        //Search inventory for any damage buff items or ability tokens
        console.log(inv)
        //If any buffs are found, for each buff invoke their ability to modify dmg
        if (inv.length > 0){
            for(let i = 0; i < inv.length; i++){
                console.log("Starting: ", calcDmg)
                calcDmg = inv[i].ability(calcDmg)
                console.log("New dmg: ", calcDmg)
            }
        }
        
        //Apply new damage amount to scenario
        board.scenarios[level].dmgCounter+= calcDmg
        console.log(calcDmg, " has been applied to the scenario")
    }

//Find and initiate player ability based on client info
exports.useAbility = function useAbility(abilityObject){
    let player = board.players.find(player => player.username === abilityObject.username),
        targetArray = []

    if (player.abilityCounter = 0){
        return new Alert("You don't have any ability uses left!")
    } else {
        abilityObject.target.forEach(dieID => {
            targetArray.push(findDie(dieID).die)
        })    
        //Each ability returns either a "diceChange" object or an "alert" object
        return player.playstyle.ability(targetArray)
    }

}

//If the # of dice is met, and the attack fits the style, dmg is issued
exports.attack = function attack(attackObjFromServer) {
    let player = board.players.find(player => player.status === "active"),
        attackSubmission = createAttackSubmission(board.attackHand),
        chosenAttack = player.playstyle.attack.find(attack => attack.name.split(" ").join("").toLowerCase() === attackObjFromServer.attackName.toLowerCase()),
        diceReq = chosenAttack.diceReq,
        dmg = chosenAttack.dmg,
        style = player.playstyle.mechanic
    //Checking for basic attack submission - because they have their own special rules for each character
    if (player.playstyle.attack.findIndex(attack => attack.name.split(" ").join("").toLowerCase() === attackObjFromServer.attackName.toLowerCase()) === 0){
        console.log("Basic attack detected")
        if (player.playstyle.basicAttack(attackSubmission, chosenAttack)){
            applyDMGtoScenario(player, dmg, board.level)
            return new Refresh("dmgIssued", exportGamestate())
        } else {
            return returnDiceToAttackHand(attackSubmission)
        }
        //If the number of dice required is met AND the character mechanic is met, assign dmg
    } else if (diceReq > 1 && numDiceCheck(diceReq, attackSubmission) && style(attackSubmission, chosenAttack)){
        console.log("Attack succeeds. " + dmg + " damage has been submitted")
        applyDMGtoScenario(player, dmg, board.level)
        //The used dice should automatically be deleted/discarded one the function ends
        console.log(board.attackHand)
        return new Refresh("dmgIssued", exportGamestate())
    } else {
        return returnDiceToAttackHand(attackSubmission)
    }

}

function returnDiceToAttackHand(dice){
    console.log("The attack did not succeed, returning dice to attack pool.")
    //returns the attack submission to the pool
    for (let i = 0; i < dice.length; i++){
        dice[i].submitted = false
        board.attackHand.push(dice[i])
    }
    board.attackHand.sort(function(a,b) {
        return a.value - b.value
    })
    console.log(board.attackHand)
    return new Alert("The attack did not succeed. Returning dice to attack pool.")

}

//Check for required number of dice
function numDiceCheck(diceReq, attackSubmission){

    console.log(diceReq, "=", attackSubmission.length, "?")
    return diceReq === attackSubmission.length
}


exports.endAttackPhase = function endAttackPhase() {
    if (board.attackHand.length > 0){
        clearAttackHand()
        return CounterAttackPhase()
    } else {
        console.log("Switch triggered!")
        gameState.switchCounter += 1
        clearAttackHand()
        let output = EndPhase()
        output.switchTriggered = true
        return output
    }
}

function clearAttackHand(){
    board.attackHand = []
}

//--------------------//
//End Attack Phase Functions
//--------------------//

//--------------------//
//CounterAttack Phase Functions
//--------------------//

//Applies dmg to all players, used for AOE Attacks
//I didn't specifically hard code board.players to allow for future expansion
function applyDMGAOE(players, dmg){
    let calcDmg = dmg
    //For each player loop
    for (let p = 0; p < players.length; p++){
        //Look for any defense items
        console.log("Player damage is now: ",players[p].dmgCounter)
        let inv = players[p].inventory.filter(item => item.timing === "counterAttack")
        console.log("Defense items found: ", inv)
        //For each item in their inventory, run dmg calculations
        if (inv.length > 0) {
            for(let i = 0; i < inv.length; i++){
                calcDmg = inv[i].ability(calcDmg)
            }
        }
        //Apply dmg after calcs
        players[p].dmgCounter+= calcDmg
        console.log("Player damage is now: ",players[p].dmgCounter)

    }
}


//Primary event counterattack.
//I left player open in case varations for the game are designed
    //If a dungeon is designed where the party gets split, and AOE is thus split, this will require reworking.
function eventCounterAttack(currentScenario, player){
    console.log("Player damage is now: ",player.dmgCounter)
    let currentStage = currentScenario.card.stage[currentScenario.stageCounter]
    if (currentStage.aoe === true){
        applyDMGAOE(board.players, currentStage.dmg)
    } else {
        let inv = player.inventory.filter(item => item.timing === "counterAttack"),
            calcDmg = currentStage.dmg
        if (inv.length > 0) {
            for(let i = 0; i < inv.length; i++){
                calcDmg = inv[i].ability(calcDmg)
            }
        }
        player.dmgCounter+= calcDmg
        console.log("Player damage is now: ",player.dmgCounter)
    }
}




//--------------------//
//End CounterAttack Phase Functions
//--------------------//

//--------------------//
//Start of Turn End Phase Functions
//--------------------//

//Checks the current stage's dmg counter against it's max HP
function stageHPchecker(){
    console.log("Stage checker starting!")
    let currentScenario = board.scenarios[board.level],
        currentStage = board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter]
    if (currentScenario.dmgCounter >= currentStage.hp){
        currentScenario.stageCounter++
        currentScenario.dmgCounter = 0
        gameState.noAbilities = false
        gameState.noConsumables = false
        if (currentScenario.stageCounter > (currentScenario.card.stage.length - 1)){
            console.log("achieved switch rate of: ", ((gameState.switchCounter / gameState.turnCounter) * 100),"%")
            gameState.turnCounter = 0
            gameState.switchCounter = 0
            return ScenarioCleared()
        } else {
            console.log("New Stage being setup!")
            return NewStageSetup()

        }
    } else {
        console.log("New player turn being setup!")
        return NewPlayerTurnSetup()
    }

}

function doesGameContinue(){
    let deadPlayers = whoIsDead(),
        savingItems = preventDeathItemCheck()

    //If this is false game continues
    if (deadPlayers.length > 0){
        //If there are no items, game is over.
        if (savingItems.length > 0){
            lifeSavingItemUse(deadPlayers, savingItems)
            return new Refresh("itemUsed", exportGamestate())
        } else {
            return false
        }
    } else {
        //Game continues
        return true
    }
}

//Searches for dead players
function whoIsDead(){
    let deadPlayers = []

    board.players.forEach(player => {
        if (player.dmgCounter >= player.playstyle.hpMax[board.level]){
            deadPlayers.push(player)
        }
    })
    return deadPlayers
}

function preventDeathItemCheck(){
    let savingItems = []
    //Searching the inventories for any items to save the day
    board.players.forEach(player => {
        player.inventory.forEach(item => {
            if (player.inventory.find(item => item.timing === "playerDeath" && item.consumed === false)){
                savingItems.push(item)
            }
        })
    })
    return savingItems
}

function lifeSavingItemUse(players, items){
    if(items.length > players.length){
        items[0].ability(players[0])
        return {
            player: player[0],
            item: item[0],
        }
    }
}


//--------------------//
//End of Turn End Phase Functions
//--------------------//

//--------------------//
//Scenario Cleared Phase Functions
//--------------------//


//This function
function LevelUp() {
        switch (board.level) {
            //First level up (to level 2)
            case 0:
                board.level++
                console.log("board is now level: ", board.level);
                //Unlock tier 2 attack for all players    
                break;

            case 1:
                board.level++
                console.log("board is now level: ", board.level);
                //Unlock tier 3 attack for all players
                //Grant a boon to the party
                boonDraw(board.boon.deck, Boons)
                console.log("Boon has been granted to the party: ", board.boon.drawn)    
                break;

            case 2:
                board.level++
                console.log("board is now level: ", board.level);
                break;

            default:
                break;
    }
}

//This function lets a player draw a card from a deck. Currently just used for the item deck
function draw(player, deck){
    console.log(deck, player);
    player.inventory.push(deck.shift())
}

//This function is used to "grant" (draw) a boon for the party.
function boonDraw(target, deck){
    console.log(deck, target);
    target.push(deck.shift())
}

//Healing

//This targets only one player, to allow it being reused for single healing
function removeDMGCountersOnePlayer(player, amt){
    if (amt === "full"){
        player.dmgCounter = 0
    } else {
        player.dmgCounter-= amt
    }
}

function HealAllPlayers(players){
    for (let i = 0; i < players.length; i++){
        removeDMGCountersOnePlayer(players[i], "full")
    }
}

function unexhaustAllPlayers(players){
    players.forEach(player => player.exhausted = "false")
}

function refreshAbilities(players) {
    players.forEach(player => {
        console.log("Refreshing abilities",player, player.abilityCounter, " => ", player.abilityScenarioMax)
        player.abilityCounter = player.abilityScenarioMax
        console.log("Ability Counter is now ", player.abilityCounter)
    })
}


//--------------------//
//End Scenario Cleared Phase Functions
//--------------------//



//--------------------//
//PsuedoCode Section
//--------------------//


//Pre-game Setup
    exports.NewGameSetup = function NewGameSetup(playersArrayFromServer) {
        resetBoard()
        resetGamestate()
        //Populate the players
        //populatePlayers(playersArrayFromServer)
        TESTFILLpopulatePlayers()
        //Initial Preparation of player abilities
        prepareAbilities(board.level, board.players)
        //Setup the item deck
        prepareItemDeck()
        //Setup the boon deck
        prepareBoonDeck()
        console.log("Start of game Setup function has finished")
        return NewScenarioSetup()
    }

// Turn system
    //Setup steps each turn before each roll
    function NewScenarioSetup() {
        isGameOver()
        //Prepare the Scenario for the level
        setupScenario(scenarios, board.level)
        if (board.level <= 1){
            console.log("Start of game ability refresh engaged!")
            refreshAbilities(board.players)
        }
        console.log("NewScenarioSetup has finished")
        return NewStageSetup()
    }
    //Setup for each new stage reveal (once per stage)
    function NewStageSetup() {
        currentStage = board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter]
        //Check for any Event Stage effects
        //Apply the Stage effect
        currentStage.effect(board.players)
        console.log("Stage affect has been applied")
        //console.log("Stage level item effects have been applied")
        console.log("NewStageSetup has finished")
        return NewPlayerTurnSetup()
    }
    //Setup for each Player's turn
    function NewPlayerTurnSetup() {
        isGameOver()
        gameState.turnCounter += 1
        console.log("It is now turn: ", gameState.turnCounter)
        //I moved DOT to here for a consistent trigger and to give players plenty of time to try to respond to it.
        damageOverTimeEffect()
        //Active Player is declared
        cyclePlayerStatus(board.players)
        //Check if all other players are exhausted
        allExhaustedRefresh(board.players)
        //If all others are exhausted, unexhaust all
        console.log("NewPlayerTurnSetup has completed.")
        if (doesGameContinue()){
            if (isAnyoneActive() === undefined){
                return requestPlayerStatusChoice("active")
            } else {
                return startOfTurnItemsPhase()
            }
        } else {
            return new Alert("Game over! :(")
        }
    }
    function startOfTurnItemsPhase(){
        gameState.itemPhase = true
        //Consumable Item phase
        //Check for any consumables
        let playersWithConsumables = checkConsumables(board.players)
        //Sends an alert that they can use items if they want.
        if(playersWithConsumables.length > 0){
            console.log(playersWithConsumables)
            return new ItemsNotice(playersWithConsumables)
        } else {
            return selectSupportPhase()
        }
    }

    function selectSupportPhase(){
        //Select a support
        //verify the support is not exhausted
        return requestPlayerStatusChoice("support")
    }



    //Rolling phase
    exports.RollingPhase = function RollingPhase(){
        gameState.itemPhase = false
        //Check for any reroll modifiers (event or items)
        //Apply any reroll modifiers to respective party
        setRerolls()
        //Create player "hands" based on the scenario's restrictions
        setHands(board.scenarios[board.level])
        //Initial Rolls for scenario
        console.log("Initial Rolls for the scenario")
        rollHand(board.dicePool.active)
        rollHand(board.dicePool.support)
        setDev()
        return new Refresh("diceChange", exportGamestate())
        //Declare any die rerolls (assign keep:true)
            //This will be done with client side code sending keep command back to server
        //Roll all dice where keep is false and reroll counter is greater than zero for respective player
        //This is built into the roll function
        //Rerolls
        //Check if player has rerolls (rerolls>0)
        //If counter = 0, set all player dice to keep:true
        //If both counters are 0, disable roll button
        //Roll any keep:false dice
        //Using abilities --> NEED TO DO
            //Only Active and Support player can use Abilities
            //Confirm player wants to engage ability
            //Choose and confirm target of ability
            //Execute ability change
        //Move to attack Phase
        //Confirm player wants to move to attack phase
    }
    //Attack phase
    exports.AttackPhase = function AttackPhase() {
        //Clone attack hand
        createAttackHand()
        return new Refresh("diceChange", exportGamestate())
        //Execute an attack, only the active player can submit attacks
            //Assign dice to attack(s)
            //check if assignment is valid
            //if they are, the used dice are discarded
            //if not return dice to pool
        //Submit attack(s)
        //Check for any Event defense augments --> need to do
        //Check for any Player attack augments --> need to do
        //Calculate DMG result
        //Modified DMG is submitted to Event stage counter
            //Count number of remaining dice
            //if greater than 0 await end turn confirmation
            //if zero, engage skip counter attack phase
        }
        //Counter Attack Phase
        function CounterAttackPhase() {
            console.log("Start of counterattack")
            let activePlayer = board.players.find(player => player.status === "active")
            console.log(activePlayer)
            //Event executes an attack
            console.log("The stage raw dmg value is: ", board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter].dmg)
            eventCounterAttack(board.scenarios[board.level], activePlayer)
                //Check for any attack modifiers
                //Assign DMG to target(s)
            console.log("Stage has counterattacked")
            if(doesGameContinue()) {
                console.log("Nobody seems to be dead. Continuing...");
                return EndPhase()
            } else {
                gameState.gameOver = true
                return new Alert("Game over!")
            }
        }
        //Turn End Phase
        function EndPhase(){
            console.log("Start of End phase")
        //Check if phase has more dmg than current HP
        //If so, clear DMG and move to next phase
        //If no next phase, scenario cleared
        //Check if any PLAYER has more dmg than their current HP max
        //if yes, game over
            return stageHPchecker()
        }
    
        //Scenarion Cleared
        function ScenarioCleared(){
            //Loot Phase -- active Player gets to loot as "last hit" bonus
            let activePlayer = board.players.find(player => player.status === "active")
                //draw item from deck
            draw(activePlayer, board.itemDeck)
                //add item to Player inventory ~ this seems to work
                refreshItems() //CHANGE TO SOCKET EMIT
                console.log("Item has been drawn and given to:", activePlayer)
                //Give item to new player if desired
            //Level Up
            //Level up function ~ works
            LevelUp()
            //First level up (to level 2)
                //Unlock tier 2 attack for all players
            //Second Level up (to level 3)
                //Unlock tier 3 attack for all players
                //Grant a boon to the party
            //Healing
            //DMG counters removed
            HealAllPlayers(board.players)
            //Characters cleared of exhausted status
            unexhaustAllPlayers(board.players)
            //Ability points refreshed to max
            refreshAbilities(board.players)
            //Any lingering augment effects are cleared
            cleansePoison(board.players)
            if (board.level < scenarios.length - 1){
                return new Alert("Scenario defeated!")
            } else {
                return new Alert("It seems you have won the game. Congratulations are in order.")
            }
        }

