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
    totalTransistorsRequirement: 100
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

const robotNames = ["Type-A", "Type-B", "Type-C", "Type-D", "Type-E", "Type-F", "Type-G", "Type-H"];
const upgradeNames = ["Stronger Transistors", "Efficient Robots"];
const goalNames = ["Total Scraps", "Highest Total Scraps/s", "Highest Total Generators", "Total Transistors"];

function revealGenerators() {
    for (let i = 1; i < 8; i++) {
        let generators = data.generators[i - 1];
        if (generators.amount > 0) {
            document.getElementById("gen" + (i + 1) + "-row").style.display = "table-row";
        } else {
            document.getElementById("gen" + (i + 1) + "-row").style.display = "none";
        }
    }
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
prestigeMenuButtonElement.style.borderColor = 'Black';
upgradesMenuButtonElement.style.borderColor = 'Black';
goalsMenuButtonElement.style.borderColor = 'Black';
statsMenuButtonElement.style.borderColor = 'Black';
settingsMenuButtonElement.style.borderColor = 'Black';

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
    activeMenuButton.style.borderColor = 'Black';
    activeMenu = clickedMenu;
    activeMenuButton = clickedMenuButton;
    activeMenuButton.style.borderColor = 'Orange';
    activeMenu.style.display = "block";
}

function updateScrapsInfo() {
    scrapsTextElement.textContent = format(data.scraps);
    scrapsPerSecondTextElement.textContent = format(scrapsPerSecond);
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
    updateGeneratorButtonStatus();
    updateTransistorInfo();
    updateGoalsInfo();
    updateStatsInfo();
}

function load() {
    loadData();
    updateScrapsPerSecond();
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    revealGenerators();
    calculateAFKGains();
    updateAFKGainsButtonInfo();
    changeBuyAmount(data.buyAmount);
}

window.onload = function() {
    load();
}

setInterval(mainLoop, 50);
setInterval(autoSaveData, 15000); // saves every 15s
//#endregion

// GENERATORS
//#region

const buyOneButtonElement = document.getElementById("buy-one-button");
const buyTwentyFiveButtonElement = document.getElementById("buy-twentyfive-button");
const buyHundredButtonElement = document.getElementById("buy-hundred-button");
const buyMaxButtonElement = document.getElementById("buy-max-button");

function updateGeneratorButtonStatus() {
    for (let i = 0; i < 8; i++) {
        if (data.scraps < data.cost[i]) {
            document.getElementById("gen" + (i + 1) + "-button").style.borderColor = '#b33939';
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
        document.getElementById("gen" + (i + 1) + "-name").textContent = `Robot ${robotNames[i]}`;
        document.getElementById("gen" + (i + 1) + "-amount").textContent = generators.amount;
        document.getElementById("gen" + (i + 1) + "-sps").textContent = format(generators.sps * data.generatorsBonus * amountBoost * transistorsBoost);
        document.getElementById("gen" + (i + 1) + "-amount-bonus").textContent = format(amountBoost);
        document.getElementById("gen" + (i + 1) + "-cost").textContent = format(data.cost[i]);
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
        let cost = data.cost[generatorIndex - 1];
        if (data.scraps < cost) break;
        data.scraps -= cost;
        generators.amount += data.buyAmount;
        calculateHighestGeneratorAmounts();
        updateScrapsInfo();
        updateScrapsPerSecond();
        updateGeneratorCost();
        updateGeneratorInfo();
        revealGenerators();
    }
}

function nextPrice(baseCost, amount) {
    return baseCost * Math.pow(1.15, amount);
}

function updateBuyAmount(amount) {
    for (let i = 0; i < 8; i++) {
        let generators = data.generators[i];
        data.cost[i] = 0;

        for (let j = 0; j < amount; j++) {
            data.cost[i] += nextPrice(generators.baseCost, generators.amount + j);
        }

    }
    console.log(data.cost);

    updateGeneratorInfo();
}

function changeBuyAmount(amount) {
    data.buyAmount = amount;

    switch(data.buyAmount) {
        case 1:
            buyOneButtonElement.style.borderColor = 'Orange';
            buyTwentyFiveButtonElement.style.borderColor = 'Black';
            buyHundredButtonElement.style.borderColor = 'Black';
            buyMaxButtonElement.style.borderColor = 'Black';
            updateBuyAmount(data.buyAmount);
            break;
        case 25:
            buyOneButtonElement.style.borderColor = 'Black';
            buyTwentyFiveButtonElement.style.borderColor = 'Orange';
            buyHundredButtonElement.style.borderColor = 'Black';
            buyMaxButtonElement.style.borderColor = 'Black';
            updateBuyAmount(data.buyAmount);
            break;
        case 100:
            buyOneButtonElement.style.borderColor = 'Black';
            buyTwentyFiveButtonElement.style.borderColor = 'Black';
            buyHundredButtonElement.style.borderColor = 'Orange';
            buyMaxButtonElement.style.borderColor = 'Black';
            updateBuyAmount(data.buyAmount);
            break;
        case Infinity:
            buyOneButtonElement.style.borderColor = 'Black';
            buyTwentyFiveButtonElement.style.borderColor = 'Black';
            buyHundredButtonElement.style.borderColor = 'Black';
            buyMaxButtonElement.style.borderColor = 'Orange';
            updateBuyAmount(1);
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
        prestigeButtonElement.style.borderColor = '#b33939';
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
    revealGenerators();
    changeBuyAmount(data.buyAmount);
}
//#endregion

// UPGRADES
//#region 
const upgrade1AmountElement =  document.getElementById("upgrade1-amount");
const upgrade1CostElement =  document.getElementById("upgrade1-cost");
const upgrade2AmountElement =  document.getElementById("upgrade2-amount");
const upgrade2CostElement =  document.getElementById("upgrade2-cost");

const upgrade1ButtonElement = document.getElementById("upgrade1-button");
const upgrade2ButtonElement = document.getElementById("upgrade2-button");

for (let i = 0; i < upgradeNames.length; i++) {
    document.getElementById("upgrade" + (i + 1) + "-name").textContent = `${upgradeNames[i]}`;
}

function updateUpgradeCost() {
    transistorsBonusUpgradeCost = data.transistorsBonusUpgradeBaseCost * Math.pow(8.5, data.transistorsBonusUpgradeAmount);
    generatorsBonusUpgradeCost = data.generatorsBonusUpgradeBaseCost * Math.pow(8.5, data.generatorsBonusUpgradeAmount);
}

function updateUpgradeInfo() {
    upgrade1AmountElement.innerHTML = data.transistorsBonusUpgradeAmount;
    upgrade1CostElement.innerHTML = formatWithCommas(transistorsBonusUpgradeCost, 0);

    upgrade2AmountElement.innerHTML = data.generatorsBonusUpgradeAmount;
    upgrade2CostElement.innerHTML = formatWithCommas(generatorsBonusUpgradeCost, 0);    

    if (data.transistors < transistorsBonusUpgradeCost) {
        upgrade1ButtonElement.style.borderColor = '#b33939';
        upgrade1ButtonElement.style.cursor = "not-allowed";
    } else {
        upgrade1ButtonElement.style.borderColor = 'Green';
        upgrade1ButtonElement.style.cursor = "pointer";
    }

    if (data.transistors < generatorsBonusUpgradeCost) {
        upgrade2ButtonElement.style.borderColor = '#b33939';
        upgrade2ButtonElement.style.cursor = "not-allowed";
    } else {
        upgrade2ButtonElement.style.borderColor = 'Green';
        upgrade2ButtonElement.style.cursor = "pointer";
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
const goal1LevelElement = document.getElementById("goal1-level");
const goal1ProgressElement = document.getElementById("goal1-progress");

const goal2LevelElement = document.getElementById("goal2-level");
const goal2ProgressElement = document.getElementById("goal2-progress");

const goal3LevelElement = document.getElementById("goal3-level");
const goal3ProgressElement = document.getElementById("goal3-progress");

const goal4LevelElement = document.getElementById("goal4-level");
const goal4ProgressElement = document.getElementById("goal4-progress");

for (let i = 0; i < goalNames.length; i++) {
    document.getElementById("goal" + (i + 1) + "-name").textContent = goalNames[i];
}

function updateGoalsInfo() {
    goal1LevelElement.innerHTML = data.totalScrapsLevel;
    if (data.totalScrapsLevel == 5) goal1ProgressElement.innerHTML = "[MAXED]";
    else goal1ProgressElement.innerHTML = format(data.totalScraps) + "/" + format(data.totalScrapsRequirement);

    goal2LevelElement.innerHTML = data.highestTotalScrapsPerSecondLevel;
    if (data.highestTotalScrapsPerSecondLevel == 5) goal2ProgressElement.innerHTML = "[MAXED]";
    else goal2ProgressElement.innerHTML = format(data.highestTotalScrapsPerSecond) + "/" + format(data.highestTotalScrapsPerSecondRequirement);

    goal3LevelElement.innerHTML = data.highestTotalGeneratorsLevel;
    if (data.highestTotalGeneratorsLevel == 5) goal3ProgressElement.innerHTML = "[MAXED]";
    else goal3ProgressElement.innerHTML = formatWithCommas(data.highestTotalGenerators, 0) + "/" + formatWithCommas(data.highestTotalGeneratorsRequirement, 0);

    goal4LevelElement.innerHTML = data.totalTransistorsLevel;
    if (data.totalTransistorsLevel == 5) goal4ProgressElement.innerHTML = "[MAXED]";
    else goal4ProgressElement.innerHTML = formatWithCommas(data.totalTransistors, 0) + "/" + formatWithCommas(data.totalTransistorsRequirement, 0);

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
    data.totalTransistorsRequirement = 100;

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

    data.time = Date.now();
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));

    load();
}

function importData() {
    let importedData = prompt("Paste your save data here");
    if (importedData.length <= 0 || importedData === undefined) {
        alert('Error!');
        return;
    }
    data = JSON.parse((atob(importedData)));
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
    load();
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

