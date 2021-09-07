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