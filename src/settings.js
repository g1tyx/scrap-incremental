const toggleAFKGainsButtonElement = document.getElementById("toggle-afk-gains-button");
const saveName = 'ScrapIdleSave';

function saveData() {
    data.time = Date.now();
    window.localStorage.setItem(saveName, JSON.stringify(data));
    alert("Game saved!");
}

function loadData() {
    let savedGame = JSON.parse(localStorage.getItem(saveName));
    if (savedGame !== null) data = savedGame;
}

function resetData() {
    if (!confirm("Are you sure you want to reset your data? ALL of your progress will be lost and you will need to start over!")) return;

    // UI
    data.time = Date.now();
    data.scraps = 11;

    // GENERATORS
    data.robots = [];
    data.cost = [];
    data.buyAmount = 1;

    // PRESTIGE
    data.transistors = 0;
    data.prestigeCounter = 0;

    // UPGRADES
    data.transistorsBonusUpgradeAmount = 0;
    data.transistorsBonus = 0.02;
    data.transistorsBonusUpgradeBaseCost = 1000;

    data.robotsBonusUpgradeAmount = 0;
    data.robotsBonus = 1;
    data.robotsBonusUpgradeBaseCost = 1000;

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

    data.highestTotalRobotsLevel = 0; 
    data.highestTotalRobots = 0;
    data.highestTotalRobotsRequirement = 300;

    data.totalTransistorsLevel = 0;
    data.totalTransistors = 0; 
    data.totalTransistorsRequirement = 100;

    for (let i = 0; i < 8; i++) {
        let robot = {
            amount: 0,
            sps: 2 * Math.pow(7.84, i),
            baseCost: 11 * Math.pow(10.5, i),
        };
        data.robots.push(robot);
        let robots = data.robots[i];
        data.cost.push(robots.baseCost * Math.pow(1.15, robots.amount));
    }

    data.time = Date.now();
    window.localStorage.setItem(saveName, JSON.stringify(data));

    loadData();
    updateScrapsPerSecond();
    updateRobotInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    revealRobots();
    updateAFKGainsButtonInfo();
    revealUpgradeMenu();
    changeBuyAmount(data.buyAmount);
}

function importData() {
    let importedData = prompt("Paste your save data here");
    if (importedData.length <= 0 || importedData === undefined) {
        alert('Error!');
        return;
    }
    data = JSON.parse((atob(importedData)));
    window.localStorage.setItem(saveName, JSON.stringify(data));
    loadData();
    updateScrapsPerSecond();
    updateRobotInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    revealRobots();
    updateAFKGainsButtonInfo();
    revealUpgradeMenu();
    changeBuyAmount(data.buyAmount);
}

function exportData() {
    window.localStorage.setItem(saveName, JSON.stringify(data));
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