
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

    //Apply DMG to scenario function
    function applyDMGtoScenario(dmg, level) {
        board.scenarios[level].dmgCounter+= dmg
    }

//If the # of dice is met, and the attack fits the style, dmg is issued
function attack(player, attackNum, attackHand) {
    let attackSubmission = createAttackSubmission(attackHand),
        diceReq = player.playstyle.attack[attackNum].diceReq,
        dmg = player.playstyle.attack[attackNum].dmg,
        style = player.playstyle.mechanic
    //If the number of dice required is met AND the character mechanic is met, assign dmg
    if (numDiceCheck(diceReq, attackSubmission) && style(attackSubmission)){
        console.log("Attack succeeds. " + dmg + " damage has been issued")
        applyDMGtoScenario(dmg, board.level)
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

//Simple value checker for basic attacks
function checkValue(val, die){
    console.log(val + " = " + die.value + "?");
    return val === die.value
}

//Brash checks that all dice values are the same
// Moved to relevant character card object
// function brash(attackSubmission){
//     console.log(attackSubmission)
//     for (let i = 1; i < attackSubmission.length; i++){
//         console.log(attackSubmission[i-1].value, attackSubmission[i].value);
//         if (attackSubmission[i-1].value !== attackSubmission[i].value){
//             console.log("The attack is not brash")
//             return false
//         }
//     }
//     console.log("The attack is brash")
//     return true
// }
    //Just for testing
    function setBrash(hand) {
        x = Math.floor(Math.random() * 6) + 1;
        hand.forEach(die => {
            die.value = Number(x)
        })
        console.log("Brash has been set to: ", x)
    }


//Elegant checks that submitted dice are sequential
// // Moved to relevant character card object
// function elegant(attackSubmission){
//     console.log(attackSubmission)
//     attackSubmission.sort(function compareNumbers(a, b) {
//         return a - b;
//       })
//     for (let i = 1; i < attackSubmission.length; i++){
//         console.log(attackSubmission[i-1].value, attackSubmission[i].value);
//         if (attackSubmission[i].value !== attackSubmission[i-1].value + 1){
//             console.log("The attack is not elegant")
//             return false
//         }
//     }
//     console.log("The attack is elegant")
//     return true
// }
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
// Moved to relevant character card object
// function staunch(attackSubmission, threshold){
//     let sum = 0
//     for (let i = 0; i < attackSubmission.length; i++){
//         console.log(attackSubmission[i].value);
//         sum += attackSubmission[i].value
//         console.log("sum:" + sum)
//         }
//     console.log("Threshold:" + threshold)
//     if (sum >= threshold){
//         console.log("The attack is staunch")
//         return true
//     } else {
//         console.log("the attack is not staunch")
//         return false
//     }
// }

    //Just for testing
    function setStaunch(hand) {
        hand.forEach(die => {
            die.value = Number(6)
        })
        console.log("Staunch has been set.");
    }

//Sly checks that sum of submitted dice values are below a number
// Moved to relevant character card object
// function sly(attackSubmission, threshold){
//     console.log(attackSubmission, threshold);
//     let sum = 0
//     for (let i = 0; i < attackSubmission.length; i++){
//         console.log(attackSubmission[i].value);
//         sum += attackSubmission[i].value
//         console.log("Sum:" + sum)
//         }
//         console.log("Threshold:" + threshold)
//     if (sum <= threshold){
//         console.log("The attack is sly")
//         return true
//     } else {
//         console.log("The attack is not sly")
//         return false
//     }
// }

    //Just for testing
    function setSly(hand) {
        hand.forEach(die => {
            die.value = Number(1)
        })
        console.log("Sly has been set.");
    }
