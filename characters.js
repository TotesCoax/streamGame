//Playstyle object holds the mechanics for each character class the players will use. Each mechanic is it's own object as well.

//I still need to add in the more specific mechanics to each character attack but this will do for now just to get some core programming setup.

let Playstyle = {
    brash: {
        "status":"inactive",
        "title": "the brash",
        "hpMax":[10,15,20],
        "abilityMax": [[1,1,1],[2,1,1],[3,2,1]],
        "abilityText": "Change one dice value into a 1 or 6",
        "attack":[
            {"tier": 0, "diceReq": 1, "dmg":1},
            {"tier": 0, "diceReq": 2, "dmg":4},
            {"tier": 0, "diceReq": 4, "dmg":10},
            {"tier": 1, "diceReq": 6, "dmg":16},
            {"tier": 2, "diceReq": 8, "dmg":27}
        ],
        "ability": function(target) {
            let newValue = prompt("What would you like to change it to? Must be 1 or 6")
            if (newValue === 1 || newValue === 6 ) {
            target.value = newValue
            } else {
                alert("Incorrect value was given")
            }
        }
    },

    elegant: {
        "status":"inactive",
        "title": "the elegant",
        "hpMax":[8,12,16],
        "abilityMax": [[1,1,1],[2,1,1],[3,2,1]],
        "abilityText": "Flip up to two standard dice to their opposite sides.",
        "attack":[
            {"tier": 0, "diceReq": 2, "dmg":1},
            {"tier": 0, "diceReq": 3, "dmg":3},
            {"tier": 0, "diceReq": 4, "dmg":5},
            {"tier": 0, "diceReq": 5, "dmg":8},
            {"tier": 2, "diceReq": 6, "dmg":12},
            {"tier": 3, "diceReq": 8, "dmg":24}
        ],
        "ability": function(target) {
            switch (target.value) {
                case 1:
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
        }
    },

    staunch: {
        "status":"inactive",
        "title": "the staunch",
        "HPMax":[12,18,24],
        "abilityMax": [[1,1,1],[2,1,1],[3,2,1]],
        "abilityText": "Change up to two standard dice to a value of 5",
        "attack":[
            {"tier": 0, "diceReq": 1, "dmg":1},
            {"tier": 0, "diceReq": 2, "dmg":3},
            {"tier": 0, "diceReq": 4, "dmg":8},
            {"tier": 2, "diceReq": 6, "dmg":15},
            {"tier": 3, "diceReq": 8, "dmg":25}
        ],
        "ability": function(targetArray) {
            if (targetArray.length > 2){
                alert("Too many dice submitted")
                return false;
            }
            for (let i = 0; i < targetArray.length; i++){
                targetArray[i].value = 5
            }
        }
    },

    sly: {
        "status":"inactive",
        "title":"the sly",
        "hpMax":[10,15,20],
        "abilityMax": [[1,1,1],[2,1,1],[3,2,1]],
        "abilityText": "Change up to two standard dice to a value of 2",
        "attack":[
            {"tier": 0, "diceReq": 1, "dmg":1},
            {"tier": 0, "diceReq": 2, "dmg":3},
            {"tier": 0, "diceReq": 4, "dmg":6},
            {"tier": 2, "diceReq": 6, "dmg":12},
            {"tier": 3, "diceReq": 8, "dmg":20}
        ],
        "ability": function(targetArray) {
            if (targetArray.length > 2){
                alert("Too many dice submitted")
                return false;
            }
            for (let i = 0; i < targetArray.length; i++){
                targetArray[i].value = 2
            }
        }
    },

    eccentric: {
        "status":"inactive",
        "title":"the eccentric",
        "hpMax":[8,12,16],
        "abilityMax": [[1,1,1],[2,1,1],[3,2,1]],
        "abilityText": "Pick a value among all dice. Increase or decrease all the value of all dice with that value by 1. Min value of 1 and max value of 6.",
        "attack":[
            {"tier": 0, "diceReq": 1, "dmg":1},
            {"tier": 0, "diceReq": 3, "dmg":3},
            {"tier": 0, "diceReq": 3, "dmg":4},
            {"tier": 0, "diceReq": 3, "dmg":5},
            {"tier": 2, "diceReq": 6, "dmg":12},
            {"tier": 3, "diceReq": 8, "dmg":12}
        ],
        "ability": function(targetValue, targetArray, direction) {
            //I'll do this later.
        }
    },

    serene: {
        "status":"inactive",
        "title":"the serene",
        "hpMax":[8,12,16],
        "abilityMax": [[1,1,1],[2,1,1],[3,2,1]],
        "abilityText": "Pick a player. That player restores 1 use of their ability (up to their max).",
        "attack":[
            {"tier": 0, "diceReq": 1, "dmg":1},
            {"tier": 0, "diceReq": 3, "dmg":6},
            {"tier": 0, "diceReq": 3, "dmg":3},
            {"tier": 0, "diceReq": 3, "dmg":3},
            {"tier": 2, "diceReq": 6, "dmg":12},
            {"tier": 3, "diceReq": 8, "dmg":20}
        ],
        "ability": function(targetPlayer) {
            if ((targetPlayer.abilityUse + 1) < targetPlayer.abilityMax) {
                targetPlayer.abilityUse++
            } else {
                alert("NOPERS")
            }
        }
    }
}

