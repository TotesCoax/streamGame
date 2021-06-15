//Eventually, use a class to make all of these so it will be easier to add new events
//maybe link it to an outside spreadsheet.

let event1Deck = [
    /*
    {"name":"cardName",
    "tier":1,
    "description":"itemDescription",
    "activeDice":0,
    "suppDice":0,
    "dmgCounter":0,
    "defeated":false,
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
    "dmgCounter":0,
    "defeated":false,
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
    "dmgCounter":0,
    "defeated":false,
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
    "dmgCounter":0,
    "defeated":false,
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