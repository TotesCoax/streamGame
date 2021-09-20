//Class imports
const {Die, Player, Scenario, EngineOutput, Alert, Prompt, ItemsNotice, Refresh} = require("./classIndex")
const {DicePool, AttackHand, PlayerNew} = require("./newClasses")
//Card Data import
const {Boons} = require("./decks/boons")
const {Playstyle} = require("./decks/characters")
const {lootDeck} = require("./decks/items")
const {Adventure} = require("./decks/scenarioDecks")
const {makeid} = require("../utils")

//YOU SHOULD CONVERT PLAYSTYLE AND CARDS INTO CLASSES SOONtm

//This function is used to send the gamestate info to the front end on request.
exports.newGameState = function newExport(board) {
    return new Refresh('raw', exportGamestate(board))
}
//Global Object reservations

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
        },
        gameState: {
            turnCounter: 0,
            switchCounter: 0,
            noConsumables: false,
            noAbilities: false,
            itemPhase: false,
            gameOver:  false
        }
    }
    console.log("Board object reset")
    return board
}

function exportGamestate(board) {
    //Gameboard object to export - use this to hide game information from the front end
    try {
        let boardExport = {
            players: board.players,
            level: board.level,
            scenarios: board.scenarios,
            attackHand: board.attackHand,
            boon: board.boon.drawn,
            gameState: board.gameState
        }
        return boardExport
    } catch (error) {
        return new Alert('No board to export!')
    }
}

//Global functions

exports.serverGameState = function (){
    return resetBoard()
}

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
    // console.log(hand)
}

//Game over check
function isGameOver(board){
    if (board.gameState.gameOver){
        return new Alert("The game ended! You have to start a new game.")
    }
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
            board.players[i] = new PlayerNew(user, style)
            console.log(board.players[i].username, " has been added")
        }
        console.log("Player array has been populated")
        //console.log(board.players)
    }

    exports.characterSelection = function characterSelection(availibleCharacters){
        return new Prompt('character', "Please select your playstyle:", availibleCharacters)
    }

    exports.generateCharacterPool = function generateCharacterPool(){
        let choices = []
        Playstyle.forEach(playstyle =>{
            choices.push(playstyle.title)
        })
        return choices
    }

    exports.pickCharacter = function pickCharacter(board, selectionObject){
        let username = selectionObject.username,
            playstyle = selectionObject.playstyle.toLowerCase()
        if (board.players.length < 4){
            board.players.push(new PlayerNew(username, playstyle))
            return new Alert(`${username} has chosen ${playstyle}`)
        } else {
            return new Alert('This game is designed for a max of 4 players.')
        }
    }

    //This is just to speed up testing
    function TESTFILLpopulatePlayers(board){
        board.players.length = 4
        board.players[0] = new PlayerNew("me","brash")
        board.players[1] = new PlayerNew("you","elegant")
        board.players[2] = new PlayerNew("she","staunch")
        board.players[3] = new PlayerNew("them","sly")
        console.log("TEST Function run, Player array has been populated")
        //console.log(board.players)
    }

    //Prepare the item deck
    //This snags the item deck object and shuffles it around.
    //This shuffled in place so I do need to find a way to clone objects that also brings functions.
    function prepareItemDeck(board){
        console.log("Preparing the item deck")
        board.itemDeck = shuffle(lootDeck)
        console.log("Item deck has been shuffled")
        //console.log(board.itemDeck)
    }

    //Prepare the boon deck

    function prepareBoonDeck(board){
        console.log("Preparing the boon deck")
        //Cloning and shuffling the item deck, moving it
        board.boon.deck = shuffle(Boons)
        console.log("Boon deck has been shuffled")
        //console.log(board.boon.deck)
    }

    //Prepare all player abilities counter based on the number of players and their level, level is board.level in most cases.
    //This should be run before any scenario effects that might modify their ability usage
    //This runs once in preGame setup but then all other instances use refresh function in end phase section
    function prepareAbilities(board){
        let level = board.level,
            players = board.players
        console.log("Setting the abilty counts for the scenario")
        for (let i = 0; i < players.length; i++){
            let numberOfPlayers = players.length - 2 //There must always be two players, and this works with the abilityMax array to grant the right number
            //console.log("For player: " + players[i].username + " Ability max from card:" + players[i].playstyle.abilityMax[level][numberOfPlayers])
            players[i].abilityScenarioMax = players[i].playstyle.abilityMax[level][numberOfPlayers]
            //console.log("Default bility count set to:" + players[i].abilityScenarioMax)
        }
        console.log("The ability counter has been prepared")
    }




//--------------------//
//Scenario setup phase
//--------------------//

//Activate a scenario
//This clones and shuffles the deck and draws on scenario, then adds that scenario to global board object
function prepareScenario(board, deck){
    console.log("Pulling the scenario card");
    let clone = shuffle(deck[board.level])
    board.scenarios.push(new Scenario(clone[0]))
    console.log("The scenario card has been pulled: ", clone[0].name)
    console.log("The scenario for level " + (Number(board.level) + 1) + " has been prepared.")
    // console.log(board.scenarios)
}


//Populating the player hands based on drawn scenario
function setHands(board){
    let scenario = board.scenarios[board.level],
        activePlayer = board.players.find(player => player.status === "active"),
        supportPlayer = board.players.find(player => player.status === "support")
    console.log("Setting player hands for the scenario")
    //console.log(scenario.card.activeDice, scenario.card.suppDice)
    activePlayer.hand = new DicePool(createHand(scenario.card.activeDice))
    activePlayer.hand.sort()
    supportPlayer.hand = new DicePool(createHand(scenario.card.suppDice))
    supportPlayer.hand.sort()

    function createHand(num){
        let hand = []
        for (let i = 0; i < num; i++){
        hand[i] = new Die(makeid(6))
        }
        return hand
        // console.log(hand)
    }
    console.log("The hands have been populated")
}

//Currently this is a blanket reset without targetting any specific pool of players based on the max they are allowed by the stage.
//I am keeping it like this to allow some player swaps mid-turn if I want to implement that.
function setRerolls(board) {
    //Setting the rerolls for every player
    console.log("Setting the reroll counts for each player")
    for (let i = 0; i < board.players.length; i++){
        board.players[i].currentRerolls = board.players[i].currentRerollsMax
        //console.log(board.players[i].username, board.players[i].currentRerolls);
    }
    //Looking for items that boost rerolls
    board.players.forEach(player => {
        if (player.inventory.find(item => item.timing === "reroll")){
            //console.log("Reroll item found!")
            player.inventory.find(item => item.timing === "reroll").ability(player)
        }
    })
    console.log("Rerolls have been set")
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
exports.setPlayerStatus = function setPlayerStatus(board, choiceObject){
    let chosenPlayer = board.players.find(player =>
        player.username === choiceObject.choice)
    chosenPlayer.status = choiceObject.requestCode
    if (choiceObject.requestCode === "support"){
        chosenPlayer.exhausted = true
    }
    console.log(chosenPlayer.username)
    if (choiceObject.requestCode === "active"){
        return startOfTurnItemsPhase(board)
    } else {
        return new Refresh('startWait', exportGamestate(board))
    }
}

function requestPlayerStatusChoice(board, status){
    console.log("Game is saying I need to know who is: ", status)
    let validChoices = []
    for (let i = 0; i < board.players.length; i++){
        // console.log(board.players[i].username)
        if ((board.players[i].exhausted === false) && (board.players[i].status !== "active")){
            validChoices.push(board.players[i].username)
            //console.log(validChoices)
        }
    }
    //console.log(validChoices)
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
                //console.log(players[i].username, "exhausted: ", players[i].exhausted)
                if (players[i].exhausted === false){
                    return false
                }
            }
            return true
        }

//Check for consumable items
function checkConsumables(board){
    let playersWithItems = []
    //Check each player for an inventory
    for (let i = 0; i < board.players.length; i++){
        //if that player has an items in their inventory
        if (board.players[i].inventory.length > 0){
            //check each item in their inventory if they are a type:consumable
            for (let j = 0; j < board.players[i].inventory.length; j++){
                if (board.players[i].inventory[j].type === "consumable" && board.players[i].inventory[j].consumed === false && board.players[i].inventory[j].timing === "startTurn")
                //add the username and item name to a list to export
                playersWithItems.push({username: board.players[i].username, itemname: board.players[i].inventory[j].name, consumed: board.players[i].inventory[j].consumed})
            }
        }
    }
    //console.log("Players with consumables: ", playersWithItems)
    //export the list
    return playersWithItems
}

//Use consumable
exports.useConsumable = function useConsumable(board, itemChoiceObject){
    console.log(itemChoiceObject)
    if (board.gameState.itemPhase === false){
        console.log("not in phase")
        return new Alert("You can only use consumables at the start of the turn!")
    }
    let holder = board.players.find(player => player.username === itemChoiceObject.holder),
        item = holder.inventory.find(item => item.name.split(" ").join("").toLowerCase() === itemChoiceObject.item),
        target = board.players.find(player => player.username.split(" ").join("").toLowerCase() === itemChoiceObject.target.split(" ").join("").toLowerCase())
    //Checking to see if game state allows consumables
    if (board.gameState.noConsumables === false){
        //Checking if item is consumed
        if (!item.consumed){
            item.ability(target)
            item.consumed = true
            return new Refresh("itemUsed", exportGamestate(board))
        } else {
            console.log("Item was previously consumed", item)
            return new Alert("This item has already been used!")
        }
    } else {
        return new Alert("An effect is preventing you from using items!")

    }
}

function isAnyoneActive(board){
    let foundPlayer = board.players.find(player => player.status === "active")
    return foundPlayer
}

//This function will search and apply any damage over time effects
function damageOverTimeEffect(board){

    //Checking for poison status on players
    board.players.forEach(player => {
        if (player.poison > 0){
            console.log(player.username, " is poisoned and will take: ", player.poison, "damage")
            //console.log(player.dmgCounter, " -> ", player.dmgCounter += player.poison)
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

function cleanseRerollPenalty(players){
    players.forEach(player => player.currentRerollsMax = 2)
}

function clearOldStageEffects(board){
    cleansePoison(board.players)
    cleanseRerollPenalty(board.players)
}

//--------------------//
//End of Player Turn Setup Functions
//--------------------//

//--------------------//
//Rolling Phase Functions
//--------------------//

//This function will look for a die ID in all the pools in the game and return it's location and die object in a response object.
function findDie(board, dieID){
    let activePlayer = board.players.find(player => player.status === "active"),
        supportPlayer = board.players.find(player => player.status === "support")

    if (activePlayer.hand.find(die => die.id === dieID)) {
        //console.log("Found in active pool!")
        return {
            loc: "active",
            die: activePlayer.hand.find(die => die.id === dieID)
        }
    } else if (supportPlayer.hand.find(die => die.id === dieID)){
        //console.log("Found in support pool!")
        return {
            loc: "supp",
            die: supportPlayer.hand.find(die => die.id === dieID)
        }
    } else if (activePlayer.attackHand.find(die => die.id === dieID)){
        //console.log("Found in attack pool!")
        return {
            loc: "attack",
            die: activePlayer.attackHand.find(die => die.id === dieID)
        }
    } else {
        return new Alert("That die was not found. We're gonna try a gamestate refresh to get your client up to date!")
    }

}

exports.keepDie = function keepDie(board, dieID){
    let foundDie = findDie(board, dieID)
    if (foundDie.type === "alert"){
        return foundDie
    } else if (foundDie.loc !== "attack") {
        foundDie.die.toggleKeep()
        return new Refresh("rollPhase", exportGamestate(board))
    }
}

exports.submitDie = function submitDie(board, dieID) {
    let foundDie = findDie(board, dieID)
    if (foundDie.type === "alert"){
        return foundDie
    } else if (foundDie.loc === "attack") {
        foundDie.die.toggleSubmit()
        return new Refresh("attackPhase", exportGamestate(board))
    }

}

exports.wantsReroll = function wantsReroll(board, status){
    let requester = board.players.find(player => player.status === status)

    toggleWantsReroll(requester)

    let active = board.players.find(player => player.status === "active"),
        support = board.players.find(player => player.status === "support")

    if (rollCheck(active, support)){
        return rollBoth(active, support)
    } else {
        return new Refresh('rollPhase', exportGamestate(board))
    }
}

function toggleWantsReroll(player){
    console.log("Toggling wants reroll for: ", player.username)
    switch (player.wantsReroll) {
        case false:
            player.wantsReroll = true
            break;
    
        default:
            player.wantsReroll = false
            break;
    }
}

function rollCheck(active, support){
    return active.wantsReroll && support.wantsReroll
}

//Checking for rerolls on players
function hasRerollsremaining(player){
    if (player.currentRerolls > 0){
        return true
    } else {
        return false
    }
}

function rollBoth(active, support) {
    if (hasRerollsremaining(active)){
        active.hand.roll()
    }
    if(hasRerollsremaining(support)){
        support.hand.roll()
    }
    active.wantsReroll = false
    support.wantsReroll = false
    return moveToAttackPhaseCheck(active, support)

}


//Move to attack phase? function
function moveToAttackPhaseCheck(active, support){
    console.log("Checking rerolls", "Active:", activePlayer.currentRerolls, " Support:", supportPlayer.currentRerolls)
    if (!hasRerollsremaining(active) && !hasRerollsremaining(support)){
        console.log("Move to attack phase initiated.")
        return new Alert("You have run out of rerolls! Time to move to attack phase.")
    } else {
        console.log("There are rerolls remaining.")
        return new Refresh("rollPhase", exportGamestate(board))
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
    function createAttackHand(board) {
        let active = board.players.find(player => player.status === "active"),
            support = board.players.find(player => player.status === "support")
        active.attackHand = new AttackHand(active.hand, support.hand)
        active.attackHand.allKeep()
        active.hand.clear()
        support.hand.clear()
    }

    //Generate an attack submisison
    function createAttackSubmission(hand){
        let submission = []
        for (let i = 0; i < hand.length; i++){
            //console.log(hand[i])
            if (hand[i].submitted === true){
                //console.log("Die Moved")
                submission.push(hand[i])
                hand.splice(i,1)
                i--
            }
        }
        //console.log(submission)
        return submission
    }

    //Dmg calc for scenario
    function applyDMGtoScenario(board, player, chosenAttack, dmg) {
        let calcDmg = dmg,
            inv = player.inventory.filter(item => item.timing === "attack"),
            currentStageDef = board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter].def,
            pierceValue = chosenAttack.pierce
        //Search inventory for any damage buff items or ability tokens
        //console.log(inv)
        //If any buffs are found, for each buff invoke their ability to modify dmg
        if (inv.length > 0){
            for(let i = 0; i < inv.length; i++){
                console.log("Starting damage: ", calcDmg)
                calcDmg = inv[i].ability(calcDmg)
                console.log("New dmg: ", calcDmg)
            }
        }
        let mitigation = currentStageDef - pierceValue
        if (mitigation < 0){
            mitigation = 0
        }
        if (calcDmg - mitigation > 0){
            //Apply new damage amount to scenario
            board.scenarios[board.level].dmgCounter+= (calcDmg - mitigation)
            console.log(calcDmg - mitigation, "dmg has been applied to the scenario")
        }
    }

//Find and initiate player ability based on client info
exports.useAbility = function useAbility(board, abilityObject){
    let player = board.players.find(player => player.username === abilityObject.username),
        diceArray = []
    console.log("Starting ability:", abilityObject, player)
    if (player.status === "inactive"){
        return new Alert("Abilities can only be used by the active player or their support.")
    }
    if (player.abilityCounter === 0){
        return new Alert("You don't have any ability uses left!")
    }
    if (board.gameState.noAbilities){
        return new Alert("Something is preventing you from using abilities!")
    }
    
    //console.log("Target array:", abilityObject.target)
    abilityObject.target.forEach(dieID =>{
        diceArray.push(findDie(board, dieID).die)
        console.log(diceArray)
    })
    //Each ability returns nothing, a string (for failure), or a prompt-style response object
    //console.log(typeof(player.playstyle.ability(diceArray)))
    switch (typeof(player.playstyle.ability(diceArray))) {
        case "string":
            return new Alert(player.playstyle.ability(diceArray))
        default:
            player.abilityCounter--
            return new Refresh("abilityUsed", exportGamestate(board))
        }
    }

//If the # of dice is met, and the attack fits the style, dmg is issued
exports.attack = function attack(board, attackObjFromServer) {
    let player = board.players.find(player => player.status === "active"),
        attackSubmission = player.attackHand.createAttackSubmission(),
        chosenAttack = player.playstyle.attack.find(attack => attack.name.split(" ").join("").toLowerCase() === attackObjFromServer.attackName.toLowerCase()),
        diceReq = chosenAttack.diceReq,
        dmg = chosenAttack.dmg,
        style = player.playstyle.mechanic
    //Checking for basic attack submission - because they have their own special rules for each character
    if (player.playstyle.attack.findIndex(attack => attack.name.split(" ").join("").toLowerCase() === attackObjFromServer.attackName.toLowerCase()) === 0){
        console.log("Basic attack detected")
        if (player.playstyle.basicAttack(attackSubmission, chosenAttack)){
            applyDMGtoScenario(board, player, chosenAttack, dmg)
            return new Refresh("attackPhase", exportGamestate(board))
        } else {
            return returnDiceToAttackHand(board, attackSubmission)
        }
        //If the number of dice required is met AND the character mechanic is met, assign dmg
    } else if (diceReq > 1 && numDiceCheck(diceReq, attackSubmission) && style(attackSubmission, chosenAttack)){
        console.log("Attack succeeds. " + dmg + " damage has been submitted")
        applyDMGtoScenario(board, player, chosenAttack, dmg)
        //The used dice should automatically be deleted/discarded one the function ends
        //console.log(board.attackHand)
        return new Refresh("attackPhase", exportGamestate(board))
    } else {
        return returnDiceToAttackHand(board, attackSubmission)
    }

}

function returnDiceToAttackHand(board, dice){
    console.log("The attack did not succeed, returning dice to attack pool.")
    //returns the attack submission to the pool
    for (let i = 0; i < dice.length; i++){
        dice[i].submitted = false
        board.attackHand.push(dice[i])
    }
    board.attackHand.sort(function(a,b) {
        return a.value - b.value
    })
    //console.log(board.attackHand)
    return new Alert("The attack did not succeed. Returning dice to attack pool.")

}

//Check for required number of dice
function numDiceCheck(diceReq, attackSubmission){

    console.log(diceReq, "=", attackSubmission.length, "?")
    return diceReq === attackSubmission.length
}


exports.endAttackPhase = function endAttackPhase(board) {
    if (board.attackHand.length > 0){
        clearAttackHand(board)
        return CounterAttackPhase(board)
    } else {
        console.log("Switch triggered!")
        board.gameState.switchCounter += 1
        clearAttackHand(board)
        let output = EndPhase(board)
        output.switchTriggered = true
        return output
    }
}

function clearAttackHand(board){
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
        console.log("Player damage is currently: ", players[p].dmgCounter)
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
function eventCounterAttack(board, currentScenario, player){
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
function stageHPchecker(board){
    console.log("Stage checker starting!")
    let currentScenario = board.scenarios[board.level],
        currentStage = board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter]
    if (currentScenario.dmgCounter >= currentStage.hp){
        currentScenario.stageCounter++
        currentScenario.dmgCounter = 0
        board.gameState.noAbilities = false
        board.gameState.noConsumables = false
        if (currentScenario.stageCounter > (currentScenario.card.stage.length - 1)){
            console.log("achieved switch rate of: ", ((board.gameState.switchCounter / board.gameState.turnCounter) * 100),"%")
            board.gameState.turnCounter = 0
            board.gameState.switchCounter = 0
            currentScenario.defeated === true
            return ScenarioCleared(board)
        } else {
            console.log("New Stage being setup!")
            let stageWin = NewStageSetup(board)
            stageWin.stageDefeated = true
            return stageWin

        }
    } else {
        console.log("New player turn being setup!")
        return NewPlayerTurnSetup(board)
    }

}

function doesGameContinue(board){
    let deadPlayers = whoIsDead(board),
        savingItems = preventDeathItemCheck(board)

    //If this is false game continues
    if (deadPlayers.length > 0){
        console.log("Dead players:", deadPlayers)
        //If there are no items, game is over.
        if (savingItems.length > 0){
            return lifeSavingItemUse(deadPlayers, savingItems)
        } else {
            //Game Over
            board.gameState.gameOver = true
            return false
        }
    } else {
        //Game continues
        return true
    }
}

//Searches for dead players
function whoIsDead(board){
    let deadPlayers = []

    board.players.forEach(player => {
        if (player.dmgCounter >= player.playstyle.hpMax[board.level]){
            deadPlayers.push(player)
        }
    })
    return deadPlayers
}

function preventDeathItemCheck(board){
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
        players.forEach(player => {
            if (items.length > 0){
                items[0].ability(player)
                items.splice(0,1)
                console.log(`${player.username} was saved by an item`);
            } else {
                return false
            }
        })
        return true
    } 
}


//--------------------//
//End of Turn End Phase Functions
//--------------------//

//--------------------//
//Scenario Cleared Phase Functions
//--------------------//


//This function
function LevelUp(board) {
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
                boonDraw(board)
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
    // console.log(deck, player);
    player.inventory.push(deck.shift())
}

//This function is used to "grant" (draw) a boon for the party.
function boonDraw(board){
    board.boon.drawn.push(board.boon.deck.shift())
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
        //console.log("Refreshing abilities",player, player.abilityCounter, " => ", player.abilityScenarioMax)
        player.abilityCounter = player.abilityScenarioMax
        //console.log("Ability Counter is now ", player.abilityCounter)
    })
}


//--------------------//
//End Scenario Cleared Phase Functions
//--------------------//



//--------------------//
//PsuedoCode Section
//--------------------//


//Pre-game Setup
    exports.NewGameSetup = function NewGameSetup(board, testFlag) {
        resetBoard(board)
        //Populate the players
        //populatePlayers(playersArrayFromServer)
        if (testFlag){
            TESTFILLpopulatePlayers(board)
        }
        if (board.players.length < 2){
            return new Alert("This game cannot be played with less than two players. For a game with test data run startNewTestGame() in the browser console.")
        }
        //Initial Preparation of player abilities
        prepareAbilities(board)
        //Setup the item deck
        prepareItemDeck(board)
        //Setup the boon deck
        prepareBoonDeck(board)
        console.log("Start of game Setup function has finished")
        return NewScenarioSetup(board)
    }

exports.startNewScenario = function (board){
    return NewScenarioSetup(board)
}

// Turn system
    //Setup steps each turn before each roll
    function NewScenarioSetup(board) {
        isGameOver(board)
        //Prepare the Scenario for the level
        prepareScenario(board, Adventure)
        if (board.level === 0){
            console.log("Start of game ability refresh engaged!")
            refreshAbilities(board.players)
        }
        console.log("NewScenarioSetup has finished")
        return NewStageSetup(board)
    }
    //Setup for each new stage reveal (once per stage)
    function NewStageSetup(board) {
        clearOldStageEffects(board)
        currentStage = board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter]
        console.log("Current stage: ", currentStage)
        //Check for any Event Stage effects
        //Apply the Stage effect
        currentStage.effect(board)
        console.log("Stage affect has been applied")
        //console.log("Stage level item effects have been applied")
        console.log("NewStageSetup has finished")
        return NewPlayerTurnSetup(board)
    }
    //Setup for each Player's turn
    function NewPlayerTurnSetup(board) {
        isGameOver(board)
        board.gameState.turnCounter += 1
        console.log("It is now turn: ", board.gameState.turnCounter)
        //I moved DOT to here for a consistent trigger and to give players plenty of time to try to respond to it.
        damageOverTimeEffect(board)
        //Active Player is declared
        cyclePlayerStatus(board.players)
        //Check if all other players are exhausted
        allExhaustedRefresh(board.players)
        //If all others are exhausted, unexhaust all
        console.log("NewPlayerTurnSetup has completed.")
        if (doesGameContinue(board)){
            if (isAnyoneActive(board) === undefined){
                return requestPlayerStatusChoice(board, "active")
            } else {
                return startOfTurnItemsPhase(board)
            }
        } else {
            return new Alert("Game over! :(")
        }
    }
    function startOfTurnItemsPhase(board){
        board.gameState.itemPhase = true
        //Consumable Item phase
        //Check for any consumables
        let playersWithConsumables = checkConsumables(board)
        //Sends an alert that they can use items if they want.
        if(playersWithConsumables.length > 0){
            //console.log(playersWithConsumables)
            return new ItemsNotice(playersWithConsumables, exportGamestate(board))
        } else {
            return selectSupportPhase(board)
        }
    }

    function selectSupportPhase(board){
        //Select a support
        //verify the support is not exhausted
        return requestPlayerStatusChoice(board, "support")
    }

    exports.ItemPhaseDone = function(board) {
        return requestPlayerStatusChoice(board, "support")
    }



    //Rolling phase
    exports.RollingPhase = function RollingPhase(board){
        board.gameState.itemPhase = false
        //Check for any reroll modifiers (event or items)
        //Apply any reroll modifiers to respective party
        setRerolls(board)
        //Create player "hands" based on the scenario's restrictions
        // console.log(board.scenarios)
        setHands(board)
        //Initial Rolls for scenario
        console.log("Initial Rolls for the scenario")
        rollHand(board.dicePool.active)
        rollHand(board.dicePool.support)
        return new Refresh("rollPhase", exportGamestate(board))
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
    exports.AttackPhase = function AttackPhase(board) {
        //Clone attack hand
        createAttackHand(board)
        return new Refresh("dmgIssued", exportGamestate(board))
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
        function CounterAttackPhase(board) {
            console.log("Start of counterattack")
            let activePlayer = board.players.find(player => player.status === "active")
            //console.log(activePlayer)
            //Event executes an attack
            console.log("The stage raw dmg value is: ", board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter].dmg)
            eventCounterAttack(board, board.scenarios[board.level], activePlayer)
                //Check for any attack modifiers
                //Assign DMG to target(s)
            console.log("Stage has counterattacked")
            if(doesGameContinue(board)) {
                console.log("Nobody seems to be dead. Continuing...");
                return EndPhase(board)
            } else {
                board.gameState.gameOver = true
                return new Alert("Game over!")
            }
        }
        //Turn End Phase
        function EndPhase(board){
            console.log("Start of End phase")
        //Check if phase has more dmg than current HP
        //If so, clear DMG and move to next phase
        //If no next phase, scenario cleared
        //Check if any PLAYER has more dmg than their current HP max
        //if yes, game over
            return stageHPchecker(board)
        }
    
        //Scenarion Cleared
        function ScenarioCleared(board){
            //Loot Phase -- active Player gets to loot as "last hit" bonus
            let activePlayer = board.players.find(player => player.status === "active")
                //draw item from deck
            draw(activePlayer, board.itemDeck)
                //add item to Player inventory ~ this seems to work
                console.log("Item has been drawn and given to:", activePlayer.username)
                //Give item to new player if desired
            //Level Up
            //Level up function ~ works
            LevelUp(board)
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
            if (board.level < Adventure.length){
                let output = new Refresh('scenarioDefeated', exportGamestate(board))
                output.scenarioDefeated = true
                return output
            } else {
                let victory = new Alert("It seems you have won the game. Congratulations are in order.")
                victory.gameOver = true
                return victory
            }
        }

