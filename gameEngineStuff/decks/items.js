//Future goal: Convert this to use classes so adding new items becomes easier.

/*List of timing events
startTurn -> start of player turn
attack -> when player deals damage
counterAttack -> when the player receives damage
playerDeath -> when a player damage counter equals or exceeds their HPmax
*/


let lootDeck = [
    /*{
        name:"cardName",
    type:"type",
    timing: "" //shortname name of the phase where it would trigger.
    description:"itemDescription",
    consumed:false,
    ability:function(){}}
    */
    
    {name:"Coat",
    type:"equipment",
    timing: "counterAttack",
    description:"The holder of this item reduces damage by 1 per damage instance",
    consumed:false,
    ability: function(dmg) {
        let newDmg = dmg - 1
        console.log(this.name + " effect has been applied. ", dmg, "->",newDmg)
        return newDmg
    }},

    {name:"Ring",
    type:"equipment",
    timing: "reroll",
    description:"The holder of this item gets 1 extra reroll per turn",
    consumed:false,
    ability: function(player) {
        newRerolls = player.currentRerolls + 1
        console.log(this.name + " effect has been applied. ", player.currentRerollsMax, " -> ", newRerolls)
        player.currentRerolls = newRerolls
    }},

    {name:"Sword",
    type:"equipment",
    timing: "attack",
    description:"The holder of this item increases all damage dealt by 1 per damage instance",
    consumed:false,
    ability: function(dmg) {
        let newDmg = dmg + 1
        console.log(this.name + " effect has been applied. ", dmg, "->",newDmg)
        return newDmg
    }},

    {name:"Ability Potion",
    type:"consumable",
    timing: "startTurn",
    description:"Restore 1 use of ability to target player.",
    consumed:false,
    ability: function(player) {
        let newAbil = player.abilityCounter + 1
        if (newAbil > player.abilityScenarioMax){
            alert("This would push abilities past your current max allowed.")
        } else {
            console.log(this.name + " effect has been applied. ",player.abilityCounter," -> ",newAbil)
            player.abilityCounter = newAbil
        }
    }},

    {name:"Ability Potion",
    type:"consumable",
    timing: "startTurn",
    description:"Restore 1 use of ability to target player.",
    consumed:false,
    ability: function(player) {
        let newAbil = player.abilityCounter + 1
        if (newAbil > player.abilityScenarioMax){
            alert("This would push abilities past your current max allowed.")
        } else {
            console.log(this.name + " effect has been applied. ",player.abilityCounter," -> ",newAbil)
            player.abilityCounter = newAbil
        }
    }},

    {name:"Healing Potion",
    type:"consumable",
    timing: "startTurn",
    description:"Target player heals up to their max HP.",
    consumed:false,
    ability: function(player) {
        player.dmgCounter = 0
        console.log(this.name + " effect has been applied.", player.dmgCounter,)
    }},

    {name:"Healing Potion",
    type:"consumable",
    timing: "startTurn",
    description:"Target player heals up to their max HP.",
    consumed:false,
    ability: function(player) {
        player.dmgCounter = 0
        console.log(this.name + " effect has been applied.", player.dmgCounter,)
    }},

    {name:"Sacred Relic",
    type:"consumable",
    timing: "playerDeath",
    description:"When any player is reduced to 0 or less HP, restore that player's HP to 1. This consumes the item.",
    consumed:false,
    ability: function(player) {
        let currentMax = player.playstyle.hpMax[board.level]
        console.log("Current dmg coutner: ", player.dmgCounter)
        player.dmgCounter = currentMax - 1
        console.log(this.name + " effect has been applied. New dmg counter: ", player.dmgCounter)
    }}
]

module.exports = {
    lootDeck
}
