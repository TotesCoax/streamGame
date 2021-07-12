//Playstyle object holds the mechanics for each character class the players will use. Each mechanic is it's own object as well.

//I still need to add in the more specific mechanics to each character attack but this will do for now just to get some core programming setup.

let Playstyle = {
    brash: {
        title: "the brash",
        hpMax:[10,15,20],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Change one dice value into a 1 or 6",
        attack:[
            {tier: 0, diceReq: 1, dmg:1},
            {tier: 0, diceReq: 2, dmg:4},
            {tier: 0, diceReq: 4, dmg:10},
            {tier: 1, diceReq: 6, dmg:16},
            {tier: 2, diceReq: 8, dmg:27}
        ],
        ability: function(target) {
            let newValue = prompt("What would you like to change it to? Must be 1 or 6")
            if (newValue === 1 || newValue === 6 ) {
            target.value = newValue
            } else {
                alert("Incorrect value was given")
            }
        },
        mechanicExplain: "A brash fighter requires all dice values for non-basic attacks to be identical.",
        mechanic: function brash(attackSubmission, chosenAttack){
            console.log("Checking attack: ", chosenAttack)
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
        },
        basicAttack: function(attackSubmission, chosenAttack){
            console.log(attackSubmission, chosenAttack)
            if (attackSubmission.length === 1 && attackSubmission[0].value === 6){
                applyDMGtoScenario(chosenAttack.dmg, board.level)
            }
        }
    },

    elegant: {
        title: "the elegant",
        hpMax:[8,12,16],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Flip up to two standard dice to their opposite sides.",
        attack:[
            {tier: 0, diceReq: 2, dmg:1},
            {tier: 0, diceReq: 3, dmg:3},
            {tier: 0, diceReq: 4, dmg:5},
            {tier: 0, diceReq: 5, dmg:8},
            {tier: 1, diceReq: 6, dmg:12},
            {tier: 2, diceReq: 8, dmg:24}
        ],
        ability: function(target) {
            switch (target.value) {
                case 1:2
                    target.value = 6
                    break;
                case 2:
                    target.value = 5
                    break;
                case 3:
                    target.value = 4
                    break;
                case 4:
                    target.value = 3
                    break;
                case 5:
                    target.value = 2
                    break;
                case 6:
                    target.value = 1
                    break;
                default:
                    alert("Improper value submitted")
                    break;
            }
        },
        mechanicExplain: "An elegant fighter requires dice values for non-basic attacks to be sequentially ascending.",
        mechanic: function elegant(attackSubmission, chosenAttack){
            console.log("Checking attack: ", chosenAttack)
            attackSubmission.sort(function(a,b) {
                return a.value - b.value
            })
            console.log(attackSubmission)
            for (let i = 1; i < attackSubmission.length; i++){
                console.log(attackSubmission[i-1].value, "->", attackSubmission[i].value);
                if (attackSubmission[i].value !== attackSubmission[i-1].value + 1){
                    console.log("The attack is not elegant")
                    return false
                }
            }
            console.log("The attack is elegant")
            return true
        },
        basicAttack: function(attackSubmission, chosenAttack){
            console.log(attackSubmission, chosenAttack)
            if (this.mechanic(attackSubmission, chosenAttack) && attackSubmission.length === 2){
                applyDMGtoScenario(chosenAttack.dmg, board.level)
            }
        }

    },

    staunch: {
        title: "the staunch",
        hpMax:[12,18,24],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Change up to two standard dice to a value of 5",
        attack:[
            {tier: 0, diceReq: 1, dmg:1, threshold:"x"},
            {tier: 0, diceReq: 2, dmg:3, threshold:10},
            {tier: 0, diceReq: 4, dmg:8, threshold:20},
            {tier: 1, diceReq: 6, dmg:15, threshold:32},
            {tier: 2, diceReq: 8, dmg:25, threshold:45}
        ],
        ability: function(targetArray) {
            if (targetArray.length > 2){
                alert("Too many dice submitted")
                return false;
            }
            for (let i = 0; i < targetArray.length; i++){
                targetArray[i].value = 5
            }
        },
        mechanicExplain: "A staunch fighter requires the sum of dice values for non-basic attacks to be OVER an amount specified for that attack.",
        mechanic: function staunch(attackSubmission, chosenAttack){
            console.log("Checking attack: ", chosenAttack)
            let sum = 0
            for (let i = 0; i < attackSubmission.length; i++){
                console.log(attackSubmission[i].value);
                sum += attackSubmission[i].value
                console.log("sum:" + sum)
                }
            console.log("Threshold:" + chosenAttack.threshold)
            if (sum >= chosenAttack.threshold){
                console.log("The attack is staunch")
                return true
            } else {
                console.log("the attack is not staunch")
                return false
            }
        },
        basicAttack: function(attackSubmission, chosenAttack){
            console.log(attackSubmission, chosenAttack)
            if (attackSubmission.length === 1 && attackSubmission[0].value === 1){
                applyDMGtoScenario(chosenAttack.dmg, board.level)
            }
        }

    },

    sly: {
        title:"the sly",
        hpMax:[10,15,20],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Change up to two standard dice to a value of 2",
        attack:[
            {tier: 0, diceReq: 1, dmg:1, threshold:"x"},
            {tier: 0, diceReq: 2, dmg:3, threshold:4},
            {tier: 0, diceReq: 4, dmg:6, threshold:8},
            {tier: 1, diceReq: 6, dmg:12, threshold:10},
            {tier: 2, diceReq: 8, dmg:20, threshold:12}
        ],
        ability: function(targetArray) {
            if (targetArray.length > 2){
                alert("Too many dice submitted")
                return false;
            }
            for (let i = 0; i < targetArray.length; i++){
                targetArray[i].value = 2
            }
        },
        mechanicExplain: "A sly fighter requires the sum of dice values for non-basic attacks to be UNDER an amount specified for that attack.",
        mechanic: function sly(attackSubmission, chosenAttack){
            console.log("Checking attack: ", chosenAttack)
            console.log(attackSubmission)
            let sum = 0
            for (let i = 0; i < attackSubmission.length; i++){
                console.log(attackSubmission[i].value);
                sum += attackSubmission[i].value
                console.log("Sum:" + sum)
                }
                console.log("Threshold:" + chosenAttack.threshold)
            if (sum <= chosenAttack.threshold){
                console.log("The attack is sly")
                return true
            } else {
                console.log("The attack is not sly")
                return false
            }
        },
        basicAttack: function(attackSubmission, chosenAttack){
            console.log(attackSubmission, chosenAttack)
            if (attackSubmission.length === 1 && ((attackSubmission[0].value === 6)||(attackSubmission[0].value === 5))){
                applyDMGtoScenario(chosenAttack.dmg, board.level)
            }
        }

    },

    /*
    Mechanics for this style has not been implemented yet
    eccentric: {
        title:"the eccentric",
        hpMax:[8,12,16],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Pick a value among all dice. Increase or decrease all the value of all dice with that value by 1. Min value of 1 and max value of 6.",
        attack:[
            {tier: 0, diceReq: 1, dmg:1},
            {tier: 0, diceReq: 3, dmg:3},
            {tier: 0, diceReq: 3, dmg:4},
            {tier: 0, diceReq: 3, dmg:5},
            {tier: 1, diceReq: 6, dmg:12},
            {tier: 2, diceReq: 8, dmg:12}
        ],
        ability: function(targetValue, targetArray, direction) {
            //I'll do this later.
        }
    },
    */

    /*
    Mechanic for this style has not been implemented yet
    serene: {
        title:"the serene",
        hpMax:[8,12,16],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Pick a player. That player restores 1 use of their ability (up to their max).",
        attack:[
            {tier: 0, diceReq: 1, dmg:1},
            {tier: 0, diceReq: 3, dmg:6},
            {tier: 0, diceReq: 3, dmg:3},
            {tier: 0, diceReq: 3, dmg:3},
            {tier: 1, diceReq: 6, dmg:12},
            {tier: 2, diceReq: 8, dmg:20}
        ],
        ability: function(targetPlayer) {
            if ((targetPlayer.abilityUse + 1) < targetPlayer.abilityMax) {
                targetPlayer.abilityUse++
            } else {
                alert("NOPERS")
            }
        }
        mechanic: function name(attackSubmission, chosenAttack){
            console.log("The attack fits the mechanic")
        }
        basicAttack: function(targetPlayer) {
            console.log("Basic Attack has been performed")
        }
    }
    */
}

