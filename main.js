let board = [
    ["","",""],
    ["","",""],
    ["","",""]
];

let turn = 0; //0=user, 1=pc
let jugaste = false;

const boardContainer = document.querySelector("#board");
const playerDiv = document.querySelector("#player");

const contadorPG = document.querySelector(".contador-p-g");
const contadorPP = document.querySelector(".contador-p-p");
const contadorPE = document.querySelector(".contador-p-e");

let pos1 = 0;
let pos2 = 0;
let pos3 = 0;

let partidasGanadas = 0;
let partidasPerdidas = 0;
let partidasEmpatadas = 0;

contadorPG.textContent = partidasGanadas;
contadorPP.textContent = partidasPerdidas;
contadorPE.textContent = partidasEmpatadas;

const btnReset = document.querySelector(".btn-reset");

btnReset.addEventListener("click", e => {

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = "";
        }
    };

    startGame();
});

startGame();

function startGame(){
    btnReset.textContent = "Reiniciar";
    renderBoard();
    turn = Math.random() <= 0.5 ? 0 : 1;

    renderCurrentPlayer();

    if(turn==0){
        playerPlays();
    }else{
        pcPlays();
    }
}

function playerPlays(){
    jugaste = false;
    const cells = document.querySelectorAll(".cell");//ya declaro una constante cells antes mmmm

    cells.forEach((cell, i) => {
        //con esto puedo sacar la posicion de mi celda
        const column = i % 3;
        const row = parseInt(i/3);

        if(board[row][column]==""){
            cell.addEventListener("click", e => {
                if (!jugaste) {
                    board[row][column] = "O";
                    cell.innerHTML = "<img src='/rec.png'/>";
                    //cell.textContent = board[row][column];
                    jugaste=true;
                    turn=1;
                    const won = checkIfWinner();

                    if(won == "none"){
                        pcPlays();
                        return;
                    }
                    if(won == "draw"){
                        renderDraw();
                        //elimino la misma funcion en la que estoy actualmente
                        cell.removeEventListener("click", this);
                        return;
                    }
                }  
            });
        }
    });
}

function pcPlays() {
    let played = false;
    renderCurrentPlayer();

    setTimeout(() => {
        if (!played){
            const options = checkIfCanWin();
        
            if(options.length > 0){
                const bestOption = options[0];
                
                for (let i = 0; i < bestOption.length; i++) {
                    
                    if (bestOption[i].value == 0) {
                        const posi = bestOption[i].i;
                        const posj = bestOption[i].j;
                        board[posi][posj]="X";
                        played = true;
                        break;
                    }
                    
                }
            }else{
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j] == "" && !played) {
                            board[i][j] = "X";
                            played = true;
                        }
                    }
                    
                }
            }
            renderBoard();

            const won = checkIfWinner();
            if(won == "none"){
                turn = 0;
                jugaste = false;
                renderCurrentPlayer();
                playerPlays();
            }
            if(won == "draw"){
                renderDraw();
            }
        }
  
    },1500);
    
}

function renderDraw(){
    playerDiv.textContent = "Empate";
    btnReset.textContent = "Jugar de nuevo";
    partidasEmpatadas+=1;
    contadorPE.textContent = partidasEmpatadas;
}

function checkIfCanWin(){
    //copia profunda con arreglos bidimensionales 
    const arr = JSON.parse(JSON.stringify(board));//[...board] si fuera un array de una sola dimension este sirve

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if(arr[i][j] == "X"){
                /*cambio el valor para que sea un objeto de valor 1 y guardo la posicion */
                arr[i][j] = {value: 1, i , j};
            }
            if(arr[i][j] == ""){
                arr[i][j] = {value: 0, i , j};
            }
            if(arr[i][j] == "O"){
                arr[i][j] = {value: -2, i , j};
            }
        } 
    }

    //ahora hay que hacer la relacion de todas las casillas, voy a asignar a cada variable la posicion de mis casillas
    const p1 = arr[0][0];//
    const p2 = arr[0][1];
    const p3 = arr[0][2];
    const p4 = arr[1][0];
    const p5 = arr[1][1];//
    const p6 = arr[1][2];
    const p7 = arr[2][0];//
    const p8 = arr[2][1];
    const p9 = arr[2][2];

    //ahora hacer todas las posibles soluciones para ganar
    //asi que si la suma de las conbinaciones da 2 puede ganar dandole a la casilla vacio
    //si da -4 tiene que poner en la otra casilla vacia para no perder
    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1,s2,s3,s4,s5,s6,s7,s8].filter(line =>{
        return (
            line[0].value + line[1].value + line[2].value == 2 ||
            line[0].value + line[1].value + line[2].value == -4
            );
    });

    return res;
}

function checkIfWinner() {
    const p1 = board[0][0];
    const p2 = board[0][1];
    const p3 = board[0][2];
    const p4 = board[1][0];
    const p5 = board[1][1];
    const p6 = board[1][2];
    const p7 = board[2][0];
    const p8 = board[2][1];
    const p9 = board[2][2];
    
    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1,s2,s3,s4,s5,s6,s7,s8].filter(line =>{
        return (
            line[0] + line[1] + line[2] == "XXX" ||
            line[0] + line[1] + line[2] == "OOO"
            );
    });

    

    if (res.length > 0) {//hay un ganador
        btnReset.textContent = "Jugar de nuevo";
        switch (res[0]) {
            case s1:
                pos1 = 1;
                pos2 = 2;
                pos3 = 3;
                break;
            case s2:
                pos1 = 4;
                pos2 = 5;
                pos3 = 6;
                break;
            case s3:
                pos1 = 7;
                pos2 = 8;
                pos3 = 9;
                break;
            case s4:
                pos1 = 1;
                pos2 = 4;
                pos3 = 7;
                break;
            case s5:
                pos1 = 2;
                pos2 = 5;
                pos3 = 8;
                break;
            case s6:
                pos1 = 3;
                pos2 = 6;
                pos3 = 9;
                break;
            case s7:
                pos1 = 1;
                pos2 = 5;
                pos3 = 9;
                break;
            case s8:
                pos1 = 3;
                pos2 = 5;
                pos3 = 7;
                break;
            default:
                break;
        }

        const cells = document.querySelectorAll(".cell");

        cells[pos1-1].classList.add("ganador", "p1");
        cells[pos2-1].classList.add("ganador", "p2");
        cells[pos3-1].classList.add("ganador", "p3");

        if(res[0][0] == "X"){
            playerDiv.textContent = "Ganó la PC!!";
            partidasPerdidas+=1;
            contadorPP.textContent = partidasPerdidas;
            return "PCWon";
        }else{
            playerDiv.textContent = "Ganaste!!";
            partidasGanadas+=1;
            contadorPG.textContent = partidasGanadas;
            return "UserWon";
        }
    }else{
        let draw = true;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] == "") {
                    draw = false;
                }
            }
        }
        return draw ? "draw" : "none";
    }
}

function renderCurrentPlayer(){
    playerDiv.textContent = `${turn == 0 ? "Tu turno" : "Turno de la PC"}`;
}

function renderBoard(){
    const html = board.map(row =>{
        const cells = row.map(cell =>{
            let cellContent="";
            if(cell == "X"){
                cellContent = "<img src='/close.png'/>";
            }else if(cell == "O"){
                cellContent = "<img src='/rec.png'/>";
            }
            return `<button class="cell">${cellContent}</button>`
        });
        return `<div class="row">${cells.join("")}</div>`
    });

    boardContainer.innerHTML = html.join("");
}

//bastante simple, deberia agregar cosas como reiniciarlo si se termina osea un boton para poder empezar
//puedo agregarle un contador de ganadas y perdidas con eso
//mejorar los estilos
//combinacion para ganarle 00, 11, 10, 20
//no puedo hacer que el boton de reiniciar funcione, solo reinicia la primera vez, despues no hace nada