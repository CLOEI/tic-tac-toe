const gameCells = document.querySelectorAll('.game-cell');
const gameLog = document.querySelector('.game-logs')
const resetButton = document.querySelector('.game-reset')
const nameInput = document.querySelector('#name');

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const player = {
    x : 'Player',
    o : 'AI',
   currentIsPlayer : true
}

const resetBoard = () => {
    for(let element of gameCells){
        element.classList.remove('player', 'enemy');
        element.removeEventListener('click', clickHandler);
        element.addEventListener('click', clickHandler, {once: true});
    }
    console.clear();
    gameLog.innerHTML = '';
    player.currentIsPlayer = true;
}

const clickHandler = (e) => {
    if(player.currentIsPlayer){
        e.target.classList.add('player');
    }else e.target.classList.add('enemy');


    const gameData = checkCondition(gameCells);
    if(gameData.win || gameData.draw){
        displayLog(e, `${gameData.win ? 'win' : 'draw'}`);
        for(let element of gameCells){
            element.removeEventListener('click', clickHandler);
        }
    }else{
        displayLog(e);
        player.currentIsPlayer = !player.currentIsPlayer
        if(!player.currentIsPlayer){
            enemyMove();
        }
    }
}

const checkCondition = (board) => {
    const win = winningCombination.some((combination) => {
        return combination.every((val) => {
            return board[val].classList.contains(player.currentIsPlayer ? 'player' : 'enemy');
        })
    })
    const draw = Array.from(board).every((elem) => {
        return elem.classList.contains('player') || elem.classList.contains('enemy');
    })
    return {
        winningPlayer : player.currentIsPlayer ? player.x : player.o,
        win,
        draw
    }
}

const displayLog = (e, status) => {
    if(status == undefined){
        gameLog.innerHTML = `<br><b>${player.currentIsPlayer ? player.x : player.o}</b> clicked index ${e.target.dataset.index}` + gameLog.innerHTML;
    }else if(status == 'win'){
        gameLog.innerHTML = `<br><b>${player.currentIsPlayer ? player.x : player.o}</b> Win!` + gameLog.innerHTML;
    }else {
        gameLog.innerHTML = `<br><b>its a Draw!</b>` + gameLog.innerHTML;
    }
}

const enemyMove = () => {
    //pure random.
    /* while(!player.currentIsPlayer && !checkCondition().draw){
        const ranNumber = Math.floor(Math.random() * 9);
        if(!gameCells[ranNumber].classList.contains('player') && !gameCells[ranNumber].classList.contains('enemy')){
            gameCells[ranNumber].classList.add('enemy');
            gameCells[ranNumber].click(); // thanks stackoverflow! i never knew click exist hahaha
            player.currentIsPlayer = true;
        }
    } */
   
    let bestScore = -Infinity;
    let index;
    for(let cell of gameCells){
        if(!cell.classList.contains('player') && !cell.classList.contains('enemy')){
            cell.classList.add('enemy');
            let score = minimax(gameCells, 0, false);
            console.log(score, cell.dataset.index);
            cell.classList.remove('enemy');
            if(bestScore < score){
                bestScore = score;
                index = cell.dataset.index;
            }
        }
    }
    console.log(bestScore, index, 'best');
    player.currentIsPlayer = false;
    gameCells[index].click();

}

const emptyColumn = (board) => {
    return Array.from(board).filter((val) => {
        return !val.classList.contains('player') && !val.classList.contains('enemy');
    })
}

/*
    source: wikipedia minimax
    cara kerjanya botnya bakal lawan dirinya sendiri dan dptin score yang paling tinggi
    depth enggak aku set dikarenakan tic-tac-toe game yang simple gak bakalan ngehabisin call stack.
    Note untuk diriku dimasa depan : aku tau ko engak 100% paham dengan algoritma ini tapi cobalah belajar setiap hari!
*/

const minimax = (node, depth, maximizingPlayer) => {
    // terminal state
    const gameData = checkCondition(node);
    const emptyCell = emptyColumn(node);
    if(gameData.win && gameData.winningPlayer == player.x){
        return -1 * (emptyCell.length + 1);
    }else if(gameData.win && gameData.winningPlayer == player.o){
        return 1 * (emptyCell.length + 1);
    }else if(gameData.draw){
        return 0;
    }
    player.currentIsPlayer = !player.currentIsPlayer
    if(maximizingPlayer){
        let bestScore = -Infinity;
        for(let cell of node){
            if(!cell.classList.contains('player') && !cell.classList.contains('enemy')){
                cell.classList.add('enemy');
                bestScore = Math.max(bestScore, minimax(node, depth + 1, false));
                cell.classList.remove('enemy');
            }
        }
        player.currentIsPlayer = true;
        return bestScore;
    }else{
        let bestScore = Infinity;
        for(let cell of node){
            if(!cell.classList.contains('player') && !cell.classList.contains('enemy')){
                cell.classList.add('player');
                bestScore = Math.min(bestScore, minimax(node, depth + 1, true));
                cell.classList.remove('player');
            }
        }
        player.currentIsPlayer = false;
        return bestScore;
    }

}

const gameStart = () => {
    for(let x = 0; x < gameCells.length; x++){
        gameCells[x].addEventListener('click', clickHandler, {once: true});
        gameCells[x].dataset.index = x;
    }
}

nameInput.addEventListener('input', (e) => {
    player.x = e.target.value ? e.target.value : 'Player';
})
resetButton.addEventListener('click', resetBoard);


gameStart();