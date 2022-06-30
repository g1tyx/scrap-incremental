let transistorsBonusUpgradeCost = 0;
let robotsBonusUpgradeCost = 0;

const upgradeNames = ["Stronger Transistors", "Efficient Robots"];

const upgrade1AmountElement =  document.getElementById("upgrade1-amount");
const upgrade1CostElement =  document.getElementById("upgrade1-cost");
const upgrade2AmountElement =  document.getElementById("upgrade2-amount");
const upgrade2CostElement =  document.getElementById("upgrade2-cost");

const upgrade1ButtonElement = document.getElementById("upgrade1-button");
const upgrade2ButtonElement = document.getElementById("upgrade2-button");

for (let i = 0; i < upgradeNames.length; i++) {
    document.getElementById("upgrade" + (i + 1) + "-name").innerHTML = `${upgradeNames[i]}`;
}

function updateUpgradeCost() {
    transistorsBonusUpgradeCost = data.transistorsBonusUpgradeBaseCost * Math.pow(8.5, data.transistorsBonusUpgradeAmount);
    robotsBonusUpgradeCost = data.robotsBonusUpgradeBaseCost * Math.pow(8.5, data.robotsBonusUpgradeAmount);
}

function updateUpgradeInfo() {
    upgrade1AmountElement.innerHTML = data.transistorsBonusUpgradeAmount;
    upgrade1CostElement.innerHTML = formatWithCommas(transistorsBonusUpgradeCost, 0);

    upgrade2AmountElement.innerHTML = data.robotsBonusUpgradeAmount;
    upgrade2CostElement.innerHTML = formatWithCommas(robotsBonusUpgradeCost, 0);    

    if (data.transistors < transistorsBonusUpgradeCost) {
        upgrade1ButtonElement.style.borderColor = '#b33939';
        upgrade1ButtonElement.style.cursor = "not-allowed";
        upgrade1ButtonElement.disabled = true;
    } else {
        upgrade1ButtonElement.style.borderColor = 'Green';
        upgrade1ButtonElement.style.cursor = "pointer";
        upgrade1ButtonElement.disabled = false;
    }

    if (data.transistors < robotsBonusUpgradeCost) {
        upgrade2ButtonElement.style.borderColor = '#b33939';
        upgrade2ButtonElement.style.cursor = "not-allowed";
        upgrade2ButtonElement.disabled = true;
    } else {
        upgrade2ButtonElement.style.borderColor = 'Green';
        upgrade2ButtonElement.style.cursor = "pointer";
        upgrade2ButtonElement.disabled = false;
    }
}

function buyTransistorsBonusUpgrade() {
    if (data.transistors < transistorsBonusUpgradeCost) return;

    data.transistors -= transistorsBonusUpgradeCost;
    data.transistorsBonusUpgradeAmount++;
    data.transistorsBonus += 0.02;
    transistorsBonusUpgradeCost = data.transistorsBonusUpgradeBaseCost * Math.pow(5, data.transistorsBonusUpgradeAmount);
    updateRobotInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    updateScrapsPerSecond();
}

function buyRobotsBonusUpgrade() {
    if (data.transistors < robotsBonusUpgradeCost) return;

    data.transistors -= robotsBonusUpgradeCost;
    data.robotsBonusUpgradeAmount++;
    data.robotsBonus += 0.50;
    robotsBonusUpgradeCost = data.robotsBonusUpgradeBaseCost * Math.pow(5, data.robotsBonusUpgradeAmount);
    updateRobotInfo();
    updateUpgradeCost();
    updateUpgradeInfo();
    updateScrapsPerSecond();
}