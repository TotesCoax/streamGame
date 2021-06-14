//Grab the Active player hand
let dice = document.getElementsByClassName("die")
console.log(dice)

//Setting up the Roll Listeners
document.getElementById("rollButton").addEventListener("click", rollHand)

//Hand Roller
function rollHand() {
    for (let i = 0; i < dice.length; i++) {
        dice[i].innerText = dieRoll(6)
    }
    console.log(dice);
}

/*Dice Roller
function dieRoll(num) {
    return Math.floor(Math.random() * num) + 1
}*/

// Creating the classes 

// Die Object

class Die {
    constructor() {
        this.value = 0
        this.keep = false
        this.redeemed = false
    }

    rollDie()  {
        this.value = Math.floor(Math.random() * 6) + 1
    }

    markKeep() {
        this.keep = true
    }
}

// Item Object

class Item {
    constructor(name, type, abilityName, abilityText, abilityType, abilityValue) {
        this.name = name
        this.type = type
        this.abilityName = abilityName
        this.abilityText = abilityText
        this.abilityType = abilityType
        this.abilityValue = abilityValue
        this.holder = ""
        this.consumed = false
    }

    use() {
        this.consumed = true
    }
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
