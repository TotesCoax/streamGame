let gameboard = boardExport


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
    newScen.querySelector(".active-player-rolls").innerText = currScen.activeDice
    newScen.querySelector(".support-player-rolls").innerText = currScen.suppDice
    newScen.querySelector(".scenario-title").innerText = currScen.name
    //Populating the stage array
    let stageHTML = newScen.querySelector(".scenario-stage-hook"),
        stageImport = currScen.stage,
        stageTemplate = document.getElementById("scenarioStageTemplate")

    for (let s = 0; s < stageImport.length; s++){
        stageHTML.appendChild(stageTemplate.content.cloneNode(true))
        let newStage = stageHTML.lastElementChild

        newStage.id = `stage${s}`
        newStage.querySelector(".stage-hp-stat").innerText = stageImport[s].hp
        newStage.querySelector(".stage-dmg-stat").innerText = stageImport[s].dmg
        newStage.querySelector(".stage-name").innerText = stageImport[s].name
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
        console.log(`Inserting player: ${gameboard.players[i].username}` )
        playerContainer.appendChild(temp.content.cloneNode(true))
        //playerInsert is always the last element created in the array
        let playerInsert = playerContainer.lastElementChild,
            playerStats = gameboard.players[i]

        playerInsert.id = playerStats.username.toLowerCase()
        playerInsert.classList.add(playerStats.status)
        playerInsert.querySelector(".player-name").innerText = playerStats.username.toUpperCase()
        playerInsert.querySelector(".player-class").innerText = playerStats.playstyle.title
        playerInsert.querySelector(".player-hp-counter").innerText = playerStats.playstyle.hpMax[gameboard.level]
        playerInsert.querySelector(".ability-uses").innerText = playerStats.playstyle.abilityMax[gameboard.level][gameboard.players.length - 2]
        playerInsert.querySelector(".ability-text").innerText = playerStats.playstyle.abilityText
        console.log("Easy  stuff filled, moving to attack array")
        //Populating the attack array for new player
        let attackHTML = playerInsert.querySelector(".attack-box"),
            attackImport = playerStats.playstyle.attack,
            attackTemp = document.getElementById("playerAttackTemplate")

        // console.log(attackHTML, attackImport, attackTemp)
        for (let a = 0; a < attackImport.length; a++){
            console.log(`Inserting attack: ${attackImport[a].name}`)
            attackHTML.appendChild(attackTemp.content.cloneNode(true))
            let newAttack = attackHTML.lastElementChild

            newAttack.id = `${attackImport[a].name.split(" ").join("")}`
            newAttack.querySelector(".attack-req-dice").innerText = attackImport[a].diceReq
            console.log(attackImport[a].threshold)
            if (!isNaN(attackImport[a].threshold)) {
                console.log("Threshold detected, Activating switch.", playerStats.playstyle.mechanic.name);
                switch (playerStats.playstyle.mechanic.name) {
                    case "staunch":
                        console.log("Staunch detected")
                        playerInsert.querySelector(`#${newAttack.id} .attack-req-threshold`).innerText = "sum of dice values &geq; " + attackImport[a].threshold
                        break;
                    case "sly":
                        console.log("Sly detected")
                        playerInsert.querySelector(`#${newAttack.id} .attack-req-threshold`).innerText = "sum of dice values &leq; " + attackImport[a].threshold
                        break;
                    default:
                        break;
                }
            }
            newAttack.querySelector(".attack-name").innerText = attackImport[a].name
            newAttack.querySelector(".attack-damage").innerText = attackImport[a].dmg
        }
    }
}

//This function sets the initial die objects
//This should be run once at the start of a new player turn.
//If run again this function just adds more dice to the pool
function fillUpDiceRollingPhase() {
    let dieTemplate = document.getElementById("dieTemplateRoll"),
        activeContainer = document.getElementById("activePlayerHand"),
        suppContainer = document.getElementById("supportPlayerHand")
    console.log(dieTemplate, activeContainer, suppContainer)

    for (let d = 0; d < gameboard.dicePool.active.length; d++){
        activeContainer.appendChild(dieTemplate.content.cloneNode(true))
        let newDie = activeContainer.lastElementChild,
            dieVal = gameboard.dicePool.active[d].value,
            dieID = gameboard.dicePool.active[d].id
        console.log(dieVal, dieID)
        newDie.querySelector(".die").innerText = dieVal
        newDie.querySelector(".die").id = dieID
    }

    for (let d = 0; d < gameboard.dicePool.support.length; d++){
        suppContainer.appendChild(dieTemplate.content.cloneNode(true))
        let newDie = suppContainer.lastElementChild,
            dieVal = gameboard.dicePool.support[d].value,
            dieID = gameboard.dicePool.support[d].id
        console.log(dieVal, dieID)
        newDie.querySelector(".die").innerText = dieVal
        newDie.querySelector(".die").id = dieID
    }

}

function fillUpAttackHand(){
    let dieTemplate = document.getElementById("dieTemplateAttack"),
        attackHandContainer = document.getElementById("attackHandContainer")

        for (let d = 0; d < gameboard.attackHand.length; d++){
            attackHandContainer.appendChild(dieTemplate.content.cloneNode(true))
            let newDie = attackHandContainer.lastElementChild,
                dieVal = gameboard.attackHand[d].value,
                dieID = gameboard.attackHand[d].id
            console.log(dieVal, dieID)
            newDie.querySelector(".die").innerText = dieVal
            newDie.querySelector(".die").id = dieID
        }
    }

function insertItemIntoInventory(playerUsername, item) {
    let destination = document.querySelector(`#${playerUsername.toLowerCase()} .inventory`),
        template = document.getElementById("playerItemTemplate")

    destination.appendChild(template.content.cloneNode(true))

    let newItem = destination.lastElementChild
    newItem.id = item.name.split(" ").join("")
    newItem.querySelector(".playerItemName").innerText = item.name
    newItem.querySelector(".playerItemDescription").innerText = item.description
}



//REFRESH VALUES FUNCTIONS - > These might be unneeded as the update can be coded into the server interaction code

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
//This should be run at the start of each turn I think.
function movingPlayerCards() {
    let activeDestination = document.getElementById("activePlayerCardHook"),
        activePlayerToMove = document.querySelector(".active.player"),
        supportDestination = document.getElementById("supportPlayerCardHook"),
        supportPlayerToMove = document.querySelector(".support.player"),
        inactiveDestination = document.getElementById("playerContainer"),
        activeToInactivePlayer = document.querySelector("#activePlayerCardHook .inactive")

    activeDestination.appendChild(activePlayerToMove)
    supportDestination.appendChild(supportPlayerToMove)
    if (activeToInactivePlayer){
        inactiveDestination.appendChild(activeToInactivePlayer)
    }
}







//INTERACTION ELEMENTS
//code in refreshes to all of these too.