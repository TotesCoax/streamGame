//Future goal: Convert this to use classes so adding new items becomes easier.

let lootDeck = [
    /*{"name":"cardName",
    "type":"type",
    "description":"itemDescription",
    "consumed":false,
    "ability":function(){}}*/
    
    {"name":"Coat",
    "type":"equipment",
    "description":"The holder of this item reduces damage by 1 per damage instance",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Ring",
    "type":"equipment",
    "description":"The holder of this item gets 1 extra reroll per turn",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Sword",
    "type":"equipment",
    "description":"The holder of this item increases all damage dealt by 1 per damage instance",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Ability Potion",
    "type":"consumable",
    "description":"Restore 1 use of ability to target player.",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Ability Potion",
    "type":"consumable",
    "description":"Restore 1 use of ability to target player.",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Healing Potion",
    "type":"consumable",
    "description":"Target player heals up to their max HP.",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Healing Potion",
    "type":"consumable",
    "description":"Target player heals up to their max HP.",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }},

    {"name":"Sacred Relic",
    "type":"consumable",
    "description":"When any player is reduced to 0 or less HP, restore that player's HP to 1. This consumes the item.",
    "consumed":false,
    "ability":function(){
        alert(this.name + " effect has been applied")
        console.log(this.name + " effect has been applied by " + this.holder)
    }}
]