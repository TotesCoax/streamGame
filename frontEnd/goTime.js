//This is a file purely to initiate the game state for the testing.

window.addEventListener("load", goTime)

function goTime(){
    NewGameSetup()
    fillUpHTML()
}

function fillUpHTML() {
    fillUpScenario()
    fillUpPlayers()
    fillUpDiceRollingPhase()
    document.querySelector(".gameboard-level-counter").innerText = gameboard.level
    document.querySelector(".stage-counter").innerText = gameboard.scenarios[gameboard.level].stageCounter
}
