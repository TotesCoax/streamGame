let gameboard = board


//GENERATE HTML ELEMENT FUNCTIONS


//Populates the UI with the current scenario.
//I don't think It will currently hide the second scenario.
function fillUpScenario(){
    let scenTemplate = document.getElementById("scenarioCardTemplate"),
        scenContainer = document.getElementById("scenarioContainer")

    scenContainer.appendChild(scenTemplate.content.cloneNode(true))

    let newScen = scenContainer.lastElementChild,
        currScen = gameboard.scenarios[gameboard.level].card

    newScen.id = `scenario${gameboard.level}`
    //newScen.children[0] = Image
    newScen.children[1].children[1].innerText = currScen.activeDice
    newScen.children[1].children[2].innerText = currScen.suppDice
    newScen.children[2].innerText = currScen.name
    //Populating the stage array
    let stageHTML = newScen.children[3],
        stageImport = currScen.stage,
        stageTemplate = document.getElementById("scenarioStageTemplate")

    for (let s = 0; s < stageImport.length; s++){
        stageHTML.appendChild(stageTemplate.content.cloneNode(true))
        let newStage = stageHTML.lastElementChild

        newStage.id = `stage${s}`
        newStage.children[0].innerText = stageImport[s].hp
        newStage.children[1].innerText = stageImport[s].dmg
        newStage.children[2].innerText = stageImport[s].name
    }
}

//This function takes the player array from gameboard object and populates HTML elements based on how pany players there are and what style they are playing.
function fillUpPlayers(){
    let temp = document.getElementById("playerCardTemplate"),
        playerContainer = document.getElementById("playerContainer")
    //console.log(temp.content)
    //console.log(temp.content.firstElementChild.id)
    //Populating the player array
    for (let i = 0; i < gameboard.players.length; i++){
        playerContainer.appendChild(temp.content.cloneNode(true))
        //playerInsert is always the last element created in the array
        let playerInsert = playerContainer.lastElementChild
            playerStats = gameboard.players[i]

        playerInsert.id = playerStats.username.toLowerCase()
        playerInsert.classList.add(playerStats.status)
        playerInsert.children[1].innerText = playerStats.username.toUpperCase()
        playerInsert.children[2].innerText = playerStats.playstyle.title
        playerInsert.children[3].children[1].firstElementChild.innerText = playerStats.playstyle.hpMax[gameboard.level]
        playerInsert.children[4].children[0].innerText = playerStats.playstyle.abilityMax[gameboard.level][gameboard.players.length - 2]
        playerInsert.children[4].children[1].innerText = playerStats.playstyle.abilityText
        //Populating the attack array
        let attackHTML = playerInsert.children[5],
            attackImport = playerStats.playstyle.attack,
            attackTemp = document.getElementById("playerAttackTemplate")

        // console.log(attackHTML, attackImport, attackTemp)
        for (let a = 0; a < attackImport.length; a++){
            attackHTML.appendChild(attackTemp.content.cloneNode(true))
            let newAttack = attackHTML.lastElementChild

            newAttack.id = `attack${a}`
            newAttack.children[0].innerText = attackImport[a].diceReq
            newAttack.children[1].innerText = attackImport.name
            newAttack.children[2].innerText = attackImport[a].dmg
        }
    }
}

//This function sets the initial die objects
//This should be run once at the start of a new player turn.
//If run again this function just adds more dice to the pool
function fillUpDiceRollingPhase() {
    let dieTemplate = document.getElementById("dieTemplate"),
        activeContainer = document.getElementById("activePlayerHand"),
        suppContainer = document.getElementById("supportPlayerHand")
    console.log(dieTemplate, activeContainer, suppContainer)

    for (let d = 0; d < gameboard.dicePool.active.length; d++){
        activeContainer.appendChild(dieTemplate.content.cloneNode(true))
        let newDie = activeContainer.lastElementChild,
            dieVal = gameboard.dicePool.active[d].value
        console.log(dieVal)
        newDie.getElementsByClassName("die")[0].innerText = dieVal
    }

    for (let d = 0; d < gameboard.dicePool.support.length; d++){
        suppContainer.appendChild(dieTemplate.content.cloneNode(true))
        let newDie = suppContainer.lastElementChild,
            dieVal = gameboard.dicePool.support[d].value
        console.log(dieVal)
        newDie.getElementsByClassName("die")[0].innerText = dieVal
    }

}



//REFRESH VALUES FUNCTIONS

//This function updates the values of the displaying dice based on the data from the board object
//should be run at the end of each roll command
function updateDiceValuesHTML(incomingDicePool){
    let activeDiceArray = document.querySelectorAll("#activePlayerHand .die"),
        supportDiceArray = document.querySelectorAll("#supportPlayerHand .die"),
        newActivePool = incomingDicePool.active,
        newSupportPool = incomingDicePool.support

    for(let a = 0; a < newActivePool.length; a++){
        activeDiceArray[a].innerText = newActivePool[a].value
    }

    for(let s = 0; s < newSupportPool.length; s++){
        supportDiceArray[s].innerText = newSupportPool[s].value
    }

}

//Function to move player cards around based on status
function movingPlayerCards() {
    let activeDestination = document.getElementById("activePlayerCardHook"),
        activePlayerToMove = document.querySelector("#playerContainer .active"),
        supportDestination = document.getElementById("supportPlayerCardHook"),
        supportPlayerToMove = document.querySelector("#playerContainer .support")

    activeDestination.appendChild(activePlayerToMove)
    supportDestination.appendChild(supportPlayerToMove)
}