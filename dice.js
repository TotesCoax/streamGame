
/*Dice Roller
function dieRoll(num) {
    return Math.floor(Math.random() * num) + 1
}*/


// Die Object

class Die {
    constructor(i) {
        this.value = 0
        this.keep = false
        this.redeemed = false
    }

    rollDie()  {
        if ((this.keep === false) && (this.redeemed === false)){
            this.value = Math.floor(Math.random() * 6) + 1
        }
    }

    markKeep() {
        this.keep = true
    }

    redeem() {
        this.redeemed = true
    }

    reset() {
        this.keep = false
        this.redeemed = false
    }
}

//Populating the player hands 

//These hard coded numbers will be swapped with event variables eventually
let activeNum = 4,
    activeHand = [],
    suppNum = 4,
    suppHand = []

function populateHand(hand, num){
    for (let i = 0; i < num; i++){
    hand[i] = new Die()
    }
    console.log(hand)
}

populateHand(activeHand, activeNum)
populateHand(suppHand, suppNum)

//Hand operations

function rollHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        hand[i].rollDie()
    }
}

function resetHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        hand[i].reset()
    }
}