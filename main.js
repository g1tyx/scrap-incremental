let data = {
    scraps: 11,
    totalScraps: 11,
    scrapsThisRun: 11,
    generators: [],
    cost: [],
    buyAmount: 1,
    transistors: 0,
    totalTransistors: 0, 
    transistorsBonus: 0.02,
    transistorsBonusUpgradeAmount: 0,
    transistorsBonusUpgradeBaseCost: 1000,
    generatorsBonusUpgradeAmount: 0,
    generatorsBonus: 1,
    generatorsBonusUpgradeBaseCost: 1000
};

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
let lastUpdate = Date.now();
let transistorsBonusUpgradeCost = 0;
let generatorsBonusUpgradeCost = 0;

const generatorsMenuContainerElement = document.getElementById("generators-container");
const prestigeMenuContainerElement = document.getElementById("prestige-container");
const settingsMenuContainerElement = document.getElementById("settings-container");
const upgradesMenuContainerElement = document.getElementById("upgrades-container");
const statsMenuContainerElement = document.getElementById("stats-container");

let activeMenu = generatorsMenuContainerElement;
prestigeMenuContainerElement.style.display = "none";
settingsMenuContainerElement.style.display = "none";
upgradesMenuContainerElement.style.display = "none";
statsMenuContainerElement.style.display = "none";

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
        scrapsPerSecond += g.amount * g.sps * data.generatorsBonus;
    }
    scrapsPerSecond *= 1 + (data.transistors * data.transistorsBonus);
}

function scrapsProductionLoop(deltaTime) {
    data.scraps += scrapsPerSecond * deltaTime;
    data.totalScraps +=  scrapsPerSecond * deltaTime;
    data.scrapsThisRun +=  scrapsPerSecond * deltaTime;
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
    updateStatsInfo();
}

window.onload = function() {
    loadData();
    updateScrapsPerSecond();
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    changeBuyAmount(data.buyAmount);
}

setInterval(mainLoop, 50);
setInterval(autoSaveData, 15000); // saves every 15s
//#endregion

// GENERATORS
//#region

const buyOneButtonElement = document.getElementById("buy-one-button");
const buyTenButtonElement = document.getElementById("buy-ten-button");
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
        let g = data.generators[i];
        document.getElementById("gen" + (i + 1) + "-amount").innerHTML = g.amount;
        document.getElementById("gen" + (i + 1) + "-sps").innerHTML = format(g.sps * data.generatorsBonus);
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
    for (let i = 0; i < data.buyAmount; i++) {
        if (data.scraps < c) return;
        data.scraps -= c;
        g.amount++;
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
        let g = data.generators[i];
        data.cost.push(g.baseCost * Math.pow(1.15, g.amount));
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
    transistorsBonusUpgradeCostElement.innerHTML = format(transistorsBonusUpgradeCost);

    generatorsBonusUpgradeAmountElement.innerHTML = data.generatorsBonusUpgradeAmount;
    generatorsBonusUpgradeCostElement.innerHTML = format(generatorsBonusUpgradeCost);    

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
    transistorsBonusUpgradeCost = data.transistorsBonusUpgradeBaseCost * Math.pow(8.5, data.transistorsBonusUpgradeAmount);
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
}

function buyGeneratorsBonusUpgrade() {
    if (data.transistors < generatorsBonusUpgradeCost) return;

    data.transistors -= generatorsBonusUpgradeCost;
    data.generatorsBonusUpgradeAmount++;
    data.generatorsBonus += 0.25;
    generatorsBonusUpgradeCost = data.generatorsBonusUpgradeBaseCost * Math.pow(8.5, data.generatorsBonusUpgradeAmount);
    updateGeneratorInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
}
//#endregion

// STATS
//#region 
const totalScrapsElement = document.getElementById("total-scraps");
const scrapsThisRunElement = document.getElementById("scraps-this-run");
const totalTransistorsElement = document.getElementById("total-transistors");

function updateStatsInfo() {
    totalScrapsElement.innerHTML = format(data.totalScraps);
    scrapsThisRunElement.innerHTML = format(data.scrapsThisRun);
    totalTransistorsElement.innerHTML = formatWithCommas(data.totalTransistors, 0);
}
//#endregion

// SETTINGS
//#region 

function autoSaveData() {
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
}

function saveData() {
    window.localStorage.setItem('ScrapIdleSave', JSON.stringify(data));
    alert("Game saved!");
}

function loadData() {
    let savedGame = JSON.parse(localStorage.getItem('ScrapIdleSave'));
    if (savedGame !== null) data = savedGame;
}

function resetData() {
    if (!confirm("Are you sure you want to reset your data? ALL of your progress will be lost and you will need to start over!")) return;

    data.scraps = 11;
    data.totalScraps = 11;
    data.scrapsThisRun = 11;
    data.generators = [];
    data.cost = [];
    data.buyAmount = 1;
    data.transistors = 0;
    data.totalTransistors = 0;
    data.transistorsBonus = 0.02;
    data.transistorsBonusUpgradeAmount = 0,
    data.transistorsBonusUpgradeBaseCost = 1000,
    data.generatorsBonus = 1;
    data.generatorsBonusUpgradeAmount = 0; 
    data.generatorsBonusUpgradeBaseCost = 1000;

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
    updateScrapsPerSecond();
    updateGeneratorCost();
    updateGeneratorInfo();
    updateUpgradeInfo();
    updateUpgradeCost();
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
//#endregion