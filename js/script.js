//Get a reference to the stage
var stage = document.querySelector("#stage");

//Map code
var FOREST = 0;
var ROYAL_GUARD = 1;
var SEINE = 2;
var OPERA = 3;
var QUEEN = 4;
var THIEF = 5;


var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

// Add the decors
var map = [
    [0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 2, 0, 2, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 1, 0, 0, 0, 2, 0, 1, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0],
    [0, 1, 0, 2, 0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0]
];

// Add characters
var gameObjects = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


//The size of each cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;


//An automatic way of setting the queen's start position
var queenRow;
var queenColumn;
var thiefRow;
var thiefColumn;
var queenRoyalGard = 0;

function Thief(row, col) {
    this.row = row;
    this.column = col;
}

var thiefsArray = []


for (var row = 0; row < ROWS; row++) {
    for (var column = 0; column < COLUMNS; column++) {
        if (gameObjects[row][column] === QUEEN) {
            queenRow = row;
            queenColumn = column;
        }
        if (gameObjects[row][column] === THIEF) {
            thiefsArray.push(new Thief(row, column));
            // thiefRow = row;
            // thiefColumn = column;

        }
    }
}


render();


function keydownHandler(event) {

    switch (event.keyCode) {
        case UP:

            //Find out if the queen's move will
            //be within the playing field
            if (queenRow > 0) {
                //If it is, clear the queen's current cell
                gameObjects[queenRow][queenColumn] = 0;

                //Subract 1 from the queen's row
                //to move it up one row on the map
                queenRow--;

                //Apply the queen's new updated position to the array
                gameObjects[queenRow][queenColumn] = QUEEN;
            }
            break;

        case DOWN:
            if (queenRow < ROWS - 1) {
                gameObjects[queenRow][queenColumn] = 0;
                queenRow++;
                gameObjects[queenRow][queenColumn] = QUEEN;
            }
            break;

        case LEFT:
            if (queenColumn > 0) {
                gameObjects[queenRow][queenColumn] = 0;
                queenColumn--;
                gameObjects[queenRow][queenColumn] = QUEEN;
            }
            break;

        case RIGHT:
            if (queenColumn < COLUMNS - 1) {
                gameObjects[queenRow][queenColumn] = 0;
                queenColumn++;
                gameObjects[queenRow][queenColumn] = QUEEN;
            }
            break;
    }

    switch (map[queenRow][queenColumn]) {
        case FOREST:
            break;

        case SEINE:
            endGame();
            break;

        case ROYAL_GUARD:
            getRoyalGard();
            break;

        case OPERA:
            endGame();
            break;
    }


    for (var i = 0; i < thiefsArray.length; i++) {

        thiefsArray[i].movingTheThieves();

        //console.log(thiefsArray[i]);
    }


    // Determine the kind of the cell

    if (gameObjects[queenRow][queenColumn] === THIEF) {
        endGame();
    }

    //Render the game
    render();
}




// Move the thieves



Thief.prototype.movingTheThieves = function() {
    //The 4 possible directions that the thief can move
    var UP = 1;
    var DOWN = 2;
    var LEFT = 3;
    var RIGHT = 4;

    //An array to store the valid direction that
    //the thief is allowed to move in
    var validDirections = [];

    //The final direction that the thief will move in
    var direction = undefined;

    //Find out what kinds of things are in the cells
    //that surround the thief. If the cells contain water,
    //push the corresponding direction into the validDirections array
    if (this.row > 0) {
        var thingAbove = map[this.row - 1][this.column];
        if (thingAbove === FOREST) {
            validDirections.push(UP)
        }
    }
    if (this.row < ROWS - 1) {
        var thingBelow = map[this.row + 1][this.column];
        if (thingBelow === FOREST) {
            validDirections.push(DOWN)
        }
    }
    if (this.column > 0) {
        var thingToTheLeft = map[this.row][this.column - 1];
        if (thingToTheLeft === FOREST) {
            validDirections.push(LEFT)
        }
    }
    if (this.column < COLUMNS - 1) {
        var thingToTheRight = map[this.row][this.column + 1];
        if (thingToTheRight === FOREST) {
            validDirections.push(RIGHT)
        }
    }

    //possible directions and assign it to the direction variable
    if (validDirections.length !== 0) {
        var randomNumber = Math.floor(Math.random() * validDirections.length);
        direction = validDirections[randomNumber];
    }

    //Move the thief in the chosen direction
    switch (direction) {
        case UP:
            //Clear the thief's current cell
            gameObjects[this.row][this.column] = 0;
            //Subtract 1 from the thief's row
            ///this.row--;
            this.row--;
            //Apply the thief's new updated position to the array
            gameObjects[this.row][this.column] = THIEF;
            break;

        case DOWN:
            gameObjects[this.row][this.column] = 0;
            this.row++;
            gameObjects[this.row][this.column] = THIEF;
            break;

        case LEFT:
            gameObjects[this.row][this.column] = 0;
            this.column--;
            gameObjects[this.row][this.column] = THIEF;
            break;

        case RIGHT:
            gameObjects[this.row][this.column] = 0;
            this.column++;
            gameObjects[this.row][this.column] = THIEF;
    }
    //console.log(this.row);
    //console.log(this.column);
}

function getRoyalGard() {

    if (Number(queenRoyalGard) < 3) {

        queenRoyalGard += 1;

    }

    return queenRoyalGard;

}

// Set the end of the Game
function endGame() {

    if (map[queenRow][queenColumn] === OPERA) {

        //Display the game message
        alert("BRAVO! THE QUEEN ARRIVE ALIVE");

    } else if (gameObjects[queenRow][queenColumn] === THIEF) {

        alert("YOU LOST.THE QUEEN IS ATTACK BY THE THIEF!");

    } else if (map[queenRow][queenColumn] === SEINE) {

        alert("YOU LOST. DIED IN THE SEINE");

    }
    //Remove the keyboard listener to end the game
    window.removeEventListener("keydown", keydownHandler, false);
}


function render() {


    if (stage.hasChildNodes()) {
        for (var i = 0; i < ROWS * COLUMNS; i++) {
            stage.removeChild(stage.firstChild);
        }
    }

    //looping through the map arrays
    for (var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {
            //Call the img tag
            var cell = document.createElement("img");

            //Set it's CSS class to "cell"
            cell.setAttribute("class", "cell");

            //Add the img tag to the <div id="stage"> tag
            stage.appendChild(cell);

            //Find the correct image for this map cell
            switch (map[row][column]) {
                case FOREST:

                    cell.src = "./img/forest.png";
                    break;

                case ROYAL_GUARD:
                    cell.src = "./img/royal_guard64.png";
                    break;

                case SEINE:
                    cell.src = "./img/seine.png";
                    break;

                case OPERA:
                    cell.src = "./img/opera64.png";
                    break;
            }



            switch (gameObjects[row][column]) {
                case QUEEN:
                    cell.src = "./img/queen64.png";
                    break;

                case THIEF:
                    cell.src = "./img/thief.png";
                    break;
            }


            cell.style.top = row * SIZE + "px";
            cell.style.left = column * SIZE + "px";
        }
    }
}


var count = 10;
var compteur = document.querySelector("#output");
var timer = setInterval(function() {
    compteur.innerHtml = count;
    count -= 1;
    //console.log(count);
    if (count <= 0) {
        console.log("Count should be 0: " + count)
        endGame();
        alert("TO LATE! She died of boring on her road");
        clearInterval(timer);
    }

    $("#output").text("00 : 0" + count)


}, 1000);