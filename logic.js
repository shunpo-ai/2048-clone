// Variables are storage iof values
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Functions are callable programmed tasks
function setGame(){
	board = [
		[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
	]; //Backend board
	// Goal, we will use the backedn board to design and move the tiles of the frontend baord.

	// Loops are code to repeat tasks inside it, until it fulfill its task

	for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){

        	// This code is to create a tile through creating div elements
            let tile = document.createElement("div");

            // Each tile will have an id based on its row and column position through this code
            tile.id = r.toString() + "-" + c.toString(); 

            // Get the number of a tile
            let num = board[r][c];

            // Use the number to update the tile's appearance
            updateTile(tile, num); 

            // Add the created tile with id to the frontend game board
            document.getElementById("board").append(tile); 
        }
    }

    setTwo();
    setTwo();
}

// This function is to update the color of the tile based on its number
function updateTile(tile, num){
    // Resets the tile and its class names 
    tile.innerText = ""; 
    tile.classList.value = "";  
    
    // Add class name "tile" to resize and design the tile based on our assigned size and styles for class name tile.
    tile.classList.add("tile");

    // If the num value is not zero let's change the color of the tile based on it's num value (We will only color tiles with values that are not zero)
    if(num > 0) {
        // This will display the number of the tile
        tile.innerText = num.toString();
        
        // And this will color the tile
        // If the num value of the tile is lesser or equal to 4096, it will use class x2 to x4096 css classes to color the tile (depending on the num value of the tile)
        if (num <= 4096){
            tile.classList.add("x"+ num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}


window.onload = function() {
    // setGame() is called to be executed
    setGame();
}


function filterZero(row){

	return row.filter(num => num != 0);
}

function slide(row){

	row = filterZero(row);

	for(let i = 0; i < row.length - 1; i++){
        /* 1st iteration:
        If index 0 == index 1 (2 == 2)
        (true) index 0 = 2 * 2 (4)
        Index 1 = 0 (4,0,2)

        2nd iteration:
        If index 1 == index 2 (0 == 2)
        (false) index 1 = 0
        Index 2 = 2 (4,0,2)
        */
        // If two adjacent numbers are equal.
        if(row[i] == row[i+1]){
            // merge them by doubling the first one
            row[i] *= 2;
            // and setting the second one to zero.      
            row[i+1] = 0;   
            score += row[i]; // This code is to change our score    
        } // [2, 2, 2] -> [4, 0, 2]
     }

     row = filterZero(row); // [4, 2]

     while(row.length < columns){
     	row.push(0);
     } // [4, 2, 0, 0]

     return row;

}

function handleSlide(e){
	console.log(e.code); // e.code value represents what key is being pressed in our keyboard

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		e.preventDefault();

		if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		} else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}  else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}

		document.getElementById("score").innerText = score;
	}

	checkWin();

	if(hasLost()){
		setTimeout(() => {
			alert("Game Over! You have lost the game. Game will restart");
			restartGame();
			alert("Click any arrow key to restart.")
		})
	}
}

document.addEventListener("keydown", handleSlide);

function slideLeft(){

	// iterate through each row
    for(let r = 0; r < rows; r++){

    	// All tiles values per row are saved in a container
        let row = board[r];

        // Line for animation
        let originalRow = row.slice(); // initial state of the row before the movement

        // We used slide function to merge tiles with the same values
        row = slide(row); 
        // Update the row with the merged tile/s
        board[r] = row; 

        // Because of this lop, we are able to update the ids and color of all tiles
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //update id
            let num = board[r][c];
            updateTile(tile, num) // update color using updateTile function

            if (originalRow[c] !== num && num !== 0) {  

    	        tile.style.animation = "slide-from-right 0.3s";
    	        
    	        setTimeout(() => {
    	            tile.style.animation = "";
    	        }, 300);
    	    }
        }
    }
}

function slideRight(){

	// iterate through each row
    for(let r = 0; r < rows; r++){

    	// All tiles values per row are saved in a container
        let row = board[r];

         // Line for animation
        let originalRow = row.slice(); // initial state of the row before the movement

        row.reverse();

        // We used slide function to merge tiles with the same values
        row = slide(row); 

        row.reverse();
        // Update the row with the merged tile/s
        board[r] = row; 

        // Because of this lop, we are able to update the ids and color of all tiles
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //update id
            let num = board[r][c];
            updateTile(tile, num) // update color using updateTile function

            if (originalRow[c] !== num && num !== 0) {  

    	        tile.style.animation = "slide-from-left 0.3s";
    	        
    	        setTimeout(() => {
    	            tile.style.animation = "";
    	        }, 300);
    	    }
        }
    }
}

function slideUp(){
    for(let c = 0; c < columns; c++) {
        
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalRow = row.slice(); 

        row = slide(row);

        let changedIndices = [];
        for (let r = 0; r < rows; r++) { 
            if (originalRow[r] !== row[r]) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [4, 0, 0, 0]

                1st iteration: 2 !== 4 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 0 (False)
                */
                changedIndices.push(r);
            }
        }

        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if (changedIndices.includes(r) && num !== 0) {
               
                tile.style.animation = "slide-from-bottom 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

function slideDown(){
    for(let c = 0; c < columns; c++) {
        
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        row.reverse();

        let changedIndices = [];
        for (let r = 0; r < rows; r++) { 
            if (originalRow[r] !== row[r]) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [4, 0, 0, 0]

                1st iteration: 2 !== 4 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 0 (False)
                */
                changedIndices.push(r);
            }
        }

        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num)

            if (changedIndices.includes(r) && num !== 0) {
               
                tile.style.animation = "slide-from-top 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

function hasEmptyTile(){
 	for(let r = 0; r< rows; r++){
 		for(let c = 0; c < columns; c++){

 			if(board[r][c] == 0){
 				return true;
 			}
 		}
 	}
 return false;
}

function setTwo(){
	if(!hasEmptyTile()){
	    return; // Because the return keyword it will not proceed to next codes inside the function. Therefore it will not set two if all tiles is not empty
	}

	// But if there is an empty tile found it will proceed to this code, which will assign a value 2 to a random tile
	let found = false;

	// While loop is also like for loop that repeats tasks
	// Here, it will repeat the task until he finds the a random empty tile.
	while(!found){
	    

		// This is to get a random tile based on random row and column
	    let r = Math.floor(Math.random() * rows);
	    let c = Math.floor(Math.random() * columns);


	    // Then we will check the random tile in the board if it's value is zero. If it is then let's make it 2.
	    if(board[r][c] == 0){
	        board[r][c] = 2;
	        let tile = document.getElementById(r.toString() + "-" + c.toString());
	        tile.innerText = "2";
	        tile.classList.add("x2")

	        found = true;
	    }
	}
}	

function checkWin(){
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){

            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  
                is2048Exist = true;     
            } 
            else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     
            } 
            else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    
            }
        }
    }
}

function hasLost() {

    // Check if the board is full (because if the board is full and the player has no possible merges, it means he lose)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

        	// If it has an empty tile (value 0), it means the player has not yet lost, so it will return false.
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            // Check if there are adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }
    // No possible moves left or empty tiles, user has lost
    return true;
}

function restartGame(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0; 
        }
    }
    score = 0;
    setTwo();
}