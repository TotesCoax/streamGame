let Boons = [
    {name:"CounterCounterAttack",
    type:"boon",
    description:"When a player is hit with a counterattack, you may negate that damage and deal that much damage to the enemy.",
    holder:"playerName",
    consumed:"false",
    ability:function(){
        alert(this.name + "boon has been used!")
    }}
]