let scrapsPerSecond = 0;
let lastUpdate = Date.now();

const scrapsTextElement = document.getElementById("scraps-text");
const scrapsPerSecondTextElement = document.getElementById("scraps-per-second-text");

function updateScrapsInfo() {
    scrapsTextElement.innerHTML = format(data.scraps);
    scrapsPerSecondTextElement.innerHTML = format(scrapsPerSecond);
}

function updateScrapsPerSecond() {
    scrapsPerSecond = 0;
    for (let i = 0; i < 8; i++) {
        let robots = data.robots[i];
        let amountBoost = ((Math.floor(robots.amount / 25) * 0.25) + 1);
        let transistorsBoost = 1 + (data.transistors * data.transistorsBonus);
        scrapsPerSecond += robots.amount * robots.sps * data.robotsBonus * amountBoost * transistorsBoost * data.goalBoost;
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
    updateRobotButtonStatus();
    updateTransistorInfo();
    updateGoalsInfo();
    updateStatsInfo();
}

function load() {
    loadData();
    updateScrapsPerSecond();
    updateRobotInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    revealRobots();
    calculateAFKGains();
    updateAFKGainsButtonInfo();
    revealUpgradeMenu();
    changeBuyAmount(data.buyAmount);
}

window.onload = function() {
    load();
}

setInterval(mainLoop, 50);
setInterval(autoSaveData, 15000); // saves every 15s