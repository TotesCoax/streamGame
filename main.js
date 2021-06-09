//Grab the Active player hand
let activePlayerHand = document.getElementById("activePlayerHand").children
console.log(activePlayerHand)

//Setting up the Roll Listeners
document.getElementById("rollButton").addEventListener("click", rollHand)

//Hand Roller
function rollHand() {
    for (let i = 0; i < activePlayerHand.length; i++) {
        activePlayerHand[i].innerText = d6Roll()
    }
    console.log(activePlayerHand.children);
}

//Dice Roller
function d6Roll() {
    return Math.floor(Math.random() * 6) + 1
}

