const robotNames = ["Type-A", "Type-B", "Type-C", "Type-D", "Type-E", "Type-F", "Type-G", "Type-H"];

for (let i = 0; i < 8; i++) {
    let robot = {
        amount: 0,
        sps: 2 * Math.pow(7.84, i),
        baseCost: 11 * Math.pow(10.5, i),
    };
    data.robots.push(robot);
    let robots = data.robots[i];
    data.cost.push(robots.baseCost * Math.pow(1.07, robots.amount));
}

const buyOneButtonElement = document.getElementById("buy-one-button");
const buyTwentyFiveButtonElement = document.getElementById("buy-twentyfive-button");
const buyHundredButtonElement = document.getElementById("buy-hundred-button");
const buyMaxButtonElement = document.getElementById("buy-max-button");

function updateRobotButtonStatus() {
    for (let i = 0; i < 8; i++) {
        if (data.scraps < data.cost[i]) {
            document.getElementById("robot" + (i + 1) + "-button").style.borderColor = '#b33939';
            document.getElementById("robot" + (i + 1) + "-button").style.cursor = "not-allowed";
            document.getElementById("robot" + (i + 1) + "-button").disabled = true;
        } else {
            document.getElementById("robot" + (i + 1) + "-button").style.borderColor = 'Green';
            document.getElementById("robot" + (i + 1) + "-button").style.cursor = "pointer";
            document.getElementById("robot" + (i + 1) + "-button").disabled = false;
        }
    }
}

function updateRobotInfo() {
    for (let i = 0; i < 8; i++) {
        let robots = data.robots[i];
        let amountBoost = ((Math.floor(robots.amount / 25) * 0.25) + 1);
        let transistorsBoost = 1 + (data.transistors * data.transistorsBonus);
        document.getElementById("robot" + (i + 1) + "-name").innerHTML = `Robot ${robotNames[i]}`;
        document.getElementById("robot" + (i + 1) + "-amount").innerHTML = robots.amount;
        document.getElementById("robot" + (i + 1) + "-sps").innerHTML = format(robots.sps * data.robotsBonus * amountBoost * transistorsBoost);
        document.getElementById("robot" + (i + 1) + "-amount-bonus").innerHTML = format(amountBoost);
        document.getElementById("robot" + (i + 1) + "-cost").innerHTML = format(data.cost[i]);
    }
}

function updateRobotCost() {
    for (let i = 0; i < 8; i++) {
        let robots = data.robots[i];
        data.cost[i] = robots.baseCost * Math.pow(1.15, robots.amount);
    }
}

function calculateHighestRobotAmounts() {
    let totalRobotAmount = 0;
    for (let i = 0; i < 8; i++) {
        let robots = data.robots[i];
        totalRobotAmount += robots.amount;
    }
    if (data.highestTotalRobots <= totalRobotAmount) data.highestTotalRobots = totalRobotAmount;
}

function buyRobot(robotIndex) {
    let robots = data.robots[robotIndex - 1];
    for (let i = 0; i < data.buyAmount; i++) {
        let cost = data.cost[robotIndex - 1];
        if (data.scraps < cost) {
            if (data.buyAmount === Infinity) {
                updateBuyAmount(1);
                return;
            } else {
                updateBuyAmount(data.buyAmount);
            }
            break;
        }
        data.scraps -= cost;
        if (data.buyAmount === Infinity) {
            robots.amount++;
            updateBuyAmount(1);
            calculateHighestRobotAmounts();
            updateScrapsInfo();
            updateScrapsPerSecond();
            revealRobots();
            updateRobotInfo();
        } else {
            robots.amount++;
            updateBuyAmount(data.buyAmount);
        }
    }
    calculateHighestRobotAmounts();
    updateScrapsInfo();
    updateScrapsPerSecond();
    revealRobots();
    updateRobotInfo();
}

function nextPrice(baseCost, amount) {
    return baseCost * Math.pow(1.15, amount);
}

function updateBuyAmount(amount) {
    for (let i = 0; i < 8; i++) {
        let robots = data.robots[i];
        data.cost[i] = 0;

        for (let j = 0; j < amount; j++) {
            data.cost[i] += nextPrice(robots.baseCost, robots.amount + j);
        }

    }
    updateRobotInfo();
}

function changeBuyAmount(amount) {
    data.buyAmount = amount;

    switch(amount) {
        case 1:
            buyOneButtonElement.style.borderColor = 'Orange';
            buyTwentyFiveButtonElement.style.borderColor = 'Black';
            buyHundredButtonElement.style.borderColor = 'Black';
            buyMaxButtonElement.style.borderColor = 'Black';
            updateBuyAmount(amount);
            break;
        case 25:
            buyOneButtonElement.style.borderColor = 'Black';
            buyTwentyFiveButtonElement.style.borderColor = 'Orange';
            buyHundredButtonElement.style.borderColor = 'Black';
            buyMaxButtonElement.style.borderColor = 'Black';
            updateBuyAmount(amount);
            break;
        case 100:
            buyOneButtonElement.style.borderColor = 'Black';
            buyTwentyFiveButtonElement.style.borderColor = 'Black';
            buyHundredButtonElement.style.borderColor = 'Orange';
            buyMaxButtonElement.style.borderColor = 'Black';
            updateBuyAmount(amount);
            break;
        case Infinity:
            buyOneButtonElement.style.borderColor = 'Black';
            buyTwentyFiveButtonElement.style.borderColor = 'Black';
            buyHundredButtonElement.style.borderColor = 'Black';
            buyMaxButtonElement.style.borderColor = 'Orange';
            updateBuyAmount(1);
            break;
    }

    console.log(amount)
}