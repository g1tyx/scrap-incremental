// let scraps = 11;
// let totalScraps = 11;
// let scrapsThisRun = 0;
// let generators = [];
// let cost = [];
// let transistors = 0;
// let transistorsBonus = 1.02;

let data = {
    scraps: 11,
    totalScraps: 11,
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

let scrapsPerSecond = 0;
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

const scrapsTextElement = document.getElementById("scraps-text");
const scrapsPerSecondTextElement = document.getElementById("scraps-per-second-text");
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

function updateScrapsInfo() {
    scrapsTextElement.textContent = "You have " + format(data.scraps) + " Scraps";
    scrapsPerSecondTextElement.textContent = "You are making " + format(scrapsPerSecond) + " Scraps/s";
}

function updateScrapsPerSecond() {
    scrapsPerSecond = 0;
    for (let i = 0; i < 8; i++) {
        let g = data.generators[i];
        scrapsPerSecond += g.amount * g.sps;
    }
    scrapsPerSecond *= (data.transistors * data.transistorsBonus);
}

= 2 * 104 * 1.02

function scrapsProductionLoop(deltaTime) {
    data.scraps += scrapsPerSecond * deltaTime;
    data.scrapsThisRun +=  scrapsPerSecond;
    data.totalScraps +=  scrapsPerSecond;
    transistorsGainedFromRestart = Math.floor(150 * Math.sqrt(data.scrapsThisRun/(400000000000/9)));
}

function mainLoop() {
    const now = Date.now();
    const deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;
    updateScrapsInfo();
    scrapsProductionLoop(deltaTime);
    updateGeneratorButtonColor();
    updateTransistorInfo();
}

window.onload = function() {
    loadData();
    updateScrapsPerSecond();
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
        if (data.scraps < data.cost[i]) {
            document.getElementById("gen" + (i + 1) + "-button").style.borderColor = 'Red';
            document.getElementById("gen" + (i + 1) + "-button").style.cursor = "not-allowed";
        } else {
            document.getElementById("gen" + (i + 1) + "-button").style.borderColor = 'Green';
            document.getElementById("gen" + (i + 1) + "-button").style.cursor = "pointer";
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
        if (data.scraps < c) return;
        data.scraps -= c;
        g.amount++;
        updateScrapsPerSecond();
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
const bonusFromCurrentTransistorsElement = document.getElementById("bonus-from-current-transistors");

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
        prestigeButtonElement.style.cursor = "pointer";
    }
}

function doPrestige() {
    if (transistorsGainedFromRestart < 1) return;

    data.scraps = 11;
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

    updateScrapsPerSecond();
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
    data.scraps = 11;
    data.totalScraps = 11;
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

    updateScrapsPerSecond();
    updateGeneratorCost();
    updateGeneratorInfo();
}
//#endregion

