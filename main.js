// let scrap = 11;
// let totalScrap = 11;
// let scrapsThisRun = 0;
// let generators = [];
// let cost = [];
// let transistors = 0;
// let transistorsBonus = 1.02;

let data = {
    scrap: 11,
    totalScrap: 11,
    scrapsThisRun: 0,
    generators: [],
    cost: [],
    transistors: 0,
    transistorsBonus: 1.02,
}

for (let i = 0; i < 8; i++) {
    let generator = {
        amount: 0,
        sps: 2 * Math.pow(7.84, i),
        baseCost: 11 * Math.pow(10.5, i),
    };
    data.generators.push(generator);
    let g = data.generators[i];
    data.cost.push(g.baseCost * Math.pow(1.07, g.amount));
}

let scrapPerSecond = 0;
let buyAmount = 1;
let lastUpdate = Date.now();

const generatorsMenuContainerElement = document.getElementById("generators-container");
const prestigeMenuContainerElement = document.getElementById("prestige-container");
const settingsMenuContainerElement = document.getElementById("settings-container");

let activeMenu = generatorsMenuContainerElement;
prestigeMenuContainerElement.style.display = "none";
settingsMenuContainerElement.style.display = "none";

// UI
//#region 

const scrapTextElement = document.getElementById("scrap-text");
const scrapPerSecondTextElement = document.getElementById("scrap-per-second-text");
const generatorsMenuButtonElement = document.getElementById("generators-menu-button");

function format(amount) {
    let power = Math.floor(Math.log10(amount));
    let mantissa = amount/Math.pow(10, power);
    if (power < 3) return amount.toFixed(2);
    else return mantissa.toFixed(2) + "e" + power;
}

function formatWithCommas(amount, numDigits = 2) {
    return amount.toFixed(numDigits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function openMenu(clickedMenu) {
    activeMenu.style.display = "none";
    activeMenu = clickedMenu;
    if (activeMenu == generatorsMenuContainerElement) activeMenu.style.display = "flex";
    else activeMenu.style.display = "block";
}

function updateScrapInfo() {
    scrapTextElement.textContent = "You have " + format(data.scrap) + " Scrap";
    scrapPerSecondTextElement.textContent = "You are making " + format(scrapPerSecond) + " Scrap/s";
}

function updateScrapPerSecond() {
    scrapPerSecond = 0;
    for (let i = 0; i < 8; i++) {
        let g = data.generators[i];
        scrapPerSecond += g.amount * g.sps;
    }
}

function scrapProductionLoop(deltaTime) {
    let scrapsToGain = scrapPerSecond * (1 + (data.transistors * data.transistorsBonus / 100));
    data.scrap += scrapsToGain * deltaTime;
    data.scrapsThisRun +=  scrapsToGain;
    data.totalScrap +=  scrapsToGain;
    transistorsGainedFromRestart = Math.floor(150 * Math.sqrt(data.scrapsThisRun/(400000000000/9)));
}



function mainLoop() {
    const now = Date.now();
    const deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;
    updateScrapInfo();
    scrapProductionLoop(deltaTime);
    updateGeneratorButtonColor();
    updateTransistorInfo();
}

window.onload = function() {
    loadData();
    updateScrapPerSecond();
    updateGeneratorInfo();
}

setInterval(mainLoop, 50);
setInterval(autoSaveData, 15000); // saves every 15s
//#endregion

// GENERATORS
//#region

const buyOneButtonElement = document.getElementById("buy-one-button");
const buyTenButtonElement = document.getElementById("buy-ten-button");
const buyHundredButtonElement = document.getElementById("buy-hundred-button");

buyOneButtonElement.style.color = '#FBBF77';

function updateGeneratorButtonColor() {
    for (let i = 0; i < 8; i++) {
        if (data.scrap < data.cost[i]) {
            document.getElementById("gen" + (i + 1) + "-button").style.borderColor = 'Red';
            document.getElementById("gen" + (i + 1) + "-button").style.cursor = "not-allowed";
        } else {
            document.getElementById("gen" + (i + 1) + "-button").style.borderColor = 'Green';
            document.getElementById("gen" + (i + 1) + "-button").style.cursor = "default";
        }
    }
}

function updateGeneratorInfo() {
    for (let i = 0; i < 8; i++) {
        let g = data.generators[i];
        document.getElementById("gen" + (i + 1) + "-amount").innerHTML = g.amount;
        document.getElementById("gen" + (i + 1) + "-sps").innerHTML = format(g.sps);
        document.getElementById("gen" + (i + 1) + "-cost").innerHTML = format(data.cost[i]);
    }
}

function updateGeneratorCost() {
    for (let i = 0; i < 8; i++) {
        let g = data.generators[i];
        data.cost[i] = g.baseCost * Math.pow(1.15, g.amount);
    }
}

function buyGenerator(i) {
    let g = data.generators[i - 1];
    let c = data.cost[i - 1];
    for (let i = 0; i < buyAmount; i++) {
        if (data.scrap < c) return;
        data.scrap -= c;
        g.amount++;
        updateScrapPerSecond();
        updateGeneratorCost();
        updateGeneratorInfo();
    }
}

function changeBuyAmount(amount) {
    buyAmount = amount;

    switch(amount) {
        case 1:
            buyOneButtonElement.style.color = '#FBBF77';
            buyTenButtonElement.style.color = 'White';
            buyHundredButtonElement.style.color = 'White';
            break;
        case 10:
            buyOneButtonElement.style.color = 'White';
            buyTenButtonElement.style.color = '#FBBF77';
            buyHundredButtonElement.style.color = 'White';
            break;
        case 100:
            buyOneButtonElement.style.color = 'White';
            buyTenButtonElement.style.color = 'White';
            buyHundredButtonElement.style.color = '#FBBF77';
            break;
    }
}
// #endregion

// PRESTIGE
//#region 

const currentTransistorsElement = document.getElementById("current-transistors");
const bonusPerTransistorElement = document.getElementById("bonus-per-transistor");
const bonusFromCurrentTransistorsElement = document.getElementById("bonus-current-from-transistors");

const gainedFromRestartElement = document.getElementById("gained-from-restart");
const bonusFromTransistorsAfterPrestigeElement = document.getElementById("bonus-from-transistors-after-prestige");

const prestigeButtonElement = document.getElementById("prestige-button");

function updateTransistorInfo() {
    currentTransistorsElement.innerHTML = formatWithCommas(data.transistors, 0);
    bonusPerTransistorElement.innerHTML = formatWithCommas(((data.transistorsBonus - 1) * 100), 0);
    bonusFromCurrentTransistorsElement.innerHTML = formatWithCommas(data.transistors * ((data.transistorsBonus - 1) * 100), 0);

    gainedFromRestartElement.innerHTML = formatWithCommas(transistorsGainedFromRestart, 0);
    bonusFromTransistorsAfterPrestigeElement.innerHTML = formatWithCommas((transistorsGainedFromRestart + data.transistors) * ((data.transistorsBonus - 1) * 100), 0);

    if (transistorsGainedFromRestart < 1) {
        prestigeButtonElement.style.borderColor = 'Red';
        prestigeButtonElement.style.cursor = "not-allowed";
    } else {
        prestigeButtonElement.style.borderColor = 'Green';
        prestigeButtonElement.style.cursor = "default";
    }
}

function doPrestige() {
    if (transistorsGainedFromRestart < 1) return;

    data.scrap = 11;
    data.generators = [];
    data.cost = [];

    for (let i = 0; i < 8; i++) {
        let generator = {
            amount: 0,
            sps: 2 * Math.pow(7.84, i),
            baseCost: 11 * Math.pow(10.5, i),
        };
        data.generators.push(generator);
        let g = data.generators[i];
        data.cost.push(g.baseCost * Math.pow(1.15, g.amount));
    }

    data.scrapsThisRun = 0;
    data.transistors += transistorsGainedFromRestart;
    transistorsGainedFromRestart = 0;

    updateScrapPerSecond();
    updateGeneratorCost();
    updateGeneratorInfo();
}
//#endregion

// SETTINGS
//#region 

function autoSaveData() {
    window.localStorage.setItem('EnergyIdleSave', JSON.stringify(data));
}

function saveData() {
    window.localStorage.setItem('EnergyIdleSave', JSON.stringify(data));
    alert("Game saved!");
}

function loadData() {
    let savedGame = JSON.parse(localStorage.getItem('EnergyIdleSave'));
    if (savedGame !== null) data = savedGame;
}

function resetData() {
    data.scrap = 11;
    data.totalScrap = 11;
    data.scrapsThisRun = 0;
    data.generators = [];
    data.cost = [];
    data.transistors = 0;
    data.transistorsBonus = 1.02;

    for (let i = 0; i < 8; i++) {
        let generator = {
            amount: 0,
            sps: 2 * Math.pow(7.84, i),
            baseCost: 11 * Math.pow(10.5, i),
        };
        data.generators.push(generator);
        let g = data.generators[i];
        data.cost.push(g.baseCost * Math.pow(1.15, g.amount));
    }

    updateScrapPerSecond();
    updateGeneratorCost();
    updateGeneratorInfo();
}
//#endregion

