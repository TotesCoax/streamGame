//Eventually, use a class to make all of these so it will be easier to add new events
//maybe link it to an outside spreadsheet.


let scenario1Deck = [
    /*
    {name:"cardName",
    tier:1,
    description:"itemDescription",
    activeDice:0,
    suppDice:0,
    stage:[
        {
            name:"name",
            hp:0,
            dmg:0,
            def:0,
            aoe:false,
            effect:function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}
    */

    {name:"Fight the goon squad",
    tier:1,
    description:"itemDescription",
    activeDice:3,
    suppDice:3,
    stage:[
        {
            name:"Dispatch the first goon",
            hp:8,
            dmg:3,
            def:0,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Dispatch the second goon",
            hp:8,
            dmg:3,
            def:0,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Dispatch the third goon",
            hp:8,
            dmg:3,
            def:0,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Defeat the big boss!",
            hp:25,
            dmg:5,
            def:0,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        }]
    },

    {
    name:"Got Ambushed",
    tier:1,
    description:"itemDescription",
    activeDice:3,
    suppDice:3,
    stage:[
        {
            name:"Surprise attack",
            hp:20,
            dmg:3,
            def:0,
            aoe:true,
            effect:function(){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Your counterattack",
            hp:20,
            dmg:5,
            def:0,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        }

    ]},

    {name:"Trap room",
    tier:1,
    description:"itemDescription",
    activeDice:3,
    suppDice:3,
    stage:[
        {
            name:"Escape the trap!",
            hp:30,
            dmg:2,
            def:0,
            aoe:true,
            effect:function panic(players){
                //Rerolls -1
                players.forEach(player => {
                    console.log(player.username, "rerolls: ", player.currentRerollsMax)
                    player.currentRerollsMax -= 1
                    console.log(player.username, "rerolls: ", player.currentRerollsMax)
                })
                //I elected to do for each player since the rerolls set EVERYONE to 2 as well, and I might implement a way to switch Actvie/Support people later.
                console.log("Panic consumes the party");
            }
        }
    ]}

]

let scenario2Deck = [

    {name:"Poisoned",
    tier:2,
    description:"itemDescription",
    activeDice:4,
    suppDice:3,
    stage:[
        {
            name:"Poisoned!",
            hp:30,
            dmg:1,
            def:0,
            aoe:false,
            effect:function poisoned(players){
                //No Consumables
                gameState.noConsumables = true
                //At the start of each player's turn POISONED PLAYER (randomly chosen) suffers X (4 is default for game) dmg
                //the poison tick is handled by another function in the turns
                let poisonedPlayer = players[Math.floor(Math.random() * (players.length)) + 1]
                poisonedPlayer.poison = 4
                console.log(poisonedPlayer.username, " has been poisoned!")
            }
        }
    ]},

    {name:"The Dragon fight",
    tier:2,
    description:"itemDescription",
    activeDice:4,
    suppDice:3,
    stage:[
        {
            name:"The Dragon Circles",
            hp:20,
            dmg:3,
            def:0,
            aoe:true,
            effect:function(){
                console.log("This stage has no effect")
            }
        },
        {
            name:"The dragon lands",
            hp:20,
            dmg:5,
            def:0,
            aoe:false,
            effect:function(){
                //No Abilities
                gameState.noAbilities = true
                console.log("No abilities may be used")
            }
        },
        {
            name:"We have it cornered!",
            hp:20,
            dmg:5,
            def:5,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        }

    ]},

    {name:"Fight the big boi",
    tier:2,
    description:"itemDescription",
    activeDice:4,
    suppDice:3,
    stage:[
        {
            name:"Oh, he big.",
            hp:50,
            dmg:6,
            def:3,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        }
    ]}

]

let scenario3Deck = [
    {name:"This one has a temper",
    tier:3,
    description:"itemDescription",
    activeDice:4,
    suppDice:4,
    stage:[
        {
            name:"Chill",
            hp:50,
            dmg:5,
            def:0,
            aoe:true,
            effect:function(){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Enraged",
            hp:50,
            dmg:15,
            def:0,
            aoe:false,
            effect:function(){
                console.log("This stage has no effect")
            }
        }

    ]},

    {name:"Just Survive",
    tier:3,
    description:"itemDescription",
    activeDice:4,
    suppDice:4,
    stage:[
        {
            name:"The Sword of Damocles",
            hp:6,
            dmg:99,
            def:96,
            aoe:false,
            effect:function countdown(){
                //At the start of each players turn, this enemy suffers 1 dmg, ignoring defense
                board.scenarios[board.level].poison = 1
            }
        }
    ]},

    {name:"Survive on skill alone",
    tier:3,
    description:"itemDescription",
    activeDice:4,
    suppDice:4,
    stage:[
        {
            name:"Start",
            hp:20,
            dmg:8,
            def:3,
            aoe:false,
            effect:function(){
                //No Consumables
                gameState.noConsumables = true
                console.log("No consumables active")
            }
        },
        {
            name:"Brace",
            hp:20,
            dmg:5,
            def:3,
            aoe:true,
            effect:function(){
                //No Consumables
                gameState.noConsumables = true
                console.log("No consumables active")
            }
        },
        {
            name:"Withstand",
            hp:25,
            dmg:12,
            def:3,
            aoe:false,
            effect:function(){
                //No Consumables
                gameState.noConsumables = true
                console.log("No consumables active")
            }
        },
        {
            name:"Finale",
            hp:25,
            dmg:8,
            def:3,
            aoe:true,
            effect:function(){
                //No Consumables
                gameState.noConsumables = true
                console.log("No consumables active")
            }
        }
    ]}
]

let scenarios = [scenario1Deck, scenario2Deck, scenario3Deck]


let bossDeck = [
    /*
    {name:"cardName",
    tier:1,
    description:"itemDescription",
    activeDice:0,
    suppDice:0,
    stage:[
        {
            name:name,
            hp:0,
            dmg:0,
            def:0,
            aoe:false,
            effect:function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}
    */
]