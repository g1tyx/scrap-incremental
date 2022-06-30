const scrapsThisRunElement = document.getElementById("scraps-this-run");
const goalBoostElement = document.getElementById("goal-boost");

function updateStatsInfo() {
    scrapsThisRunElement.innerHTML = format(data.scrapsThisRun);
    goalBoostElement.innerHTML = format(data.goalBoost);
}