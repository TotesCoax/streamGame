
//Object Factories

// Die Object

class Die {
    constructor(i) {
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
//This is used in the attack phase
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
        //A player is poisoned when this is >0, and takes poison damage each turn, is not affected by effects or items.
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
        //I don't think I need this...
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


//Gameboard object. To create some global variables and also spots to fetch HTML data from
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

//Game state object to help handle some stage effects
let gameState = {
    turnCounter: 0,
    switchCounter: 0,
    noConsumables: false,
    noAbilities: false
}

//Gameboard object to export - this hides deck information from the front end
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

//Dev Functions
function giveItem(player, itemName) {
    let itemObject = board.itemDeck.find(item => item.name === itemName),
        itemIndex = board.itemDeck.indexOf(itemObject)

    player.inventory.push(itemObject)
    board.itemDeck.splice(itemIndex,1)
    console.log(itemObject, " has been moved to ", player.username)
}

//--------------------//
//Pre-Game setup functions
//--------------------//

    //Test Player generator
    //Perhaps include a sort of ready check in the future before this function executes
    //This will later be filled with some fancy shit that lets twitch users log in and control
    function populatePlayers(){
            //Count the number of players
        let numPlayers = prompt("How many players?")
            //set the player array
        board.players.length = Number(numPlayers)
            //Populate the player array
        for (let i = 0; i < board.players.length; i++){
            //Create a Player object for each user logged in
            let user = prompt("Username?"),
                style = prompt("Style?")
            board.players[i] = new Player(user, style)
            //console.log(board.players[i]);
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

    function prepareItemDeck(){
        console.log("Preparing the item deck")
        //Cloning and shuffling the item deck, moving it
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

    //Prepare/refresh all player abilities counter based on the number of players and their level, level is board.level in most cases.
    //This should be run before any scenario effects that might modify their ability usage
    //This runs once in preGame setup but then all other instances are in the post-scenario healing phase.
    //I like this as a pre-game once and post-scen second, in case I introduce random events between scenarios they can have abilities ready to use (making them unavailible in the next scenario as a cost to pass the event)
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
        hand[i] = new Die()
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

//Select Active Player
function selectActivePlayer(players){
    let inactivePlayers = 0
    //Check previously duo players status and update them
    for (let i = 0; i < players.length; i++){
        console.log(players[i].username, players[i].status)
        switch (players[i].status) {
            case "active":
                players[i].status = "inactive"
                break;

            case "support":
                players[i].status = "active"
                break;
    
            default:
                inactivePlayers++
                console.log(players[i].username + ": no status update. ", inactivePlayers, players.length)
                break;
            }
        }
        console.log("Switch case completed. Checking for first turn", inactivePlayers,"=?", players.length)
        //This instance would take place only for the first time each scenario (all are inactive)
        if (inactivePlayers === players.length){
            console.log("First turn protocol engaged")
            let input = prompt("Who is the active player? (enter username for testing)").toLowerCase()
            console.log("input: ", input)
            let activeChoice = players.find(player => player.username === input)
            console.log(activeChoice)
            activeChoice.status = "active"
        }
    console.log("selectActivePlayer has completed")
    allExhaustedRefresh(players)
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
function checkConsumables(players){
    let playersWithItems = []
    //Check each player for an inventory
    for (let i = 0; i < players.length; i++){
        //if that player has an items in their inventory
        if (players[i].inventory.length > 0){
            //check each item in their inventory if they are a type:consumable
            for (let j = 0; j < players[i].inventory.length; j++){
                if (player[i].inventory[j].type === "consumable")
                //add the username and item name to a list to export
                playersWithItems.push(players[i].username, players[i].inventory[j].name)
            }
        }
    }
    console.log("Players with consumables: ", playersWithItems)
    //export the list
    return playersWithItems
}

//Use consumable
function useConsumable(item, target){
    //Checking to see if game state allows consumables
    if (gameState.noConsumables === false){
        //Checking if item is consumed
        if (!item.consumed){
            item.ability(target)
            item.consumed = true
        } else {
            alert("This item has already been used!")
        }
    } else {
        alert("Something is preventing you from using items!")
    }
}

//Select Support Player
function selectSupportPlayer(players){
    let validChoices = []
    for (let i = 0; i < players.length; i++){
        if ((players[i].exhausted === false) && (players[i].status !== "active")){
            validChoices.push(players[i].username)
        }
    }
    console.log("valid choices",validChoices)
    //This should search for a valid username when I remove the prompt and add in a select box.
    let input = prompt("Who do you choose as your support? (enter username for testing)").toLowerCase()
    console.log("input: ", input)
    let supportChoice = players.find(player => player.username === input)
    console.log("support choice: ",supportChoice)
    if (supportChoice.exhausted === true){
        alert("That player is exhausted")
        selectSupportPlayer(players)
    } else {
        supportChoice.exhausted = true
        supportChoice.status = "support"
        console.log("Support has been chosen:", supportChoice.username)
    }
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
            board.attackHand[counter] = new Die()
            board.attackHand[counter].value = board.dicePool.active[i].value
            board.attackHand[counter].keep = true
            counter++
        }
        for (let i = 0; i < board.dicePool.support.length; i++){
            board.attackHand[counter] = new Die()
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
function attack(player, attackNum, attackHand) {
    let attackSubmission = createAttackSubmission(attackHand),
    chosenAttack = player.playstyle.attack[attackNum],
    diceReq = chosenAttack.diceReq,
    dmg = chosenAttack.dmg,
    style = player.playstyle.mechanic
    //Checking for basic attack submission - because they have their own special rules for each character
    if (attackNum === 0){
        console.log("Basic attack detected")
        if (player.playstyle.basicAttack(attackSubmission, chosenAttack)){
            applyDMGtoScenario(player, dmg, board.level)
        }
    }
    //If the number of dice required is met AND the character mechanic is met, assign dmg
    if (numDiceCheck(diceReq, attackSubmission) && style(attackSubmission, chosenAttack)){
        console.log("Attack succeeds. " + dmg + " damage has been submitted")
        applyDMGtoScenario(player, dmg, board.level)
        //The used dice should automatically be deleted/discarded one the function ends
        console.log(board.attackHand)
    } else {
        console.log("The attack did not succeed")
        //returns the attack submission to the pool
        for (let i = 0; i < attackSubmission.length; i++){
            board.attackHand.push(attackSubmission[i])            
        }
        board.attackHand.sort(function(a,b) {
            return a.value - b.value
        })
        console.log(board.attackHand)
        return false
    }
}

//Check for required number of dice
function numDiceCheck(diceReq, attackSubmission){

    console.log(diceReq, "=", attackSubmission.length, "?")
    return diceReq === attackSubmission.length
}


function endAttackPhase(attackHand) {
    if (attackHand.length > 0){
        CounterAttackPhase()
    } else {
        console.log("Switch triggered!")
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
    for (let p = 0; p < players.length; i++){
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
    let currentStage = currentScenario.card.stage[currentScenario.stageCounter]
    if (currentScenario.dmgCounter >= currentStage.hp){
        currentScenario.stageCounter++
        currentScenario.dmgCounter = 0
        alert("Stage defeated!")
        gameState.noAbilities = false
        gameState.noConsumables = false
        scenarioAllStagesDefeated(currentScenario)
    } else {
        
    }

}

function scenarioAllStagesDefeated(currentScenario){
    if (currentScenario.stageCounter > (currentScenario.card.stage.length - 1)){
        alert("Scenario Cleared!")
        console.log("achieved switch rate of: ", ((gameState.switchCounter / gameState.turnCounter) * 100),"%")
        gameState.turnCounter = 0
        gameState.switchCounter = 0
        ScenarioCleared()
    }
}

function isAnyoneDead(players){
    let inv = []
    //Searching the inventories for any items to save the day
    //Generating a sub-inventory of items we could use
    for (let p = 0; p < players.length; p++){
        inv.push(players[p].inventory.find(item => item.timing === "playerDeath"))
    }
    //Searching for any dead players loops
    for (let i = 0; i < players.length; i++){
        //If any player is found to be dead, check for any saving items
        if (players[i].dmgCounter >= players[i].playstyle.hpMax[board.level]){
            console.log(players[i].username, " was calculated to be dead, but there might be more.")
            //If those items are found, start using them!
            if (inv.length > 0) {
                let itemToUse = inv.find(item => item.consumed === false)
                useConsumable(itemToUse, players[i])
                console.log("DIVING INTERVENTION!")
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
    function NewGameSetup() {
        //Populate the players
        //populatePlayers()
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
        console.log("It is now turn: ", gameState.turnCounter);
        //Active Player is declared
        selectActivePlayer(board.players)
        //Check if all other players are exhausted
        //If all others are exhausted, unexhaust all
        //Consumable Item phase
        //Check for any consumables
        //Prompt if the holder would like to use item
        //Select a support
        selectSupportPlayer(board.players)
        //verify the support is not exhausted
        console.log("NewPlayerTurnSetup has completed")
        RollingPhase()
        }



    //Rolling phase
    function RollingPhase(){
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
            isAnyoneDead(board.players)
            EndPhase()
        }
        //Turn End Phase
            function EndPhase(){
                console.log("Start of End phase")
            //Check if phase has more dmg than current HP
            stageHPchecker(board.scenarios[board.level])
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
            }
