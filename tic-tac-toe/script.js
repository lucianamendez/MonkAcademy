const winnerCombinations = [
  ["0", "1", "2"],
  ["3", "4", "5"],
  ["6", "7", "8"],
  ["0", "3", "6"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["0", "4", "8"],
  ["2", "4", "6"]
];

let humansTurns = 5;
let gameOver = false;

window.addEventListener("load", function() {
  initGame();
});

function initGame() {
  startNewTurn();
}

function startNewTurn() {
  const availableCells = checkCellsAvailables();
  availableCells.forEach(element => {
    element.addEventListener("click", playAsHuman);
    element.setAttribute("data-listener", true);
  });
}

function checkCellsAvailables() {
  const emptyCells = document.querySelectorAll("[data-owner='']");
  return emptyCells;
}

function machineTurn() {
  setTimeout(() => {
    humansTurns -= 1;
    checkIsWinner("human");
    if (humansTurns > 0 && !gameOver) {
      playAsMachine(checkCellsAvailables());
      checkIsWinner("machine");
    } else {
      gameOver = true;
      console.log("game over");
    }
  }, 1000);
}

function playAsHuman(event) {
  setOwner(
    event.target,
    "human",
    setBackgroundImage,
    removeClickListeners(machineTurn)
  );
}

function playAsMachine(cellsAvailables) {
  const randomCell =
    cellsAvailables[Math.floor(Math.random() * cellsAvailables.length)];
  setOwner(
    randomCell,
    "machine",
    setBackgroundImage,
    finishCycle(startNewTurn)
  );
}

function finishCycle(callback) {
  setTimeout(() => {
    if (humansTurns > 0 && !gameOver) {
      callback();
    } else {
      gameOver = true;
      console.log("Game over");
    }
  }, 600);
}

function setOwner(element, player, backgroundCallback, finishTurnCallback) {
  element.setAttribute("data-owner", player);
  backgroundCallback(element, player);
  finishTurnCallback;
}

function setBackgroundImage(element, player) {
  if (player === "human") {
    element.style.backgroundImage = "url('circle.svg')";
  } else {
    element.style.backgroundImage = "url('cross.svg')";
  }
}

function removeClickListeners(machineTurnCallback) {
  const listeningCells = document.querySelectorAll("[data-listener='true']");
  listeningCells.forEach(element => {
    element.setAttribute("data-listener", false);
    element.removeEventListener("click", playAsHuman, false);
  });
  machineTurnCallback();
}

function getDataSet(item, index) {
  const data = item.dataset.cell;
  return data;
}

function checkIsWinner(player) {
  const values = [];

  if (player === "human") {
    document.querySelectorAll("[data-owner='human']").forEach(element => {
      values.push(element.dataset.cell);
    });
  } else {
    document.querySelectorAll("[data-owner='machine']").forEach(element => {
      values.push(element.dataset.cell);
    });
  }

  winnerCombinations.forEach(combination => {
    let match = 0;
    values.sort().forEach((number, index) => {
      if (combination.sort()[index] === number) {
        match++;
      }
      if (match === 3) {
        console.log(">>>WINNER:", player);
        gameOver = true;
      }
    });
  });
}
