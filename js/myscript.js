function handleclick() {
    var px = document.getElementById("player_x").value;
    var po = document.getElementById("player_o").value;
    px = px.toUpperCase();
    po = po.toUpperCase();
    localStorage.setItem('player-x', px);
    localStorage.setItem('player-o', po);
    if (po != '' && px != '') {
        var url = "game.html";
        window.location = url;
    }
    else {
        alert("Please Hover on the avatar to enter player's name");
    }
}

function popup(hideOrshow) {
    if (hideOrshow == 'hide') { document.getElementById('pop-wrapper').style.display = "none"; }
}

function restart() {
    popup('hide');
    window.location = "index.html";
}

if (window.location.href.match('game.html') != null) {
    var starter = localStorage.getItem('player-x');
    console.log("starter-->", starter);
    function PopUp(hideOrshow) {
        if (hideOrshow == 'hide') { document.getElementById('ac-wrapper').style.display = "none"; }
        else {
            document.getElementById('starter').innerHTML = starter;
            document.getElementById('ac-wrapper').removeAttribute('style');
        }

    }

    window.onload = function () {
        setTimeout(function () { PopUp("show"); }, 200);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    var playerx = localStorage.getItem('player-x');
    var playero = localStorage.getItem('player-o');
    console.log("player x-->", playerx);
    console.log("player o-->", playero);
    localStorage.clear();
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let result = '';

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';


    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

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

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes(''))
            announce(TIE);
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                result = playero;
                break;
            case PLAYERX_WON:
                result = playerx;
                break;
            case TIE:
                result = "Tie";
        }
        setTimeout(function () { popup("show"); }, 200);
    };

    function popup(hideOrshow) {
        if (hideOrshow == 'hide') { document.getElementById('pop-wrapper').style.display = "none"; }
        else {
            if (result != 'Tie') {
                result = result + " \nwon the game🎉!"
            }
            else {
                result = "Game Tied!"
            }
            announcer.innerText = result;
            console.log("game result-->", result);
            document.getElementById('pop-wrapper').removeAttribute('style');
        }
    }


    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }

        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
})