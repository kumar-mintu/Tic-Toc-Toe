const cells = document.querySelectorAll(".cell");
const boardDiv = document.querySelector(".board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const clickSound = new Audio("./click.mp3");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let winLine = null;

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", cellClick);
});

restartBtn.addEventListener("click", restartGame);

function cellClick(e){

    const index = e.target.getAttribute("data-index");

    if(board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if(currentPlayer === "X"){
        e.target.classList.add("x");
    }else{
        e.target.classList.add("o");
    }

    clickSound.currentTime = 0;
    clickSound.play().catch(()=>{});

    checkResult();
}

function checkResult(){

    for(let pattern of winPatterns){

        const [a,b,c] = pattern;

        if(
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ){
            // ✅ top message
            statusText.textContent = "🎉 Congratulations! You win";

            gameActive = false;
            drawWinLine(pattern);
            return;
        }
    }

    if(!board.includes("")){
        statusText.textContent = "Match Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function drawWinLine(pattern){

    const firstCell = cells[pattern[0]];
    const lastCell  = cells[pattern[2]];

    const boardRect = boardDiv.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect  = lastCell.getBoundingClientRect();

    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top  + firstRect.height / 2 - boardRect.top;

    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top  + lastRect.height / 2 - boardRect.top;

    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    winLine = document.createElement("div");

    winLine.style.position = "absolute";
    winLine.style.left = x1 + "px";
    winLine.style.top  = y1 + "px";
    winLine.style.width = length + "px";
    winLine.style.height = "6px";

    // ✅ line ka new color (changed)
    winLine.style.background = "#facc15";   // golden yellow
    winLine.style.boxShadow = "0 0 12px #facc15";

    winLine.style.borderRadius = "5px";
    winLine.style.transformOrigin = "0 50%";
    winLine.style.transform = `rotate(${angle}deg)`;

    boardDiv.style.position = "relative";
    boardDiv.appendChild(winLine);
}

function restartGame(){

    board = ["","","","","","","","",""];
    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = "Player X's turn";

    cells.forEach(cell=>{
        cell.textContent = "";
        cell.classList.remove("x");
        cell.classList.remove("o");
    });

    if(winLine){
        winLine.remove();
        winLine = null;
    }
}
