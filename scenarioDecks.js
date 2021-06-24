//Eventually, use a class to make all of these so it will be easier to add new events
//maybe link it to an outside spreadsheet.


let scenario1Deck = [
    /*
    {"name":"cardName",
    "tier":1,
    "description":"itemDescription",
    "activeDice":0,
    "suppDice":0,
    "stage":[
        {
            "name":"name",
            "hp":0,
            "dmg":0,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}
    */

    {"name":"Fight the goon squad",
    "tier":1,
    "description":"itemDescription",
    "activeDice":3,
    "suppDice":3,
    "stage":[
        {
            "name":"Dispatch the first goon",
            "hp":8,
            "dmg":3,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Dispatch the second goon",
            "hp":8,
            "dmg":3,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Dispatch the third goon",
            "hp":8,
            "dmg":3,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Defeat the big boss!",
            "hp":25,
            "dmg":5,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }]
    },

    {
    "name":"Got Ambushed",
    "tier":1,
    "description":"itemDescription",
    "activeDice":3,
    "suppDice":3,
    "stage":[
        {
            "name":"Surprise attack",
            "hp":20,
            "dmg":3,
            "def":0,
            "aoe":"true",
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Your counterattack",
            "hp":20,
            "dmg":5,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }

    ]},

    {"name":"Trap room",
    "tier":1,
    "description":"itemDescription",
    "activeDice":3,
    "suppDice":3,
    "stage":[
        {
            "name":"Escape the trap!",
            "hp":30,
            "dmg":2,
            "def":0,
            "aoe":true,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}

]

let scenario2Deck = [

    {"name":"Poisoned",
    "tier":2,
    "description":"itemDescription",
    "activeDice":4,
    "suppDice":3,
    "stage":[
        {
            "name":"name",
            "hp":30,
            "dmg":1,
            "def":0,
            "aoe":false,
            "effect":function(){
                //No Consumables
                //At the start of each player's turn PLAYER suffers 4 dmg
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]},

    {"name":"The Dragon fight",
    "tier":2,
    "description":"itemDescription",
    "activeDice":4,
    "suppDice":3,
    "stage":[
        {
            "name":"The Dragon Circles",
            "hp":20,
            "dmg":3,
            "def":0,
            "aoe":true,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"The dragon lands",
            "hp":20,
            "dmg":5,
            "def":0,
            "aoe":false,
            "effect":function(){
                //No Abilities
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"We have it cornered!",
            "hp":20,
            "dmg":5,
            "def":5,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }

    ]},

    {"name":"Fight the big boi",
    "tier":2,
    "description":"itemDescription",
    "activeDice":4,
    "suppDice":3,
    "stage":[
        {
            "name":"Oh, he big.",
            "hp":50,
            "dmg":6,
            "def":3,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}

]

let scenario3Deck = [
    {"name":"This one has a temper",
    "tier":3,
    "description":"itemDescription",
    "activeDice":4,
    "suppDice":4,
    "stage":[
        {
            "name":"Chill",
            "hp":50,
            "dmg":5,
            "def":0,
            "aoe":true,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Enraged",
            "hp":50,
            "dmg":0,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }

    ]},

    {"name":"Just Survive",
    "tier":3,
    "description":"itemDescription",
    "activeDice":4,
    "suppDice":4,
    "stage":[
        {
            "name":"The Sword of Damocles",
            "hp":6,
            "dmg":99,
            "def":96,
            "aoe":false,
            "effect":function(){
                //At the start of each players turn, this enemy suffers 1 dmg, ignoring defense
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]},

    {"name":"Survive on skill alone",
    "tier":3,
    "description":"itemDescription",
    "activeDice":4,
    "suppDice":4,
    "stage":[
        {
            "name":"Start",
            "hp":20,
            "dmg":8,
            "def":3,
            "aoe":false,
            "effect":function(){
                //No Consumables
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Brace",
            "hp":20,
            "dmg":5,
            "def":3,
            "aoe":true,
            "effect":function(){
                //No Consumables
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Withstand",
            "hp":25,
            "dmg":12,
            "def":3,
            "aoe":false,
            "effect":function(){
                //No Consumables
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        },
        {
            "name":"Finale",
            "hp":25,
            "dmg":8,
            "def":3,
            "aoe":true,
            "effect":function(){
                //No Consumables
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}
]

let scenarios = [scenario1Deck, scenario2Deck, scenario3Deck]


let bossDeck = [
    /*
    {"name":"cardName",
    "tier":1,
    "description":"itemDescription",
    "activeDice":0,
    "suppDice":0,
    "stage":[
        {
            "name":"name",
            "hp":0,
            "dmg":0,
            "def":0,
            "aoe":false,
            "effect":function(){
                alert(this.name + " effect has been applied")
                console.log(this.name + " effect has been applied")
            }
        }
    ]}
    */
]