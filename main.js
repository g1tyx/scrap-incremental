let data = {
    // UI
    time: Date.now(),
    firstTime: true,
    AFKGains: true,
    scraps: 11,

    // GENERATORS
    generators: [],
    cost: [],
    buyAmount: 1,

    // PRESTIGE
    transistors: 0,

    // UPGRADES
    transistorsBonusUpgradeAmount: 0,
    transistorsBonus: 0.02,
    transistorsBonusUpgradeBaseCost: 1000,

    generatorsBonusUpgradeAmount: 0,
    generatorsBonus: 1,
    generatorsBonusUpgradeBaseCost: 1000,

    // STATS
    scrapsThisRun: 11,
    goalBoost: 1, 

    // GOALS
    totalScrapsLevel: 0,
    totalScraps: 11,
    totalScrapsRequirement: 1e4,

    highestTotalScrapsPerSecondLevel: 0,
    highestTotalScrapsPerSecond: 0,
    highestTotalScrapsPerSecondRequirement: 1e3,

    highestTotalGeneratorsLevel: 0, 
    highestTotalGenerators: 0,
    highestTotalGeneratorsRequirement: 300,

    totalTransistorsLevel: 0,
    totalTransistors: 0, 
    totalTransistorsRequirement: 1000
};

for (let i = 0; i < 8; i++) {
    let generator = {
        amount: 0,
        sps: 2 * Math.pow(7.84, i),
        baseCost: 11 * Math.pow(10.5, i),
    };
    data.generators.push(generator);
    let generators = data.generators[i];
    data.cost.push(generators.baseCost * Math.pow(1.07, generators.amount));
}

let scrapsPerSecond = 0;
let lastUpdate = Date.now();
let transistorsBonusUpgradeCost = 0;
let generatorsBonusUpgradeCost = 0;
let transistorsGainedFromRestart = 0;

for (let i = 0; i < 8; i++) {
    data.highestTotalGenerators = 0;
    let generators = data.generators[i];
    data.highestTotalGenerators += generators.amount;
}

const generatorsMenuContainerElement = document.getElementById("generators-container");
const prestigeMenuContainerElement = document.getElementById("prestige-container");
const upgradesMenuContainerElement = document.getElementById("upgrades-container");
const goalsMenuContainerElement = document.getElementById("goals-container");
const statsMenuContainerElement = document.getElementById("stats-container");
const settingsMenuContainerElement = document.getElementById("settings-container");

let activeMenu = generatorsMenuContainerElement;
prestigeMenuContainerElement.style.display = "none";
upgradesMenuContainerElement.style.display = "none";
goalsMenuContainerElement.style.display = "none";
statsMenuContainerElement.style.display = "none";
settingsMenuContainerElement.style.display = "none";

const generatorsMenuButtonElement = document.getElementById("generators-menu-button");
const prestigeMenuButtonElement = document.getElementById("prestige-menu-button");
const upgradesMenuButtonElement = document.getElementById("upgrades-menu-button");
const goalsMenuButtonElement = document.getElementById("goals-menu-button");
const statsMenuButtonElement = document.getElementById("stats-menu-button");
const settingsMenuButtonElement = document.getElementById("settings-menu-button");

let activeMenuButton = generatorsMenuButtonElement;
generatorsMenuButtonElement.style.borderColor = 'Orange';
prestigeMenuButtonElement.style.borderColor = 'White';
upgradesMenuButtonElement.style.borderColor = 'White';
goalsMenuButtonElement.style.borderColor = 'White';
statsMenuButtonElement.style.borderColor = 'White';
settingsMenuButtonElement.style.borderColor = 'White';

// UI
//#region 

const scrapsTextElement = document.getElementById("scraps-text");
const scrapsPerSecondTextElement = document.getElementById("scraps-per-second-text");

function format(amount) {
    let power = Math.floor(Math.log10(amount));
    let mantissa = amount/Math.pow(10, power);
    if (power < 6) return formatWithCommas(amount, 2);
    else return mantissa.toFixed(2) + "e" + power;
}

function formatWithCommas(amount, numFloatingDigits) {
    return amount.toFixed(numFloatingDigits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function openMenu(clickedMenu, clickedMenuButton) {
    activeMenu.style.display = "none";
    activeMenuButton.style.borderColor = 'White';
    activeMenu = clickedMenu;
    activeMenuButton = clickedMenuButton;
    clickedMenuButton.style.borderColor = 'Orange';
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
        let generators = data.generators[i];
        let amountBoost = ((Math.floor(generators.amount / 25) * 0.25) + 1);
        let transistorsBoost = 1 + (data.transistors * data.transistorsBonus);
        scrapsPerSecond += generators.amount * generators.sps * data.generatorsBonus * amountBoost * transistorsBoost * data.goalBoost;
    }
    if (scrapsPerSecond >= data.highestTotalScrapsPerSecond) data.highestTotalScrapsPerSecond = scrapsPerSecond;
}

function scrapsProductionLoop(deltaTime) {
    data.scraps += scrapsPerSecond * deltaTime;
    data.totalScraps +=  scrapsPerSecond * deltaTime;
    data.scrapsThisRun +=  scrapsPerSecond * deltaTime;
    transistorsGainedFromRestart = Math.floor(150 * Math.sqrt(data.scrapsThisRun/(400000000000/9)));
}

function calculateAFKGains() {
    if (data.firstTime) {
        data.firstTime = false;
        return;
    }

    if (!data.AFKGains) return;

    const now = Date.now();
    let delta = (now - data.time) / 1000;
    let scrapsToGain = 0;
    scrapsToGain += scrapsPerSecond * delta;

    let days =  Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = delta % 60;

    data.scraps += scrapsToGain;
    data.totalScraps += scrapsToGain;
    data.scrapsThisRun += scrapsToGain;

    alert("Welcome back! \nYou were gone for " 
    + formatWithCommas(days, 0) + " days, " + formatWithCommas(hours, 0) + " hours, " + formatWithCommas(minutes, 0) + " minutes, and " + formatWithCommas(seconds, 0) + " seconds.\n" 
    + "You gained " + format(scrapsToGain) + " Scraps.");
}

function mainLoop() {
    const now = Date.now();
    const deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;
    scrapsProductionLoop(deltaTime);
    updateScrapsInfo();
    updateGeneratorButtonColor();
    updateTransistorInfo();
    updateGoalsInfo();
    updateStatsInfo();
}

window.onload = function() {
    loadData();
    updateScrapsPerSecond();
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    changeBuyAmount(data.buyAmount);
    calculateAFKGains();
    updateAFKGainsButtonInfo();
}

setInterval(mainLoop, 50);
setInterval(autoSaveData, 15000); // saves every 15s
//#endregion

// GENERATORS
//#region

const buyOneButtonElement = document.getElementById("buy-one-button");
const buyTwentyFiveButtonElement = document.getElementById("buy-twentyfive-button");
const buyHundredButtonElement = document.getElementById("buy-hundred-button");

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
        let generators = data.generators[i];
        let amountBoost = ((Math.floor(generators.amount / 25) * 0.25) + 1);
        let transistorsBoost = 1 + (data.transistors * data.transistorsBonus);
        document.getElementById("gen" + (i + 1) + "-amount").innerHTML = generators.amount;
        document.getElementById("gen" + (i + 1) + "-sps").innerHTML = format(generators.sps * data.generatorsBonus * amountBoost * transistorsBoost);
        document.getElementById("gen" + (i + 1) + "-amount-bonus").innerHTML = format(amountBoost);
        document.getElementById("gen" + (i + 1) + "-cost").innerHTML = format(data.cost[i]);
    }
}

function updateGeneratorCost() {
    for (let i = 0; i < 8; i++) {
        let generators = data.generators[i];
        data.cost[i] = generators.baseCost * Math.pow(1.15, generators.amount);
    }
}

function calculateHighestGeneratorAmounts() {
    let totalGeneratorAmount = 0;
    for (let i = 0; i < 8; i++) {
        let generators = data.generators[i];
        totalGeneratorAmount += generators.amount;
    }
    if (data.highestTotalGenerators <= totalGeneratorAmount) data.highestTotalGenerators = totalGeneratorAmount;
}

function buyGenerator(generatorIndex) {
    let generators = data.generators[generatorIndex - 1];
    for (let i = 0; i < data.buyAmount; i++) {
        let c = data.cost[generatorIndex - 1];
        if (data.scraps < c) return;
        data.scraps -= c;
        generators.amount++;
        calculateHighestGeneratorAmounts();
        updateScrapsInfo();
        updateScrapsPerSecond();
        updateGeneratorCost();
        updateGeneratorInfo();
    }
}

function changeBuyAmount(amount) {
    data.buyAmount = amount;

    switch(amount) {
        case 1:
            buyOneButtonElement.style.color = '#FBBF77';
            buyTwentyFiveButtonElement.style.color = 'White';
            buyHundredButtonElement.style.color = 'White';
            break;
        case 25:
            buyOneButtonElement.style.color = 'White';
            buyTwentyFiveButtonElement.style.color = '#FBBF77';
            buyHundredButtonElement.style.color = 'White';
            break;
        case 100:
            buyOneButtonElement.style.color = 'White';
            buyTwentyFiveButtonElement.style.color = 'White';
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
    bonusPerTransistorElement.innerHTML = formatWithCommas((data.transistorsBonus * 100), 0);
    bonusFromCurrentTransistorsElement.innerHTML = formatWithCommas(data.transistors * (data.transistorsBonus * 100), 0);

    gainedFromRestartElement.innerHTML = formatWithCommas(transistorsGainedFromRestart, 0);
    bonusFromTransistorsAfterPrestigeElement.innerHTML = formatWithCommas((transistorsGainedFromRestart + data.transistors) * (data.transistorsBonus * 100), 0);

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
    if (!confirm("Are you sure you want to prestige?")) return;

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
        let generators = data.generators[i];
        data.cost.push(generators.baseCost * Math.pow(1.15, generators.amount));
    }

    data.scrapsThisRun = 11;
    data.transistors += transistorsGainedFromRestart;
    data.totalTransistors += transistorsGainedFromRestart;
    transistorsGainedFromRestart = 0;

    updateScrapsPerSecond();
    updateGeneratorCost();
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
}
//#endregion

// UPGRADES
//#region 
const transistorsBonusUpgradeAmountElement =  document.getElementById("transistors-bonus-upgrade-amount");
const transistorsBonusUpgradeCostElement =  document.getElementById("transistors-bonus-upgrade-cost");
const generatorsBonusUpgradeAmountElement =  document.getElementById("generators-bonus-upgrade-amount");
const generatorsBonusUpgradeCostElement =  document.getElementById("generators-bonus-upgrade-cost");

const transistorsBonusButtonElement = document.getElementById("transistors-bonus-button");
const generatorsBonusButtonElement = document.getElementById("generators-bonus-button");

function updateUpgradeCost() {
    transistorsBonusUpgradeCost = data.transistorsBonusUpgradeBaseCost * Math.pow(8.5, data.transistorsBonusUpgradeAmount);
    generatorsBonusUpgradeCost = data.generatorsBonusUpgradeBaseCost * Math.pow(8.5, data.generatorsBonusUpgradeAmount);
}

function updateUpgradeInfo() {
    transistorsBonusUpgradeAmountElement.innerHTML = data.transistorsBonusUpgradeAmount;
    transistorsBonusUpgradeCostElement.innerHTML = formatWithCommas(transistorsBonusUpgradeCost, 0);

    generatorsBonusUpgradeAmountElement.innerHTML = data.generatorsBonusUpgradeAmount;
    generatorsBonusUpgradeCostElement.innerHTML = formatWithCommas(generatorsBonusUpgradeCost, 0);    

    if (data.transistors < transistorsBonusUpgradeCost) {
        transistorsBonusButtonElement.style.borderColor = 'Red';
        transistorsBonusButtonElement.style.cursor = "not-allowed";
    } else {
        transistorsBonusButtonElement.style.borderColor = 'Green';
        transistorsBonusButtonElement.style.cursor = "pointer";
    }

    if (data.transistors < generatorsBonusUpgradeCost) {
        generatorsBonusButtonElement.style.borderColor = 'Red';
        generatorsBonusButtonElement.style.cursor = "not-allowed";
    } else {
        generatorsBonusButtonElement.style.borderColor = 'Green';
        generatorsBonusButtonElement.style.cursor = "pointer";
    }
}

function buyTransistorsBonusUpgrade() {
    if (data.transistors < transistorsBonusUpgradeCost) return;

    data.transistors -= transistorsBonusUpgradeCost;
    data.transistorsBonusUpgradeAmount++;
    data.transistorsBonus += 0.02;
    transistorsBonusUpgradeCost = data.transistorsBonusUpgradeBaseCost * Math.pow(5, data.transistorsBonusUpgradeAmount);
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
}

function buyGeneratorsBonusUpgrade() {
    if (data.transistors < generatorsBonusUpgradeCost) return;

    data.transistors -= generatorsBonusUpgradeCost;
    data.generatorsBonusUpgradeAmount++;
    data.generatorsBonus += 0.50;
    generatorsBonusUpgradeCost = data.generatorsBonusUpgradeBaseCost * Math.pow(5, data.generatorsBonusUpgradeAmount);
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
}
//#endregion

// GOALS
//#region 
const totalScrapsLevelElement = document.getElementById("total-scraps-level");
const totalScrapsProgressElement = document.getElementById("total-scraps-progress");

const highestTotalScrapsPerSecondLevelElement = document.getElementById("highest-total-scrapsPerSecond-level");
const highestTotalScrapsPerSecondProgressElement = document.getElementById("highest-total-scrapsPerSecond-progress");

const highestTotalGeneratorsLevelElement = document.getElementById("highest-total-generators-level");
const highestTotalGeneratorsProgressElement = document.getElementById("highest-total-generators-progress");

const totalTransistorsLevelElement = document.getElementById("total-transistors-level");
const totalTransistorsProgressElement = document.getElementById("total-transistors-progress");

function updateGoalsInfo() {
    totalScrapsLevelElement.innerHTML = data.totalScrapsLevel;
    if (data.totalScrapsLevel == 5) totalScrapsProgressElement.innerHTML = "[MAXED]";
    else totalScrapsProgressElement.innerHTML = format(data.totalScraps) + "/" + format(data.totalScrapsRequirement);

    highestTotalScrapsPerSecondLevelElement.innerHTML = data.highestTotalScrapsPerSecondLevel;
    if (data.highestTotalScrapsPerSecondLevel == 5) highestTotalScrapsPerSecondProgressElement.innerHTML = "[MAXED]";
    else highestTotalScrapsPerSecondProgressElement.innerHTML = format(data.highestTotalScrapsPerSecond) + "/" + format(data.highestTotalScrapsPerSecondRequirement);

    highestTotalGeneratorsLevelElement.innerHTML = data.highestTotalGeneratorsLevel;
    if (data.highestTotalGeneratorsLevel == 5) highestTotalGeneratorsProgressElement.innerHTML = "[MAXED]";
    else highestTotalGeneratorsProgressElement.innerHTML = formatWithCommas(data.highestTotalGenerators, 0) + "/" + formatWithCommas(data.highestTotalGeneratorsRequirement, 0);

    totalTransistorsLevelElement.innerHTML = data.totalTransistorsLevel;
    if (data.totalTransistorsLevel == 5) totalTransistorsProgressElement.innerHTML = "[MAXED]";
    else totalTransistorsProgressElement.innerHTML = formatWithCommas(data.totalTransistors, 0) + "/" + formatWithCommas(data.totalTransistorsRequirement, 0);

    if (data.totalScraps >= data.totalScrapsRequirement && data.totalScrapsLevel <= 4) {
        data.totalScrapsLevel++;
        data.goalBoost += 0.25;
        data.totalScrapsRequirement *= 1e4;
    }

    if (data.highestTotalScrapsPerSecond >= data.highestTotalScrapsPerSecondRequirement && data.highestTotalScrapsPerSecondLevel <= 4) {
        data.highestTotalScrapsPerSecondLevel++;
        data.goalBoost += 0.25;
        data.highestTotalScrapsPerSecondRequirement *= 1e3;
    }

    if (data.highestTotalGenerators >= data.highestTotalGeneratorsRequirement && data.highestTotalGeneratorsLevel <= 4) {
        data.highestTotalGeneratorsLevel++;
        data.goalBoost += 0.25;
        data.highestTotalGeneratorsRequirement += 300;
    }

    if (data.totalTransistors >= data.totalTransistorsRequirement && data.totalTransistorsLevel <= 4) {
        data.totalTransistorsLevel++;
        data.goalBoost += 0.25;
        data.totalTransistorsRequirement *= 10;
    }
}
//#endregion

// STATS
//#region 
const scrapsThisRunElement = document.getElementById("scraps-this-run");
const goalBoostElement = document.getElementById("goal-boost");

function updateStatsInfo() {
    scrapsThisRunElement.innerHTML = format(data.scrapsThisRun);
    goalBoostElement.innerHTML = format(data.goalBoost);
}
//#endregion

// SETTINGS
//#region 

const toggleAFKGainsButtonElement = document.getElementById("toggle-afk-gains-button");

function autoSaveData() {
    data.time = Date.now();
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
}

function saveData() {
    data.time = Date.now();
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
    alert("Game saved!");
}

function loadData() {
    let savedGame = JSON.parse(localStorage.getItem('ScrapIdleSave'));
    if (savedGame !== null) data = savedGame;
}

function resetData() {
    if (!confirm("Are you sure you want to reset your data? ALL of your progress will be lost and you will need to start over!")) return;

    // UI
    data.time = Date.now();
    data.scraps = 11;

    // GENERATORS
    data.generators = [];
    data.cost = [];
    data.buyAmount = 1;

    // PRESTIGE
    data.transistors = 0;

    // UPGRADES
    data.transistorsBonusUpgradeAmount = 0;
    data.transistorsBonus = 0.02;
    data.transistorsBonusUpgradeBaseCost = 1000;

    data.generatorsBonusUpgradeAmount = 0;
    data.generatorsBonus = 1;
    data.generatorsBonusUpgradeBaseCost = 1000;

    // STATS
    data.scrapsThisRun = 11;
    data.goalBoost = 1; 

    // GOALS
    data.totalScrapsLevel = 0;
    data.totalScraps = 11;
    data.totalScrapsRequirement = 1e4;

    data.highestTotalScrapsPerSecondLevel = 0;
    data.highestTotalScrapsPerSecond = 0;
    data.highestTotalScrapsPerSecondRequirement = 1e3;

    data.highestTotalGeneratorsLevel = 0; 
    data.highestTotalGenerators = 0;
    data.highestTotalGeneratorsRequirement = 300;

    data.totalTransistorsLevel = 0;
    data.totalTransistors = 0; 
    data.totalTransistorsRequirement = 1000;

    for (let i = 0; i < 8; i++) {
        let generator = {
            amount: 0,
            sps: 2 * Math.pow(7.84, i),
            baseCost: 11 * Math.pow(10.5, i),
        };
        data.generators.push(generator);
        let generators = data.generators[i];
        data.cost.push(generators.baseCost * Math.pow(1.15, generators.amount));
    }

    updateScrapsPerSecond();
    updateGeneratorCost();
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
}

function importData() {
    let importedData = prompt("Paste your save data here");
    if (importedData.length <= 0 || importedData === undefined) {
        alert('Error!');
        return;
    }
    data = JSON.parse((atob(importedData)));
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
    updateScrapsInfo();
    updateScrapsPerSecond();
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    updateTransistorInfo();
    updateStatsInfo();
    changeBuyAmount(data.buyAmount);
}

function exportData() {
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
    let exportedData = btoa(JSON.stringify(data));
    const exportedDataText = document.createElement("textarea");
    exportedDataText.value = exportedData;
    document.body.appendChild(exportedDataText);
    exportedDataText.select();
    exportedDataText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(exportedDataText);
    alert("Exported Data Copied to Clipboard! Copy and Paste your Save Data String to a safe place so if you lose your data you can get back to where you were!");
}

function updateAFKGainsButtonInfo() {
    if (data.AFKGains) toggleAFKGainsButtonElement.innerHTML = "AFK Gains: ON";
    else toggleAFKGainsButtonElement.innerHTML = "AFK Gains: OFF";
}

function toggleAFKGains() {
    if (data.AFKGains) {
        data.AFKGains = false;
        toggleAFKGainsButtonElement.innerHTML = "AFK Gains: OFF";
    } else {
        data.AFKGains = true;
        toggleAFKGainsButtonElement.innerHTML = "AFK Gains: ON";
    }
}
//#endregion

