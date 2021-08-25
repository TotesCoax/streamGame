const {Playstyle} = require("../gameEngineStuff/decks/characters")

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
            console.log(this.id, " was rolled!")
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

class EngineOutput {
    constructor(){
        this.switchTriggered = false
        this.stageDefeated = false
        this.scenarioDefeated = false
        this.gameOver = false
    }
}

class Alert extends EngineOutput{
    constructor(message){
        super()
        this.type = "alert"
        this.message = message
    }
}

class Prompt extends EngineOutput {
    constructor(request, message, choices){
        super()
        this.type = "prompt"
        this.request = request
        this.message = message
        this.choices = choices
    }
}

class ItemsNotice extends EngineOutput {
    constructor(players){
        super()
        this.type = "itemsNotice"
        this.playerWithConsumables = players
    }
}

class Refresh extends EngineOutput {
    constructor(code, gamestate){
        super()
        this.type = code
        this.boardExport = gamestate
    }
}


module.exports = {
    Die, Player, Scenario, EngineOutput, Alert, Prompt, ItemsNotice, Refresh
}