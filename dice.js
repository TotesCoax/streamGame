
/*Dice Roller
function dieRoll(num) {
    return Math.floor(Math.random() * num) + 1
}*/


// Die Object

class Die {
    constructor(i) {
        this.value = 0
        this.keep = false
        this.submitted = false
    }

    rollDie()  {
        if (this.keep === false){
            this.value = Math.floor(Math.random() * 6) + 1
        }
    }

    markKeep() {
        this.keep = true
    }

    submit() {
        this.submitted = true
    }

    reset() {
        this.keep = false
        this.redeemed = false
        this.submitted = false
    }
}

//Attack mechanics

//Attack function

    //Clones the dice objects and generated the attack pool
    function createAttackHand() {
        let counter = 0
        for (let i = 0; i < board.dicePool.active.length; i++){
            board.attackHand[counter] = JSON.parse(JSON.stringify(board.dicePool.active[i]))
            counter++
        }
        for (let i = 0; i < board.dicePool.support.length; i++){
            board.attackHand[counter] = JSON.parse(JSON.stringify(board.dicePool.support[i]))
            counter++
        }
        board.attackHand.sort(function(a,b) {
            return a.value - b.value
        })
        console.log(board.attackHand)
    }

    //Generate an attack submisison
    function createAttackSubmission(hand){
        for (let i = 0; i < hand.length; i++){
            if (hand[i].submitted = true){
                submission.push(hand[i])
                i--
            }
        }
    }

//If the # of dice is met, and the attack fits the style, dmg is issued
function attack(diceReq, attackSubmission, check, style, dmg) {
    let discard = []
    //If the number of dice required is met AND the character mechanic is met, assign dmg
    if (check(diceReq, attackSubmission) && style(attackSubmission)){
        console.log("Attack succeeds. " + dmg + " damage has been issued")
        //remove the dice from the attack pool
        discard.push(attackSubmission)
        console.log(board.attackHand)
        return dmg
    } else {
        console.log("The attack did not succeed")
        //returns the attack submission to the pool
        board.attackHand.push(attackSubmission)
        console.log(board.attackHand)
        return false
    }
}

//Check for required number of dice
function numDiceCheck(diceReq, attackSubmission){

    console.log(diceReq, "=", attackSubmission.length, "?")
    return diceReq === attackSubmission.length
}

//Simple value checker for basic attacks
function checkValue(val, die){
    console.log(val + " = " + die.value + "?");
    return val === die.value
}

//Brash checks that all dice values are the same
function brash(attackSubmission){
    console.log(attackSubmission)
    for (let i = 1; i < attackSubmission.length; i++){
        console.log(attackSubmission[i-1].value, attackSubmission[i].value);
        if (attackSubmission[i-1].value !== attackSubmission[i].value){
            console.log("The attack is not brash")
            return false
        }
    }
    console.log("The attack is brash")
    return true
}
    //Just for testing
    function setBrash(hand) {
        x = Math.floor(Math.random() * 6) + 1;
        hand.forEach(die => {
            die.value = Number(x)
        })
        console.log("Brash has been set to: ", x)
    }


//Elegant checks that submitted dice are sequential
function elegant(attackSubmission){
    console.log(attackSubmission)
    attackSubmission.sort(function compareNumbers(a, b) {
        return a - b;
      })
    for (let i = 1; i < attackSubmission.length; i++){
        console.log(attackSubmission[i-1].value, attackSubmission[i].value);
        if (attackSubmission[i].value !== attackSubmission[i-1].value + 1){
            console.log("The attack is not elegant")
            return false
        }
    }
    console.log("The attack is elegant")
    return true
}
    //Just for testing
    function setElegant(hand) {
        let x = 1
        hand.forEach(die => {
            die.value = Number(x)
            x++
        })
        console.log("Elegance has been achieved")
    }

//Staunch checks that sum of submitted dice values are above a number
function staunch(attackSubmission, threshold){
    let sum = 0
    for (let i = 0; i < attackSubmission.length; i++){
        console.log(attackSubmission[i].value);
        sum += attackSubmission[i].value
        console.log("sum:" + sum)
        }
    console.log("Threshold:" + threshold)
    if (sum >= threshold){
        console.log("The attack is staunch")
        return true
    } else {
        console.log("the attack is not staunch")
        return false
    }
}

    //Just for testing
    function setStaunch(hand) {
        hand.forEach(die => {
            die.value = Number(6)
        })
        console.log("Staunch has been set.");
    }

//Sly checks that sum of submitted dice values are below a number
function sly(attackSubmission, threshold){
    console.log(attackSubmission, threshold);
    let sum = 0
    for (let i = 0; i < attackSubmission.length; i++){
        console.log(attackSubmission[i].value);
        sum += attackSubmission[i].value
        console.log("Sum:" + sum)
        }
        console.log("Threshold:" + threshold)
    if (sum <= threshold){
        console.log("The attack is sly")
        return true
    } else {
        console.log("The attack is not sly")
        return false
    }
}

    //Just for testing
    function setSly(hand) {
        hand.forEach(die => {
            die.value = Number(1)
        })
        console.log("Sly has been set.");
    }
