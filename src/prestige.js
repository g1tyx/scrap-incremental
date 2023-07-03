let transistorsGainedFromRestart = 0;

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
        prestigeButtonElement.disabled = true;
    } else {
        prestigeButtonElement.style.borderColor = 'Green';
        prestigeButtonElement.style.cursor = "pointer";
        prestigeButtonElement.disabled = false;
    }
}

function doPrestige() {
    if (transistorsGainedFromRestart < 1) return;
    if (!confirm("Are you sure you want to prestige?")) return;

    data.scraps = 11;
    data.robots = [];
    data.cost = [];

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

    data.prestigeCounter++;
    data.scrapsThisRun = 11;
    data.transistors += transistorsGainedFromRestart;
    data.totalTransistors += transistorsGainedFromRestart;
    transistorsGainedFromRestart = 0;

    updateScrapsPerSecond();
    updateRobotCost();
    updateRobotInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    revealRobots();
    revealUpgradeMenu();
    changeBuyAmount(data.buyAmount);
}