//Grab the Active player hand
let dice = document.getElementsByClassName("die")
console.log(dice)

//Setting up the Roll Listeners
document.getElementById("rollButton").addEventListener("click", rollHand)

//Hand Roller
function rollHand() {
    for (let i = 0; i < dice.length; i++) {
        dice[i].innerText = d6Roll()
    }
    console.log(dice);
}

//Dice Roller
function d6Roll() {
    return Math.floor(Math.random() * 6) + 1
}

