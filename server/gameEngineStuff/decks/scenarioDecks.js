
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

    {name:"A pack of hooligans",
    tier:0,
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
            effect:function(board, gameState){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Dispatch the second goon",
            hp:8,
            dmg:3,
            def:0,
            aoe:false,
            effect:function(board, gameState){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Dispatch the third goon",
            hp:8,
            dmg:3,
            def:0,
            aoe:false,
            effect:function(board, gameState){
                console.log("This stage has no effect")
            }
        },
        {
            name:"Defeat the big boss!",
            hp:25,
            dmg:5,
            def:0,
            aoe:false,
            effect:function(board, gameState){
                console.log("This stage has no effect")
            }
        }]
    },

    {
    name:"An illusionary army",
    tier:0,
    description:"itemDescription",
    activeDice:3,
    suppDice:3,
    stage:[
        {
            name:"You cannot tell which is the real enemy.",
            hp:20,
            dmg:3,
            def:0,
            aoe:true,
            effect:function(board, gameState){
                console.log("This stage has no effect")
            }
        },
        {
            name:"The spell is broken! The caster is found.",
            hp:20,
            dmg:5,
            def:0,
            aoe:false,
            effect:function(board, gameState){
                console.log("This stage has no effect")
            }
        }

    ]},

    {name:"Trap room",
    tier:0,
    description:"itemDescription",
    activeDice:3,
    suppDice:3,
    stage:[
        {
            name:"Panic consumes the party. Rerolls -1. Try to escape the trap!!",
            hp:30,
            dmg:2,
            def:0,
            aoe:true,
            effect:function panic(board, gameState){
                //Rerolls -1
                let players = board.players
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

    {name:"A deadly assassin",
    tier:1,
    description:"itemDescription",
    activeDice:4,
    suppDice:3,
    stage:[
        {
            name:"A random player has been poisoned! They will take 4 damage at the start of each turn. Beat the stage to get them the antidote. Also you can't use consumables... have fun!",
            hp:30,
            dmg:1,
            def:0,
            aoe:false,
            effect:function poisoned(board){
                let players = board.players
                //No Consumables
                board.gameState.noConsumables = true
                //At the start of each player's turn POISONED PLAYER (randomly chosen) suffers X (4 is default for game) dmg
                //the poison tick is handled by another function in the turns
                let poisonedPlayer = players[Math.floor(Math.random() * (players.length)) + 1]
                poisonedPlayer.poison = 4
                console.log(poisonedPlayer.username, " has been poisoned!")
            }
        }
    ]},

    {name:"A large dragon",
    tier:1,
    description:"itemDescription",
    activeDice:4,
    suppDice:3,
    stage:[
        {
            name:"The dragon circles overhead, blasting the party with breath attacks.",
            hp:20,
            dmg:3,
            def:0,
            aoe:true,
            effect:function(board){
                console.log("This stage has no effect")
            }
        },
        {
            name:"You ground the dragon! The party trembles at it's fearsome presence. Abilities are disabled.",
            hp:20,
            dmg:5,
            def:0,
            aoe:false,
            effect:function(board){
                //No Abilities
                board.gameState.noAbilities = true
                console.log("No abilities may be used")
            }
        },
        {
            name:"We have it cornered! The dragon curls up in a defensive posture as the onslaught begins.",
            hp:20,
            dmg:5,
            def:5,
            aoe:false,
            effect:function(board){
                console.log("This stage has no effect")
            }
        }

    ]},

    {name:"A large beast",
    tier:1,
    description:"itemDescription",
    activeDice:4,
    suppDice:3,
    stage:[
        {
            name:"Oh lawd, he THICC.",
            hp:50,
            dmg:6,
            def:3,
            aoe:false,
            effect:function(board){
                console.log("This stage has no effect")
            }
        }
    ]}

]

let scenario3Deck = [
    {name:"Ol' Stumbles the drunken giant.",
    tier:2,
    description:"itemDescription",
    activeDice:4,
    suppDice:4,
    stage:[
        {
            name:"I'm fine, the floor just needs to stop moving on me!",
            hp:50,
            dmg:5,
            def:0,
            aoe:true,
            effect:function(board){
                console.log("This stage has no effect")
            }
        },
        {
            name:"I'm not cut off! You're cut off! ...Said by your limbs! HAH!",
            hp:50,
            dmg:15,
            def:0,
            aoe:false,
            effect:function(board){
                console.log("This stage has no effect")
            }
        }

    ]},

    {name:"The Doomsday Clock",
    tier:2,
    description:"itemDescription",
    activeDice:4,
    suppDice:4,
    stage:[
        {
            name:"Each turn this scenario deals one damage to itself. You just need to keep on fighting!",
            hp:6,
            dmg:99,
            def:99,
            aoe:false,
            effect:function countdown(board){
                //At the start of each players turn, this enemy suffers 1 dmg, ignoring defense
                board.scenarios[board.level].poison = 1
            }
        }
    ]},

    {name:"The Passive Aggressor",
    tier:2,
    description:"itemDescription",
    activeDice:4,
    suppDice:4,
    stage:[
        {
            name:"Consumables are disabled.",
            hp:20,
            dmg:8,
            def:3,
            aoe:false,
            effect:function(board){
                //No Consumables
                board.gameState.noConsumables = true
                console.log("No consumables active")
            }
        },
        {
            name:"Consumables are still disabled.",
            hp:20,
            dmg:5,
            def:3,
            aoe:true,
            effect:function(board){
                //No Consumables
                board.gameState.noConsumables = true
                console.log("No consumables active")
            }
        },
        {
            name:"Consumables are STILL disabled.",
            hp:25,
            dmg:12,
            def:3,
            aoe:false,
            effect:function(board){
                //No Consumables
                board.gameState.noConsumables = true
                console.log("No consumables active")
            }
        },
        {
            name:"Consumables are en-JUST KIDDING still disabled.",
            hp:25,
            dmg:8,
            def:3,
            aoe:true,
            effect:function(board){
                //No Consumables
                board.gameState.noConsumables = true
                console.log("No consumables active")
            }
        }
    ]}
]

let Adventure = [scenario1Deck, scenario2Deck, scenario3Deck]


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

module.exports = {
    Adventure
}
