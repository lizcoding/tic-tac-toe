'use strict';

/* ---TO-DO: Make display responsive--- */

const Player = function(name, value) {
    this.name = name;
    this.value = value;
    this.winnerStatus = false;
    this.turnStatus = false;
    
    this.toggleTurn = () => this.turnStatus = !this.turnStatus;
    this.declareWinner = () => this.winnerStatus = true;
    this.reset = () => {
        this.winnerStatus = false;
        this.turnStatus = false;
    }
};

const board = (() => {
    let choices = [];
    choices.length = 9;
    choices.fill('_');
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const getChoices = () => {
        return choices;
    };
    const makeMove = (value, index) => {
        if (!choices[index]) {
            choices[index] = value;
            return value;
        } else {
            return false;
        }
    };
    const disable = () => {
        choices = [];
        choices.length = 9;
        choices.fill('_');
    };
    const enable = () => {
        choices = [];
        choices.length = 9;
    }
    const checkForWinner = (playerValue) => {
        for (let condition of winningConditions) {
            if (choices[condition[0]] === playerValue && choices[condition[1]] === playerValue && choices[condition[2]] === playerValue) {
                return true;
            }
        }
        return false;
    };
    const checkForTie = () => {
        for (let item of choices) {
            if (!item) {
                return false;
            }
        } 
        return true;
    };
    return {getChoices, makeMove, checkForWinner, checkForTie, disable, enable};
})();

const display = (() => {
    const message = document.getElementById('message');
    const welcome = "Enter your names and press 'Start' to play!";
    const playerTurn = ", it's your turn!";
    const tie = "The game has tied! Press restart to play again.";
    const winner = ", you won! Press restart to play again.";
    const welcomeMessage = () => {
        message.textContent = welcome;
    }
    const playerMessage = () => {
        if (player1.turnStatus === true) {
            message.textContent = player1.name + playerTurn;
        } else {
            message.textContent = player2.name + playerTurn;
        }
    }
    const winnerMessage = (name) => {
        message.textContent = name + winner;
    }
    const tieMessage = () => {
        message.textContent = tie;
    }
    const updateBoard = (move, index) => {
        const square = document.getElementById(index);
        if (move === player1.value) {
            square.style.backgroundColor = 'lightpink';
            square.textContent = player1.value;
        } else {
            square.style.backgroundColor = '#b3fdb3'; // light green
            square.textContent = player2.value;
        }
    }
    const reset = () => {
        const boardDivs = document.getElementsByClassName('square');
        for (let square of boardDivs) {
            square.textContent = '';
            square.style.backgroundColor = '';
        }
        message.textContent = welcome;
    }
    return {welcomeMessage, playerMessage, winnerMessage, tieMessage, updateBoard, reset};
})();

function addListeners() {
    const squares = document.getElementsByClassName('square');
    const startButton = document.getElementById('start');
    const restartButton = document.getElementById('restart');
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    for (let square of squares) {
        square.addEventListener('click', function(){
            const index = square.id;
            playerSelection(index);
        });
    }
}

function startGame() {
    const startButton = document.getElementById('start');
    const restartButton = document.getElementById('restart');
    startButton.disabled = true;
    restartButton.disabled = false;

    const input1 = document.getElementById('player1');
    const input2 = document.getElementById('player2');
    player1.name = input1.value;
    player2.name = input2.value;
    input1.disabled = true;
    input2.disabled = true;

    player1.toggleTurn();
    display.playerMessage();
    board.enable();
}

function restartGame() {
    display.reset();
    player1.reset();
    player2.reset();
    board.disable();
    
    const startButton = document.getElementById('start');
    const restartButton = document.getElementById('restart');
    startButton.disabled = false;
    restartButton.disabled = true;

    const input1 = document.getElementById('player1');
    const input2 = document.getElementById('player2');
    input1.disabled = false;
    input2.disabled = false;
    
    input1.value = 'Player 1';
    input2.value = 'Player 2';
    player1.name = input1.value;
    player2.name = input2.value;
}

function playerSelection(index) {
    if (player1.turnStatus === true) {
        const move = board.makeMove(player1.value, index);
        if (move != false) {
            display.updateBoard(move, index);
            if (board.checkForWinner(player1.value) === true) {
                player1.declareWinner();
                display.winnerMessage(player1.name);
                board.disable();
            } else if (board.checkForTie() === true) {
                display.tieMessage();
            } else {
                player1.toggleTurn();
                player2.toggleTurn();
                display.playerMessage();
            }
        }
    } else {
        const move = board.makeMove(player2.value, index);
        if (move != false) {
            display.updateBoard(move, index);
            if (board.checkForWinner(player2.value) === true) {
                player2.declareWinner();
                display.winnerMessage(player2.name);
                board.disable();
            } else if (board.checkForTie() === true) {
                display.tieMessage();
            } else {
                player2.toggleTurn();
                player1.toggleTurn();
                display.playerMessage();
            }
        }
    }
}

// Code Start
const player1 = new Player('player1', 'X');
const player2 = new Player('player2', 'O');
addListeners();
