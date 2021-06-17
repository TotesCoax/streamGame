
//Object Factories
//Player object

class Player {
    constructor(username, playstyle) {
        this.username = username
        //this.profilePic = profilePic
        this.playstyle = Playstyle[playstyle.toLowerCase()]
        this.inventory = []
        this.currentRerolls = 0
        this.abilityScenarioMax = 0
        this.abilityCounter = 0
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

//Gameboard object. To create some global variables and also spots to fetch HTML data from
let board = {
    "players": [],
    "level": 0,
    "itemDeck": [],
    "scenario": [],
    "activePlayerDice": [],
    "suppPlayerDice": [],
    "attackHand": [],
    "rerolls": 0,
    "noAbilities": false
}

//Test Player generator
populatePlayers()
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

//Prepare the item deck
prepareItemDeck()
function prepareItemDeck(){
    console.log("Preparing the item deck")
    board.itemDeck = shuffle(lootDeck)
    console.log("Item deck has been shuffled")
    console.log(board.itemDeck)
}

//--------------------//
//Scenario setup phase
//--------------------//
function setupScenario(){
    prepareScenario(scenario1Deck)
    prepareAbilities(board.level, board.players)
    setRerolls(board.scenario[board.level])
    
}

//Activate a scenario
function prepareScenario(deck){
    console.log("Preparing the scenario");
    shuffle(deck)
    board.scenario.push(deck.shift())
    console.log("The scenario has bene prepared")
    console.log(board.scenario)
}

//Prepare/refresh all player abilities counter
function prepareAbilities(level, players){
    console.log("Setting the abilty counts for the scenario")
    for (let i = 0; i < players.length; i++){
        console.log("For player: " + players[i].username + " Ability max from card:" + players[i].playstyle.abilityMax[level][players.length - 2])
        players[i].abilityScenarioMax = players[i].playstyle.abilityMax[level][players.length - 2]
        console.log("Scenario ability count set to:" + players[i].abilityScenarioMax)
    }
    console.log("The ability counter has been prepared")
}


//Populating the player hands 
function setRerolls(scenario){
    console.log("Setting player hands for the scenario");
    let activeNum = scenario.activeDice,
        suppNum = scenario.suppDice
    
    console.log(activeNum, suppNum);

    function populateHand(hand, num){
        for (let i = 0; i < num; i++){
        hand[i] = new Die()
        }
        //console.log(hand)
    }
    populateHand(board.activePlayerDice, activeNum)
    populateHand(board.suppPlayerDice, suppNum)
    console.log("The hands have been populated")
    console.log(board.activePlayerDice)
    console.log(board.suppPlayerDice)
}

//--------------------//
//End of Scenario setup
//--------------------//

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




// Turn system

    //Check for any Event Stage effects
        //Apply the Stage effect
    //Active Player is declared
    //Check if all other players are exhausted
        //If all others are exhausted, unexhaust all
    //Consumable Item phase
        //Check for any consumables
        //Prompt if the holder would like to use item
    //Select a support
        //verify the support is not exhausted
    //Check for any item (equipment) modifiers
        //Apply any modifiers 
    //Check the event rolls tally
        //Check for any reroll modifiers (event or items)
        //Apply any reroll modifiers to respective party
    //Rolling phase
        //Roll all dice where keep is false and reroll counter is greater than zero for respective player
        //Declare any die rerolls (assign keep:true)
        //Rerolls
            //Check if player dice pool has rerolls (rerolls>0)
                //If counter = 0, set all player dice to keep:true
                //If both counters are 0, disable roll button
            //Roll any keep:false dice
        //Using abilities
            //Only Active and Support player can use Abilities
            //Confirm player wants to engage ability
            //Choose and confirm target of ability
            //Execute ability change
        //Move to attack Phase
            //Confirm player wants to move to attack phase
        //Attack phase
            //Execute an attack
                //Assign dice to attack(s)
                    //check if assignment is valid
                    //if not return dice to pool
                //Submit attack(s)
                    //Assigned dice are marked as redeemed
                    //Check for any Event defense augments
                    //Check for any Player attack augments
                    //Calculate DMG result
                    //Modified DMG is submitted to Event stage counter
                //Count number of remaining dice
                    //if greater than 0 await end turn confirmation
                    //if zero, engage skip counter attack phase
        //Counter Attack Phase
            //Event executes an attack
                //Check for any attack modifiers
                //Assign DMG to target(s)
        //End Phase
            //Check if phase has more dmg than current HP
                //If so, clear DMG and move to next phase
                //If no next phase, scenario cleared
        
        //Scenarion Cleared
            //Loot Phase
                //draw item from deck
                  //add item to Player inventory ~ this seems to work
                    function draw(player, deck){
                        console.log(deck, player);
                        player.inventory.push(deck.shift())
                    }

                    //Give item to new player if desired
            //Level Up
            //Level up function ~ works
            function boardLevelUp() {
                board.level++
            }
                //First level up (to level 2)
                    //Unlock tier 2 attack for all players
                //Second Level up (to level 3)
                    //Unlock tier 3 attack for all players
                    //Grant a boon to the party
            //Healing
                //DMG counters removed
                //Characters cleared of exhausted status
                //Ability points refreshed to max
                //Any lingering augment effects are cleared

