//Experimental Classes to work on optimization.

class DicePool {
    constructor(){
        this.pool = []
    }
    addDie(die){
        this.pool.push(die)
    }
    removeDie(diceArray) {
        let index = this.pool.findIndex(die => die.id === target.id)
        this.pool.splice(index, 1)
    }
    rollPool() {
        this.hand.forEach(die => die.rollDie())
    }
    sortPool() {
        this.hand.sort(function(a,b) {
            return a.value - b.value
        })
    }
    clearPool() {
        this.hand = []
    }
}

class AttackHand extends DicePool{
    constructor(activePool, suppPool){
        this.pool = activePool.concat(suppPool)
    }
    createAttackSubmission(){
        let submission = []
        for (let i = 0; i < this.pool.length; i++){
            //console.log(hand[i])
            if (hand[i].submitted === true){
                //console.log("Die Moved")
                submission.push(hand[i])
                this.pool.splice(i,1)
                i--
            }
        }
        //console.log(submission)
        return submission
    }
    allKeep() {
        this.pool.forEach(die => die.keep = true)
    }
}


class Player {
    constructor(username, playstyle) {
        this.username = username.toLowerCase()
        //this.profilePic = profilePic
        this.playstyle = Playstyle.find(style => style.title === playstyle.toLowerCase())
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
        //Section for Dice related stuff
            //wantsReroll is for the rolling function on the client
            this.wantsReroll = false
            this.hand = []
            this.attackHand = []
        //Exhausted is for selecting supports
        this.exhausted = false
        //Section for debuffs
            //A player is poisoned when this is >0, and takes poison damage each turn, is not mitigated by effects or items.
            this.poison = 0
    }
    rollHand(){
        this.hand.forEach(die => die.roll())
    }
    attack(chosenAttack){
        
    }
}
