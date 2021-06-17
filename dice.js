
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

