//Object Factories

// Die Object

class Die {
    constructor(id) {
        this.id = id
        this.value = 0
        this.keep = false
        this.submitted = false
    }
//This function rolls values 1-6
    rollDie()  {
        if (this.keep === false){
            this.value = Math.floor(Math.random() * 6) + 1
        }
    }
//This is used in the rolling phase
    toggleKeep() {
        switch (this.keep) {
            case true:
                this.keep = false
                break;
            case false:
                this.keep = true
                break;
        }
    }
//This is used in the attack phase, attack function looks for submitted dice.
    toggleSubmit() {
        switch (this.submitted) {
            case true:
                this.submitted = false
                break;
        
            case false:
                this.submitted = true
                break;
        }
    }
//I don't think I need this anymore.
    reset() {
        this.keep = false
        this.redeemed = false
        this.submitted = false
    }
}



//Player object
class Player {
    constructor(username, playstyle) {
        this.username = username.toLowerCase()
        //this.profilePic = profilePic
        this.playstyle = Playstyle[playstyle.toLowerCase()]
        //Inventory is where loot items are held
        this.inventory = []
        //These are counters for each Scenario. Scen can modify them.
        this.currentRerollsMax = 2
        this.currentRerolls = 0
        this.abilityScenarioMax = 0
        this.abilityCounter = 0
        this.dmgCounter = 0
        //There can be three status: active, support, and inactive - this is for rolling and CSS positioning
        this.status = "inactive"
        //Exhausted is for selecting supports
        this.exhausted = false
        //Section for debuffs
        //A player is poisoned when this is >0, and takes poison damage each turn, is not mitigated by effects or items.
        this.poison = 0
    }
}

//Scenario object
class Scenario {
    constructor(scenarioCard) {
        //This is used to pull stats from the card file
        this.card = scenarioCard
        //This is used to track dmg between stages
        this.dmgCounter = 0
        //This can be used to generate CSS formatting
        this.defeated = false
        //This tracks which stage the players are on for each scenario.
        this.stageCounter = 0
    }
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

function resetHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        hand[i].reset()
    }
    console.log(hand)
}


//Gameboard object. To create some global variables
let board = {
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

//Game state object to help handle some stage effects and track some fun things.
let gameState = {
    turnCounter: 0,
    switchCounter: 0,
    noConsumables: false,
    noAbilities: false,
    itemPhase: false
}



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
function setPlayerStatus(choiceObject){
    let chosenPlayer = board.players.find(player =>
        player.username === choiceObject.username)
    chosenPlayer.status = choiceObject.status
    console.log(chosenPlayer)
    if (choiceObject.status === "active"){
        startOfTurnItemsPhase()
    } else {
        RollingPhase()
    }
}

function requestPlayerStatusChoice(status){
    console.log("Game is saying I need to know who is: ", status)
    let validChoices = []
    for (let i = 0; i < board.players.length; i++){
        console.log(board.players[i].username)
        if ((board.players[i].exhausted === false) && (board.players[i].status !== "active")){
            validChoices.push(board.players[i].username)
            console.log(validChoices)
        }
    }
    //This will become a socket emit.
    promptPlayerSelection(validChoices, status)
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
        alert("You can only use consumables at the start of the turn! ")
        console.log("not in phase");
        return
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
            alert("This item has already been used!")
            console.log("Item was previously consumed", item)
        }
    } else {
        alert("An effect is preventing you from using items!")
    }
}

function isAnyoneActive(){
    return board.players.find(player => {
        player.status === "active"
    })
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
    //Check to see if this kills anyone
    isAnyoneDead(board.players)
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

function rollBoth() {
    let active = board.players.find(player => player.status === "active"),
        support = board.players.find(player => player.status === "support")

    rollActive(active)
    rollSupport(support)
}

function rollActive(player) {
    if((player.status === "active") && hasRerollsremaining(player)){
        rollHand(board.dicePool.active)
        console.log("Active pool has been rerolled: ", board.dicePool.active)
        player.currentRerolls--
        console.log("Reroll deducted, now checking both rerolls:")
        moveToAttackPhaseCheck()
    } else {
        console.log(player.status, player.currentRerolls)
        alert("You cannot roll this hand.")
    }
}

function rollSupport(player){
    if((player.status === "support") && hasRerollsremaining(player)){
        rollHand(board.dicePool.support)
        console.log("Support pool has been rerolled: ", board.dicePool.support)
        player.currentRerolls--
        console.log("Reroll deducted, now checking both rerolls:")
        moveToAttackPhaseCheck()
    } else {
        console.log(player.status, player.currentRerolls)
        alert("You cannot roll this hand.")
    }
}

//Move to attack phase? function
function moveToAttackPhaseCheck(){
    let activePlayer = board.players.find(player => player.status === "active"),
        supportPlayer = board.players.find(player => player.status === "support")

    console.log("Checking rerolls", "Active:", activePlayer.currentRerolls, " Support:", supportPlayer.currentRerolls)
    if (!hasRerollsremaining(activePlayer) && !hasRerollsremaining(supportPlayer)){
        console.log("Move to attack phase initiated.")
        alert("No more rerolls remain. It is time to move to attack phase.")
        return true
    }
    console.log("There are rerolls remaining.")
    return false
}


//Move to attack phase
function moveToAttackPhase(){
    let choice = confirm("Are you ready to move to attack phase?")
    if (choice){
        AttackPhase()
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

//If the # of dice is met, and the attack fits the style, dmg is issued
function attack(attackNameNoSpaces) {
    let player = board.players.find(player => player.status === "active"),
        attackSubmission = createAttackSubmission(board.attackHand),
        chosenAttack = player.playstyle.attack.find(attack => attack.name.split(" ").join("").toLowerCase() === attackNameNoSpaces.toLowerCase()),
        diceReq = chosenAttack.diceReq,
        dmg = chosenAttack.dmg,
        style = player.playstyle.mechanic
    //Checking for basic attack submission - because they have their own special rules for each character
    if (player.playstyle.attack.findIndex(attack => attack.name.split(" ").join("").toLowerCase() === attackNameNoSpaces.toLowerCase()) === 0){
        console.log("Basic attack detected")
        if (player.playstyle.basicAttack(attackSubmission, chosenAttack)){
            applyDMGtoScenario(player, dmg, board.level)
        } else {
            returnDiceToAttackHand(attackSubmission)
        }
        //If the number of dice required is met AND the character mechanic is met, assign dmg
    } else if (diceReq > 1 && numDiceCheck(diceReq, attackSubmission) && style(attackSubmission, chosenAttack)){
        console.log("Attack succeeds. " + dmg + " damage has been submitted")
        applyDMGtoScenario(player, dmg, board.level)
        //The used dice should automatically be deleted/discarded one the function ends
        console.log(board.attackHand)
    } else {
        returnDiceToAttackHand(attackSubmission)
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
    return false

}

//Check for required number of dice
function numDiceCheck(diceReq, attackSubmission){

    console.log(diceReq, "=", attackSubmission.length, "?")
    return diceReq === attackSubmission.length
}


function endAttackPhase() {
    if (board.attackHand.length > 0){
        CounterAttackPhase()
    } else {
        console.log("Switch triggered!")
        alert("Switch triggered!!")
        gameState.switchCounter += 1
        EndPhase()
    }
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
function stageHPchecker(currentScenario){
    console.log("Stage checker starting!")
    let currentStage = currentScenario.card.stage[currentScenario.stageCounter]
    if (currentScenario.dmgCounter >= currentStage.hp){
        currentScenario.stageCounter++
        currentScenario.dmgCounter = 0
        alert("Stage defeated!")
        gameState.noAbilities = false
        gameState.noConsumables = false
        if (currentScenario.stageCounter > (currentScenario.card.stage.length - 1)){
            alert("Scenario Cleared!")
            console.log("achieved switch rate of: ", ((gameState.switchCounter / gameState.turnCounter) * 100),"%")
            gameState.turnCounter = 0
            gameState.switchCounter = 0
            ScenarioCleared()
        } else {
            console.log("New Stage being setup!")
            NewStageSetup()
        }
    } else {
        console.log("New player turn being setup!")
        NewPlayerTurnSetup()
    }

}

function scenarioAllStagesDefeated(currentScenario){

}

function isAnyoneDead(players){
    let inv = []
    //Searching the inventories for any items to save the day
    //Generating a sub-inventory of items we could use
    for (let p = 0; p < players.length; p++){
        if (players[p].inventory.find(item => item.timing === "playerDeath")){
            inv.push(players[p].inventory.find(item => item.timing === "playerDeath"))
        }
    }
    console.log(inv, inv.length)
    //Searching for any dead players loops
    for (let i = 0; i < players.length; i++){
        //If any player is found to be dead, check for any saving items
        if (players[i].dmgCounter >= players[i].playstyle.hpMax[board.level]){
            console.log(players[i].username, " was calculated to be dead, but there might be more.")
            //If those items are found, start using them!
            if (inv.length > 0) {
                let itemToUse = inv.find(item => item.consumed === false)
                if (itemToUse){
                    useConsumable(itemToUse, players[i])
                    console.log("DIVING INTERVENTION!")
                }
                continue
            } else {
                alert("GAME OVER")
                return true
            }
        }
    }
    return false
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
        player.abilityCounter = player.abilityScenarioMax
    })
}


//--------------------//
//End Scenario Cleared Phase Functions
//--------------------//



//--------------------//
//PsuedoCode Section
//--------------------//


//Pre-game Setup
    function NewGameSetup(playersArrayFromServer) {
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
        NewScenarioSetup()
    }

// Turn system
    //Setup steps each turn before each roll
    function NewScenarioSetup() {
        //Prepare the Scenario for the level
        setupScenario(scenarios, board.level)
        console.log("NewScenarioSetup has finished")
        NewStageSetup()
    }
    //Setup for each new stage reveal (once per stage)
    function NewStageSetup() {
        currentStage = board.scenarios[board.level].card.stage[board.scenarios[board.level].stageCounter]
        //Check for any Event Stage effects
        //Apply the Stage effect
        currentStage.effect(board.players)
        console.log("Stage affect has been applied")
        console.log("Stage level item effects have been applied")
        console.log("NewStageSetup has finished")
        NewPlayerTurnSetup()
    }
    //Setup for each Player's turn
    function NewPlayerTurnSetup() {
        gameState.turnCounter += 1
        console.log("It is now turn: ", gameState.turnCounter)
        //Active Player is declared
        cyclePlayerStatus(board.players)
        //Check if all other players are exhausted
        allExhaustedRefresh(board.players)
        //If all others are exhausted, unexhaust all
        console.log("NewPlayerTurnSetup has completed.")
        if (isAnyoneActive() === undefined){
            requestPlayerStatusChoice("active")
        } else {
            startOfTurnItemsPhase()
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
            transmitItemPhase(playersWithConsumables)
        } else {
            selectSupportPhase()
        }
    }

    function selectSupportPhase(){
        //Select a support
        //verify the support is not exhausted
        requestPlayerStatusChoice("support")
    }



    //Rolling phase
    function RollingPhase(){
        gameState.itemPhase = false
        //I moved DOT to here for a consistent trigger and to give players plenty of time to try to respond to it.
        damageOverTimeEffect()
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
        function AttackPhase() {
            //Clone attack hand
            createAttackHand()
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
            //endAttackPhase(board.attackHand) function
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
            if(!isAnyoneDead(board.players)) {
                console.log("Nobody seems to be dead. Continuing...");
                EndPhase()
            }
        }
        //Turn End Phase
            function EndPhase(){
                console.log("Start of End phase")
            //Check if phase has more dmg than current HP
            stageHPchecker(board.scenarios[board.level])
            board.attackHand = []
                //If so, clear DMG and move to next phase
                //If no next phase, scenario cleared
            //Check if any PLAYER has more dmg than their current HP max
                    //if yes, game over
                console.log("End phase has completed")

            }
    
        //Scenarion Cleared
            function ScenarioCleared(){
            //Loot Phase -- active Player gets to loot as "last hit" bonus
            let activePlayer = board.players.find(player => player.status === "active")
                //draw item from deck
                draw(activePlayer, board.itemDeck)
                  //add item to Player inventory ~ this seems to work
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
                    NewScenarioSetup()
                } else {
                    alert("It seems you have won the game. Congratulations are in order.")
                }
            }
