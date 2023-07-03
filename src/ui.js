const robotsMenuContainerElement = document.getElementById("robots-container");
const prestigeMenuContainerElement = document.getElementById("prestige-container");
const upgradesMenuContainerElement = document.getElementById("upgrades-container");
const goalsMenuContainerElement = document.getElementById("goals-container");
const statsMenuContainerElement = document.getElementById("stats-container");
const settingsMenuContainerElement = document.getElementById("settings-container");

let activeMenu = robotsMenuContainerElement;
prestigeMenuContainerElement.style.display = "none";
upgradesMenuContainerElement.style.display = "none";
goalsMenuContainerElement.style.display = "none";
statsMenuContainerElement.style.display = "none";
settingsMenuContainerElement.style.display = "none";

const robotsMenuButtonElement = document.getElementById("robots-menu-button");
const prestigeMenuButtonElement = document.getElementById("prestige-menu-button");
const upgradesMenuButtonElement = document.getElementById("upgrades-menu-button");
const goalsMenuButtonElement = document.getElementById("goals-menu-button");
const statsMenuButtonElement = document.getElementById("stats-menu-button");
const settingsMenuButtonElement = document.getElementById("settings-menu-button");

let activeMenuButton = robotsMenuButtonElement;
robotsMenuButtonElement.style.borderColor = 'Orange';
prestigeMenuButtonElement.style.borderColor = 'Black';
upgradesMenuButtonElement.style.borderColor = 'Black';
goalsMenuButtonElement.style.borderColor = 'Black';
statsMenuButtonElement.style.borderColor = 'Black';
settingsMenuButtonElement.style.borderColor = 'Black';

function revealUpgradeMenu() {
    if (data.prestigeCounter === 0) {
        upgradesMenuButtonElement.style.display = "none";
    } else {
        upgradesMenuButtonElement.style.display = "block";
    }
}

function revealRobots() {
    for (let i = 1; i < 8; i++) {
        let robots = data.robots[i - 1];
        if (robots.amount > 0) {
            document.getElementById("robot" + (i + 1) + "-row").style.display = "table-row";
        } else {
            document.getElementById("robot" + (i + 1) + "-row").style.display = "none";
        }
    }
}

function openMenu(clickedMenu, clickedMenuButton) {
    activeMenu.style.display = "none";
    activeMenuButton.style.borderColor = 'Black';
    activeMenu = clickedMenu;
    activeMenuButton = clickedMenuButton;
    activeMenuButton.style.borderColor = 'Orange';
    activeMenu.style.display = "block";
}