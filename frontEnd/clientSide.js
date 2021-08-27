const socket = io("http://localhost:3000")

let gameboard = {}

socket.on('init', handleInit)

function handleInit(msg) {
    console.log(msg)
}

socket.on('gamestate', handleGamestate)

function handleGamestate(data){
    console.log("Gamestate refresh object:", data)
    gameboard = data.boardExport 

    console.log("New gamestate arrived!", gameboard)
    refreshScenario()
    refreshPlayers()
    //Dice Controller
    switch (data.type) {
        case "startWait":
            insertStartTurnButton()
            break;
        case "rollPhase":
            refreshDice()
            break;
        case "attackPhase":
            refreshAttackHand()
            break;
        default:
            if (gameboard.attackHand.length > 0){
                refreshAttackHand()
            } else if (gameboard.dicePool.active.length > 0){
                refreshDice()
            } else if (gameboard.gameState.turnCounter > 0){
                insertStartTurnButton()
            } else if (gameboard.scenarios.length > 0) {
                insertStartScenarioButton()
            }
            break;
    }
    refreshDMGValues()
    console.log("All refreshed!")
}

socket.on('prompt', handlePrompt)

function handlePrompt(dataFromServer){
    console.log("Prompt arrived!")
    console.log(dataFromServer);
    promptPlayer(dataFromServer)
}

socket.on('alert', handleAlert)

function handleAlert(data) {
    console.log("Alert arrived!")
    console.log(data)
    alert(data.message)
    requestBoardExport()
}

socket.on('itemUsed', handleItemUsed)

function handleItemUsed(data) {
    console.log(data)
}

socket.on("itemNotice", handleItemNotice)

function handleItemNotice(data){
    console.log(data)
}

//This gets back a gamestate refresh
function requestBoardExport() {
    socket.emit("requestBoardState")
}

socket.on("scenarioDefeated", handleScenarioDefeated)

function handleScenarioDefeated(data){
    console.log(data)
}

//This gets back a gamestate refresh
function startNewGame() {
    socket.emit('newGame', { data: ["Me", "You"] })
}

function sendStartTurn(e){
    e.target.remove()
    socket.emit('startTurn')
}

function sendStartScenario(e){
    e.target.remove()
    socket.emit('startScenario')
}

//GENERATE HTML ELEMENT FUNCTIONS

function fillUpDevStats() {
    document.querySelector(".gameboard-level-counter").innerText = gameboard.level
    document.querySelector(".stage-counter").innerText = gameboard.scenarios[gameboard.level].stageCounter
    console.log("Dev stats refreshed!")
}

//Populates the UI with the current scenario.
//I don't think It will currently hide the second scenario.
function fillUpScenario(){
    let scenTemplate = document.getElementById("scenarioCardTemplate"),
        scenContainer = document.getElementById("scenarioContainer")
    gameboard.scenarios.forEach(scenario =>{
        scenContainer.appendChild(scenTemplate.content.cloneNode(true))
    
        let newScen = scenContainer.lastElementChild,
            currScen = scenario.card
    
        newScen.id = `scenario${scenario.card.tier}`
        if (scenario.defeated === true){
            newScen.classList.add("defeated")
        }
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
    
            newStage.id = `scenario${gameboard.level}stage${s}`
            newStage.querySelector(".stage-hp-stat").innerText = stageImport[s].hp
            newStage.querySelector(".stage-dmg-stat").innerText = stageImport[s].dmg
            if (stageImport[s].def > 0){
                newStage.querySelector(".stage-def-stat").innerText = stageImport[s].def
                newStage.querySelector(".stage-def").classList.remove("hidden")
            }
            if (stageImport[s].aoe === true){
                newStage.querySelector(".stage-aoe").classList.remove("hidden")
            }
            newStage.querySelector(".stage-name").innerText = stageImport[s].name
        }
    })
    console.log("Scenario(s) refreshed!")
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

        playerInsert.id = playerStats.username.toLowerCase().split(" ").join("")
        playerInsert.classList.add(playerStats.status)
        playerInsert.querySelector(".player-name").innerText = playerStats.username.toUpperCase()
        playerInsert.querySelector(".player-class").innerText = "the " + playerStats.playstyle.title
        playerInsert.querySelector(".player-hp-counter").innerText = playerStats.playstyle.hpMax[gameboard.level]
        playerInsert.querySelector(".ability-use-counter").innerText = playerStats.playstyle.abilityMax[gameboard.level][gameboard.players.length - 2]
        playerInsert.querySelector(".ability-button").dataset.username = playerStats.username.toLowerCase()
        playerInsert.querySelector(".ability-button").addEventListener("click", activateAbility)
        playerInsert.querySelector(".ability-text").innerText = playerStats.playstyle.abilityText
        let targetData = playerInsert.querySelector(".target")
        targetData.dataset.username = playerStats.username.toLowerCase().split(" ").join("")
        // console.log("Easy  stuff filled, moving to attack array")
        //Populating the attack array for new player
        let attackHTML = playerInsert.querySelector(".attack-box"),
            attackImport = playerStats.playstyle.attack,
            attackTemp = document.getElementById("playerAttackTemplate")

        // console.log(attackHTML, attackImport, attackTemp)
        for (let a = 0; a < attackImport.length; a++){
            //console.log(attackImport[a]);
            //console.log(`Inserting attack: ${attackImport[a].name}`)
            attackHTML.appendChild(attackTemp.content.cloneNode(true))
            let newAttack = attackHTML.lastElementChild

            newAttack.id = `${attackImport[a].name.split(" ").join("")}`
            newAttack.querySelector(".attack-req-dice").innerText = attackImport[a].diceReq
            // console.log(attackImport[a].threshold)
            if (!isNaN(attackImport[a].threshold)) {
                // console.log("Threshold detected, Activating switch.", playerStats.playstyle.title);
                if (a === 0 && playerStats.playstyle.title !== "elegant"){
                    playerInsert.querySelector(`#${newAttack.id} .attack-req-threshold`).innerHTML = "die with value of " + attackImport[a].threshold
                } else {
                    switch (playerStats.playstyle.title) {
                        case "staunch":
                            // console.log("Staunch detected")
                            playerInsert.querySelector(`#${newAttack.id} .attack-req-threshold`).innerHTML = "dice, sum of dice values \&geq; " + attackImport[a].threshold
                            break;
                        case "sly":
                            // console.log("Sly detected")
                            playerInsert.querySelector(`#${newAttack.id} .attack-req-threshold`).innerHTML = "dice, sum of dice values \&leq; " + attackImport[a].threshold
                            break;
                        default:
                            playerInsert.querySelector(`#${newAttack.id} .attack-req-threshold`).innerHTML = playerStats.playstyle.title + " dice"
                            break;
                    }
                }
            }
            newAttack.querySelector(".attack-name").innerText = attackImport[a].name
            newAttack.querySelector(".attack-damage").innerText = attackImport[a].dmg
            newAttack.querySelector(".attack-button").dataset.attackNameTrim = attackImport[a].name.split(" ").join("")
            newAttack.querySelector(".attack-button").dataset.username = playerStats.username
        }
        refreshItems(playerStats)
    }
}

function insertStartTurnButton(){
    let activePlayer = gameboard.players.find(player => player.status === "active"),
    infopanel = document.querySelector("#infopanel")
    if(infopanel.firstChild){
        infopanel.firstChild.remove()
    }
    console.log("Insert attack button for: ", activePlayer.username)
    if (gameboard.dicePool.active.length === 0 && gameboard.attackHand.length === 0){
        let startTurnBtn = document.createElement("button")
        startTurnBtn.innerText = `Start ${activePlayer.username}'s turn!`
        startTurnBtn.addEventListener("click", sendStartTurn)
        infopanel.appendChild(startTurnBtn)
    }
}

function insertStartScenarioButton(){
    let infopanel = document.querySelector("#infopanel")
    if(infopanel.firstChild){
        infopanel.firstChild.remove()
    }
    console.log("Insert attack button for new scenario!")
    if (gameboard.dicePool.active.length === 0 && gameboard.attackHand.length === 0){
        let startNewScenario = document.createElement("button")
        startNewScenario.innerText = "Ready to move on to the next scenario!"
        startNewScenario.addEventListener("click", sendStartScenario)
        infopanel.appendChild(startNewScenario)
    }
}


//This function sets the initial die objects
function fillUpDiceRollingPhase() {
    let dieTemplate = document.getElementById("dieTemplateRoll"),
        activeContainer = document.getElementById("activePlayerHand"),
        suppContainer = document.getElementById("supportPlayerHand")
    //console.log(dieTemplate, activeContainer, suppContainer)
//Active player dice
    for (let d = 0; d < gameboard.dicePool.active.length; d++){
        activeContainer.appendChild(dieTemplate.content.cloneNode(true))
        let newDie = activeContainer.lastElementChild,
            dieVal = gameboard.dicePool.active[d].value,
            dieID = gameboard.dicePool.active[d].id,
            dieKeep = gameboard.dicePool.active[d].keep
        console.log(dieVal, dieID)
        newDie.querySelector(".die").innerText = dieVal
        newDie.querySelector(".die").id = dieID
        if (dieKeep){
            newDie.querySelector(".die").classList.add("keep")
        }
    }
//Support Player dice
    for (let d = 0; d < gameboard.dicePool.support.length; d++){
        suppContainer.appendChild(dieTemplate.content.cloneNode(true))
        let newDie = suppContainer.lastElementChild,
            dieVal = gameboard.dicePool.support[d].value,
            dieID = gameboard.dicePool.support[d].id,
            dieKeep = gameboard.dicePool.support[d].keep
        console.log(dieVal, dieID)
        newDie.querySelector(".die").innerText = dieVal
        newDie.querySelector(".die").id = dieID
        if (dieKeep){
            newDie.querySelector(".die").classList.add("keep")
        }
    }
    updateRerollCount()
    document.querySelectorAll(".roll-dash").forEach(element => {
        element.classList.remove("hidden")
    })
    document.querySelector(".attack-hand").classList.add("hidden")
    console.log("Rolling hands filled up!")
}

function fillUpAttackHand(){
    console.log("Filling up attack hand HTML")
    let dieTemplate = document.getElementById("dieTemplateAttack"),
        attackHandContainer = document.getElementById("attackHandContainer")

        for (let d = 0; d < gameboard.attackHand.length; d++){
            attackHandContainer.appendChild(dieTemplate.content.cloneNode(true))
            let newDie = attackHandContainer.lastElementChild,
                dieVal = gameboard.attackHand[d].value,
                dieID = gameboard.attackHand[d].id,
                dieSubmit = gameboard.attackHand[d].submitted
            console.log(dieVal, dieID)
            newDie.querySelector(".die").innerText = dieVal
            newDie.querySelector(".die").id = dieID
            if (dieSubmit){
                newDie.querySelector(".die").classList.add("submitted")
            }
        }
        document.querySelector(".attack-hand").classList.remove("hidden")
        document.querySelectorAll(".roll-dash").forEach(element => {
            element.classList.add("hidden")
        })
        console.log("Attack hand refreshed!")
    }

function fillUpPlayerInventory(player) {
    let template = document.getElementById("playerItemTemplate")
    console.log(player)
    if (player.inventory.length > 0){
        player.inventory.forEach(item => {
            let destination = document.querySelector(`#${player.username.toLowerCase()} .inventory`)
            destination.appendChild(template.content.cloneNode(true))
            let newItem = destination.lastElementChild
            newItem.classList.add(item.name.split(" ").join("").toLowerCase())
            if (item.consumed === true){
                newItem.classList.add("consumed")
            }
            newItem.querySelector(".player-item-name").innerText = item.name
            newItem.querySelector(".player-item-description").innerText = item.description
            newItem.querySelector("button").dataset.holder = player.username.split(" ").join("").toLowerCase()
            newItem.querySelector('button').dataset.itemname = item.name.split(" ").join("").toLowerCase()
        })
    }
}
// {username: board.players[i].username, itemname: board.players[i].inventory[j].name, consumed: board.players[i].inventory[j].consumed}
function transmitItemPhase(playersWithConsumables) {
    console.log(playersWithConsumables)
    let infopane = document.querySelector("#infopanel"),
        newDiv = document.createElement("div"),
        newButton = document.createElement("button")

        newDiv.classList.add("infopane-item")
        newButton.innerText = "Move to next phase =>"
        newButton.addEventListener("click", moveToSupportPhase)
        playersWithConsumables.forEach(player => {
            let newItem = document.createElement("div"),
                newPlayerName = document.createElement("p")
                
            newItem.innerText = player.itemname
            newPlayerName.innerText = player.username
            newItem.append(newPlayerName)
            newDiv.append(newItem)
            infopane.append(newDiv)
        })
        infopane.append(newButton)
        toggleItemButtonVisibility()
}

function toggleItemButtonVisibility(){
    let itemButtons = document.querySelectorAll(".use-item-visibility")
    itemButtons.forEach(item =>{ item.classList.toggle("hidden")})
}

//Prompt functions -- FINISH LATER

function clearPrompt(){
    let overlay = document.querySelector("#overlay"),
        alertContainer = document.querySelector("#overlay .alert")

        while (alertContainer.firstChild) {
            alertContainer.removeChild(alertContainer.firstChild)
        }
    overlay.classList.toggle("hidden")
    }

function promptPlayer(data){
    let overlay = document.querySelector("#overlay"),
        alertContainer = document.querySelector("#overlay .alert"),
        newForm = document.createElement("form"),
        newNotice = document.createElement("div"),
        validChoices = data.choices,
        requestCode = data.request
    console.log("Building request for: ", requestCode)
    if (data.switchTriggered === true){
        let switchDiv = document.createElement("div")
        switchDiv.innerText = data.switchMessage
        alertContainer.appendChild(switchDiv)
    }
    if (data.stageDefeated === true){
        let stageDiv = document.createElement("div")
        stageDiv.innerText = data.stageMessage
        alertContainer.appendChild(stageDiv)
    }
    if (data.scenarioDefeated === true){
        let scenDiv = document.createElement("div")
        scenDiv.innerText = data.scenarioMessage
        alertContainer.appendChild(scenDiv)
    }
    alertContainer.appendChild(newForm)
    newNotice.innerText = data.message
    newForm.appendChild(newNotice)
    validChoices.forEach(choice => {
        let newDiv = document.createElement("div")
            newBtn = document.createElement("input")
        newBtn.setAttribute("type", "radio")
        newBtn.value = choice
        newBtn.name = "playerSelect"
        newDiv.appendChild(newBtn)
        let newLbl = document.createElement("label")
        newLbl.setAttribute("for", choice)
        newLbl.innerText = choice
        newDiv.appendChild(newLbl)
        newForm.appendChild(newDiv)
    })
    let newSubmit = document.createElement("button")
    newSubmit.type = "button"
    newSubmit.dataset.requestCode = requestCode
    newSubmit.addEventListener("click", checkPlayerChoice)
    newSubmit.innerText = "Submit!"
    newForm.appendChild(newSubmit)
    overlay.classList.toggle("hidden")
}

function checkPlayerChoice(e) {
    let form = document.querySelector("#overlay .alert form"),
        choice,
        requestCode = e.target.dataset.requestCode

    for (let i = 0; i < form.length; i++){
        if (form[i].checked === true){
            choice = form[i]
        }
    }
    if (!choice){
        alert("Please select an option then hit submit.")
    } else {
        clearPrompt()
        sendPlayerChoice(choice.value, requestCode)
    }
}

function sendPlayerChoice(choice, requestCode){
    let choiceObject = {
        choice: choice,
        requestCode: requestCode
    }
    console.log(choiceObject)
    socket.emit('sendChoice', choiceObject)
}

function activateItem(e){
    console.log(e.target)
    //Generate Player Targetting
    let playerTargets = document.querySelectorAll(".player.target")
    playerTargets.forEach(player => {
        player.classList.toggle("hidden")
        player.addEventListener("click", sendUseItem)
    })
}

function sendUseItem(e){
    console.log(e)
    let useItemObject = {
        holder: e.target.dataset.holder,
        item: e.target.dataset.itemname,
        target: e.target.dataset.username
    }
    console.log(useItemObject)
    let playerTargets = document.querySelectorAll(".player.target")
    playerTargets.forEach(player => {
        player.classList.toggle("hidden")
        player.removeEventListener("click", sendUseItem)
    })
    toggleItemButtonVisibility()
    socket.emit("useItem", useItemObject)
}

function moveToSupportPhase(){
    let infopane = document.querySelector("#infopanel")

    while (infopane.firstChild) {
        infopane.removeChild(infopane.firstChild)
    }
    selectSupportPhase() //Turn this into a socket emit
}




//REFRESH VALUES FUNCTIONS - > These might be unneeded as the update can be coded into the server interaction code

//This function updates the values of the displaying dice based on the data from the board object
//should be run at the end of each roll command
//It removes current dice and refills with new dice objects with new values. I did it this way instead of just refreshing the value cuz it seemed more modular.
function refreshPlayers() {
    let playerContainer = document.querySelector("#playerContainer"),
        atkContainer = document.querySelector("#activePlayerCardHook"),
        supContainer = document.querySelector("#supportPlayerCardHook")

    while (playerContainer.firstChild) {
        playerContainer.removeChild(playerContainer.firstChild)
    }
    if (atkContainer.firstChild){
        atkContainer.removeChild(atkContainer.firstChild)
    }
    if (supContainer.firstChild){
        supContainer.removeChild(supContainer.firstChild)
    }
    fillUpPlayers()
    movingPlayerCards()
}

function refreshDice(){
    let activeDiceArray = document.querySelector("#activePlayerHand"),
        supportDiceArray = document.querySelector("#supportPlayerHand")

    while (activeDiceArray.firstChild){
        activeDiceArray.removeChild(activeDiceArray.firstChild)
    }
    while (supportDiceArray.firstChild){
        supportDiceArray.removeChild(supportDiceArray.firstChild)
    }
    fillUpDiceRollingPhase()
}

function refreshDMGValues(){
    let scenDMGCounterHTML = document.querySelector(`#scenario${gameboard.level} .scenario-dmg-counter`),
        boardLevelCounterHTML = document.querySelector("#devTracker .gameboard-level-counter"),
        stageCounterHTML = document.querySelector("#devTracker .stage-counter")
    boardLevelCounterHTML.innerText = gameboard.level
    gameboard.players.forEach(player => {
        document.querySelector(`#${player.username} .player-dmg-counter`).innerText = player.dmgCounter
        document.querySelector(`#${player.username} .player-hp-counter`).innerText = player.playstyle.hpMax[gameboard.level]
        document.querySelector(`#${player.username} .ability-use-counter`).innerText = player.abilityCounter
    })
    if (typeof(gameboard.scenarios[gameboard.level]) !== "undefined"){
        scenDMGCounterHTML.innerText = gameboard.scenarios[gameboard.level].dmgCounter 
        stageCounterHTML.innerText = gameboard.scenarios[gameboard.level].stageCounter
    }
    console.log("Values have been refreshed")
}

function refreshItems(player) {
    let inventory = document.querySelectorAll(`#${player.username} .inventory`)
    // console.log(inventories)
    while (inventory.firstChild){
        inventory.removeChild(inventory.firstChild)
    }
    fillUpPlayerInventory(player)
}


//Function to move player cards around based on status
//This should be run at the start of each turn I think.
function movingPlayerCards() {
    settingStatusHTML()
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

function settingStatusHTML() {
    let playerStats = gameboard.players
    
    playerStats.forEach(player => {
       let playerHTML = document.getElementById(`${player.username.toLowerCase()}`)
       playerHTML.classList.remove("active", "support", "inactive")
       playerHTML.classList.add(`${player.status}`)
    })
    document.querySelectorAll(".scenario-stage").forEach(stage => stage.classList.remove("currScen"))
    try {
        document.querySelector(`#scenario${gameboard.level}stage${gameboard.scenarios[gameboard.level].stageCounter}`).classList.add("currScen")
    } catch (error) {
        console.log("There's no current scenario to mark.");
    }
}




//INTERACTION ELEMENTS
//code in refreshes to all of these too?
//Eventually become socket emits

//Send keep die command
function sendKeepDie(e) {
    console.log(e.target.previousElementSibling.id)
    let foundDie = Number(e.target.previousElementSibling.id)
    socket.emit('keepDie', foundDie)
}

function sendSubmitDie(e){
    console.log(e.target.previousElementSibling.id)
    let foundDie = Number(e.target.previousElementSibling.id)
    socket.emit('submitDie', foundDie)
}

function sendAttackPhase() {
    let choice = confirm("Are you sure you want to move to attack phase?")
    if (choice){
        socket.emit('toAttackPhase')
        document.querySelector(".attack-hand").classList.toggle("hidden")
        toggleRollHUDdisplay()
    }
}

function sendAttack(e){
    //console.log(e.target.dataset.attackNameTrim)
    let attackSendObj = {
        username: e.target.dataset.username,
        attackName: e.target.dataset.attackNameTrim
    }
    socket.emit('useAttack', attackSendObj)
}

function activateAbility(e){
    console.log(e.target)
    let player = gameboard.players.find(entry => entry.username === e.target.dataset.username)
    if(player.abilityCounter > 0){
        
        let newBtn = document.createElement("button"),
            oldBtn = document.querySelector(".ability-button")
        
        oldBtn.classList.toggle("hidden")
        newBtn.innerText = "Confirm"
        newBtn.dataset.username = e.target.dataset.username
        newBtn.addEventListener("click", sendAbility)
        newBtn.classList.add("remove-after-ability")
        e.target.after(newBtn)
        
        let targets = document.querySelectorAll(".die")
        targets.forEach(die =>{
            die.addEventListener("click", toggleChoice)
        })
        console.log(targets)
    } else {
        alert("You have no ability points left!")
    }
}

function toggleChoice(e){
    e.target.classList.toggle("choice")
}

function sendAbility(e) {
    console.log(e.target.dataset.username)
    let submitter = e.target.dataset.username,
        chosenDice = document.querySelectorAll(".choice")
    console.log(chosenDice)

    let chosenDiceIDs = []
    for(let i = 0; i < chosenDice.length; i++){
        chosenDiceIDs[i] = Number(chosenDice[i].id)
    }
    let useAbilityObject = {
        username: submitter,
        target: chosenDiceIDs,
    }
    socket.emit('useAbility', useAbilityObject)
    removeAbilityStuff()
}

function removeAbilityStuff(){
    document.querySelector("button.remove-after-ability").remove()
}

function refreshAttackHand(){
    let AH = document.querySelector("#attackHandContainer")

    while (AH.firstChild) {
        AH.removeChild(AH.firstChild)
    }
    fillUpAttackHand()
}

function endAttackHand() {
    let AH = document.querySelector("#attackHandContainer")

    while (AH.firstChild) {
        AH.removeChild(AH.firstChild)
    }
    document.querySelector(".attack-hand").classList.toggle("hidden")
}

function sendRoll(e){
    e.target.classList.toggle("wantsReroll")
    let rollButtons = document.querySelectorAll(".rollButton"),
        wantsRerolls = document.querySelectorAll(".wantsReroll")

    console.log(e)
    console.log(rollButtons, wantsRerolls)

    if (rollButtons.length === wantsRerolls.length){
        socket.emit('roll')
        wantsRerolls.forEach(player => {
            player.classList.remove("wantsReroll")
        })
    }
    
}

function updateRerollCount(){
    let activePlayer = gameboard.players.find(player => player.status.toLowerCase() === "active"),
    supportPlayer = gameboard.players.find(player => player.status.toLowerCase() === "support"),
    activeRerollHTML = document.querySelector("#activeRolls .roll-counter"),
    suppRerollHTML = document.querySelector("#supportRolls .roll-counter")
//console.log(activeRerollHTML, suppRerollHTML)
//For some reason it does not like me using inner text in the variable so I have to make it like this.
    activeRerollHTML.innerText = activePlayer.currentRerolls
    suppRerollHTML.innerText = supportPlayer.currentRerolls
}

//This needs to be updated with server code
function sendEndAttackPhase(){
    socket.emit('endAttack')
    document.querySelector(".attack-hand").classList.add("hidden")
}


function refreshScenario(){
    let scenarioContainer = document.querySelector("#scenarioContainer")

    while (scenarioContainer.firstChild) {
        scenarioContainer.removeChild(scenarioContainer.firstChild)
    }
    fillUpScenario()
}

function toggleRollHUDdisplay(){
    document.querySelectorAll(".roll-dash").forEach(element => {
        element.classList.toggle("hidden")
    })

}

