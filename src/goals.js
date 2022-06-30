const goalNames = ["Total Scraps", "Highest Total Scraps/s", "Highest Total Robots", "Total Transistors"];

const goal1LevelElement = document.getElementById("goal1-level");
const goal1ProgressElement = document.getElementById("goal1-progress");

const goal2LevelElement = document.getElementById("goal2-level");
const goal2ProgressElement = document.getElementById("goal2-progress");

const goal3LevelElement = document.getElementById("goal3-level");
const goal3ProgressElement = document.getElementById("goal3-progress");

const goal4LevelElement = document.getElementById("goal4-level");
const goal4ProgressElement = document.getElementById("goal4-progress");

for (let i = 0; i < goalNames.length; i++) {
    document.getElementById("goal" + (i + 1) + "-name").innerHTML = goalNames[i];
}

for (let i = 0; i < 8; i++) {
    data.highestTotalRobots = 0;
    let robots = data.robots[i];
    data.highestTotalRobots += robots.amount;
}

function updateGoalsInfo() {
    goal1LevelElement.innerHTML = data.totalScrapsLevel;
    if (data.totalScrapsLevel == 5) goal1ProgressElement.innerHTML = "[MAXED]";
    else goal1ProgressElement.innerHTML = format(data.totalScraps) + "/" + format(data.totalScrapsRequirement);

    goal2LevelElement.innerHTML = data.highestTotalScrapsPerSecondLevel;
    if (data.highestTotalScrapsPerSecondLevel == 5) goal2ProgressElement.innerHTML = "[MAXED]";
    else goal2ProgressElement.innerHTML = format(data.highestTotalScrapsPerSecond) + "/" + format(data.highestTotalScrapsPerSecondRequirement);

    goal3LevelElement.innerHTML = data.highestTotalRobotsLevel;
    if (data.highestTotalRobotsLevel == 5) goal3ProgressElement.innerHTML = "[MAXED]";
    else goal3ProgressElement.innerHTML = formatWithCommas(data.highestTotalRobots, 0) + "/" + formatWithCommas(data.highestTotalRobotsRequirement, 0);

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

    if (data.highestTotalRobots >= data.highestTotalRobotsRequirement && data.highestTotalRobotsLevel <= 4) {
        data.highestTotalRobotsLevel++;
        data.goalBoost += 0.25;
        data.highestTotalRobotsRequirement += 300;
    }

    if (data.totalTransistors >= data.totalTransistorsRequirement && data.totalTransistorsLevel <= 4) {
        data.totalTransistorsLevel++;
        data.goalBoost += 0.25;
        data.totalTransistorsRequirement *= 10;
    }
}