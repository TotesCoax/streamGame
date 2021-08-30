
//Playstyle object holds the mechanics for each character class the players will use. Each mechanic is it's own object as well.

//I still need to add in the more specific mechanics to each character attack but this will do for now just to get some core programming setup.

let Playstyle = [
    {
        title: "brash",
        hpMax:[10,15,20],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Change one dice value into a 6"/*Supposed to be 1 or 6*/,
        attack:[
            {tier: 0, diceReq: 1, dmg:1, threshold: 6, name: "Basic Attack", desc: "Give the enemy a bonk"},
            {tier: 0, diceReq: 2, dmg:4, threshold: false, name: "Punch", desc: "A simple punch"},
            {tier: 0, diceReq: 4, dmg:10, threshold: false, name: "Kick", desc: "A simple kick"},
            {tier: 1, diceReq: 6, dmg:16, threshold: false, name: "Combo", desc: "You swing wildly and somehow connect on a few occasions"},
            {tier: 2, diceReq: 8, dmg:27, threshold: false, name: "Finisher", desc: "It's not pretty but it gets the job done"}
        ],
        ability: function(diceArray) {
            console.log(diceArray)
            if (diceArray.length > 1){
                return "Too many dice submitted!"
            }
            let newValue = 6
            if (newValue === 1 || newValue === 6 ) {
            diceArray[0].value = newValue
            return true
            } else {
                return "Incorrect value given"
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
            if (attackSubmission.length === 1 && attackSubmission[0].value === chosenAttack.threshold){
                console.log("The basic attack succeeds")
                return true
            } else {
                console.log("The basic attack fails")
                return false
            }
        }
    },

    {
        title: "elegant",
        hpMax:[8,12,16],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Flip up to two standard dice to their opposite sides.(Pairing 1:6 2:5 3:4)",
        attack:[
            //The default names are ballet terms.
            {tier: 0, diceReq: 2, dmg:1, threshold: false, name: "Demi", desc: "Basic? My attacks? Perish the thought."},
            {tier: 0, diceReq: 3, dmg:3, threshold: false, name: "Pique", desc: "A three step combo"},
            {tier: 0, diceReq: 4, dmg:5, threshold: false, name: "En Croix", desc: "A four step combo with a minor flourish"},
            {tier: 0, diceReq: 5, dmg:8, threshold: false, name: "Rond de jambe", desc: "A five step combo with a major flourish"},
            {tier: 1, diceReq: 6, dmg:12, threshold: false, name: "Port de bras", desc: "A six step combo with hits on the strike and return"},
            {tier: 2, diceReq: 8, dmg:24, threshold: "1,1,2,3,4,5,6,6", name: "Magnum Opus", desc: "Dear god, it's beautiful."}
        ],
        ability: function(diceArray) {
            if (diceArray.length <= 2){
                diceArray.forEach(die =>{
                    switch (die.value) {
                        case 1:
                            die.value = 6
                            return true
                        case 2:
                            die.value = 5
                            return true
                        case 3:
                            die.value = 4
                            return true
                        case 4:
                            die.value = 3
                            return true
                        case 5:
                            die.value = 2
                            return true
                        case 6:
                            die.value = 1
                            return true
                        default:
                            return "Something went wrong!"
                    }
                })
            } else {
                return "Too many dice submitted!"
            }
        },
        mechanicExplain: "An elegant fighter requires dice values for non-basic attacks to be sequentially ascending.",
        mechanic: function elegant(attackSubmission, chosenAttack){
            console.log("Checking attack: ", chosenAttack)
            attackSubmission.sort(function(a,b) {
                return a.value - b.value
            })
            console.log(attackSubmission)
            if (chosenAttack.diceReq === 8){
                console.log("They're trying the complicated thing")
                if (attackSubmission === [1,1,2,3,4,5,6,6,]){
                    console.log("MAGNUM!")
                    return true
                } else {
                    return false
                }
            }
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
                console.log("The basic attack succeeds")
                return true
            } else {
                console.log("The basic attack fails")
                return false
            }
        }

    },

    {
        title: "staunch",
        hpMax:[12,18,24],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Change up to two standard dice to a value of 5",
        attack:[
            //Attack names are boxing punch terms.
            {tier: 0, diceReq: 1, dmg:1, threshold: 1, name: "Basic Attack", desc: "Give the enemy a bonk"},
            {tier: 0, diceReq: 2, dmg:3, threshold:10, name: "Jab", desc: "An attack to keep the enemy at distance"},
            {tier: 0, diceReq: 4, dmg:8, threshold:20, name: "Cross", desc: "An attack to counter enemy aggression"},
            {tier: 1, diceReq: 6, dmg:15, threshold:32, name: "Hook", desc: "The enemy drops their guard and you take advantage"},
            {tier: 2, diceReq: 8, dmg:25, threshold:45, name: "Uppercut", desc: "An all-in attack on the enemy"}
        ],
        ability: function(targetArray) {
            if (targetArray.length > 2){
                return "Too many dice submitted!"
            } else {
                targetArray.forEach(die =>{
                    die.value = 5
                })
                return true
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
            if (attackSubmission.length === 1 && attackSubmission[0].value === chosenAttack.threshold){
                console.log("The basic attack succeeds")
                return true
            } else {
                console.log("The basic attack fails")
                return false
            }
        }

    },

    {
        title:"sly",
        hpMax:[10,15,20],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Change up to two standard dice to a value of 2",
        attack:[
            {tier: 0, diceReq: 1, dmg:1, threshold:6, name: "Basic Attack", desc: "Give the enemy a bonk"},//Original design calls for 5 or 6 to be valid
            {tier: 0, diceReq: 2, dmg:3, threshold:4, name: "Sleight of hand", desc: "Distract the enemy so you can strike with your off-hand"},
            {tier: 0, diceReq: 4, dmg:6, threshold:8, name: "Calculated strike", desc: "You find a weakness in their guard and exploit it"},
            {tier: 1, diceReq: 6, dmg:12, threshold:10, name: "Backstab", desc: "Dash to the enemy's flank and strike"},
            {tier: 2, diceReq: 8, dmg:20, threshold:12, name: "Pocket sand", desc: "GYAAAAHHH!!"}
        ],
        ability: function(targetArray) {
            if (targetArray.length > 2){
                return "Too many dice submitted!"
            }
            targetArray.forEach(die => {
                die.value = 2
            })
            return true
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
            if (attackSubmission.length === 1 && attackSubmission[0].value === chosenAttack.threshold){
                console.log("The basic attack succeeds")
                return true
            } else {
                console.log("The basic attack fails")
                return false
            }
        }

    }

    /*
    Mechanics for this style has not been implemented yet
    eccentric: {
        title:"the eccentric",
        hpMax:[8,12,16],
        abilityMax: [[1,1,1],[2,1,1],[3,2,1]],
        abilityText: "Pick a value among all dice. Increase or decrease all the value of all dice with that value by 1. Min value of 1 and max value of 6.",
        attack:[
            {tier: 0, diceReq: 1, dmg:1, name: ""},
            {tier: 0, diceReq: 3, dmg:3, name: ""},
            {tier: 0, diceReq: 3, dmg:4, name: ""},
            {tier: 0, diceReq: 3, dmg:5, name: ""},
            {tier: 1, diceReq: 6, dmg:12, name: ""},
            {tier: 2, diceReq: 8, dmg:12, name: ""}
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
            {tier: 0, diceReq: 1, dmg:1, name: ""},
            {tier: 0, diceReq: 3, dmg:6, name: ""},
            {tier: 0, diceReq: 3, dmg:3, name: ""},
            {tier: 0, diceReq: 3, dmg:3, name: ""},
            {tier: 1, diceReq: 6, dmg:12, name: ""},
            {tier: 2, diceReq: 8, dmg:20, name: ""}
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
]

module.exports = {
    Playstyle
}
