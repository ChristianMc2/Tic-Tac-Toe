window.onload= function() {watch()};
function watch() {
    var btn = document.getElementById("btnStop");
    btnDisabled(btn);
}

//dice
function rollForTurn() {
    var xArray = [];
    var ranNum = '';
    var minimum = 1;
    var maximum = 11;
    var first = "";
    var txt1 = "";
    for (var i = 0; i<2; i++) {
        //random number between 1 and 10
        ranNum = Math.floor(Math.random()*(maximum - minimum) + minimum);
        xArray.push(ranNum);
    }
    diceRoll(); //dice sounds)
    //who rolled what
    for (i=0; i<xArray.length; i++) {
        var result = i + 1;
        var pOne = xArray[0];
        var pTwo = xArray[1];
        if (pOne == pTwo) { //rigging roll in tie to prevent bug in code
            pOne = 1;
            pTwo = 2;
        }
        txt1 = "Player 1 rolled ["+pOne+"]<br>";
        writeMsg(txt1);
        txt1 = txt1 + "Player 2 rolled ["+pTwo+"]<br><br>";
        setTimeout(function() {writeMsg(txt1);}, 1000); //time delay
    }
    // determine and concatenate string showing the winner of the dice roll
    if (pOne > pTwo) {
        first = "Player 1";
        setTimeout(function() {txt1 = txt1 + "Player 1 wins, please choose a square.";}, 2000);
        setTimeout(function() {writeMsg(txt1);}, 2000);
    } else if (pOne < pTwo) {
        first = "Player 1";
        setTimeout(function() {txt1 = txt1 + "Player 2 wins, please choose a square.";}, 2000);
        setTimeout(function() {writeMsg(txt1);}, 2000);
    }
    //pass which player won the roll
    return first;
}

//------------------------------------------------------------
//Initiate the game, roll for turn and determine active player

function startGame() {
    var xTurn = 0;
    activePlayer = rollForTurn();
    if (activePlayer == "") { //if tie then reroll
        activePlayer = rollForTurn();
    }
    setTimeout(function() {hideGameMsg();}, 4000);

    //assign proper state of the control buttons
    var btn = document.getElementById("btnStart");
    btnDisabled(btn); // disable the start button as the game has laready begun
    var btn = document.getElementById("btnStop");
    stopEnabled(btn); //enable stop button as the game has begun

    //assign the active player to the console
    var showPlayer = document.getElementById("showPlayer")
    showPlayer.innerHTML = activePlayer;
    showPlayer.style.color = "green";
}

//styles game buttons while they are disabled
function btnDisabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(153, 153, 102)";
    btn.style.backgroundColor = "rgb(214, 214, 194)";
    btn.disabled = true;
}

//styles game buttons while they are disabled
function stopEnabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(204, 0, 0)";
    btn.style.backgroundColor = "rgb(255, 51, 51)";
    btn.disabled = false;
}

//styles game buttons while they are disabled
function startEnabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(0, 153, 0)";
    btn.style.backgroundColor = "rgb(57, 230, 0)";
    btn.disabled = false;
}

//stop and reset game when user indicates
function stopGame() {
	hideGameMsg(); // clear the text and hide message box
	var btn = document.getElementById('btnStart');
	startEnabled(btn); // enable the start button since the game is now stopped
	var btn = document.getElementById('btnStop');
	btnDisabled(btn); // disable the stop button since the game is now stopped
	var showPlayer = document.getElementById('showPlayer')
	showPlayer.innerHTML = "Game Stopped";
	showPlayer.style.color='red';
	
	// reset all squares to thier starting empty state.
	var arrayO = document.getElementsByClassName("O");
	var arrayX = document.getElementsByClassName("X");
	for (var i=0; i<arrayO.length;i++) {
		arrayO[i].style.transform = "translateY(-100%)";
	}
	for (var i=0; i<arrayX.length;i++) {
		arrayX[i].style.transform = "translateY(100%)";
	}
	// this clears the running log of all game moves
	document.getElementById('boardState').innerHTML = "";
}

//Shows the message console and any text it may have
function showGameMsg() {
    document.getElementById("gameMsgBox").style.display = "block";
}

//Hide the message console
function hideGameMsg() {
    clearMsg() //clear text from console
    document.getElementById("gameMsgBox").style.display = "none"; //hide the div
}

//write text to the message console
function writeMsg(txt) {
    showGameMsg();
    document.getElementById("gameMsg").innerHTML= txt;
}

//clear text from console
function clearMsg() {
    document.getElementById("gameMsg").innerHTML= "";
}

//checks avatar assignments and prevents them from being the same
function saveSettings() {
    var p1Index = document.getElementById("player1").selectedIndex;
    var p1Selected = document.getElementById("player1").options;
    var p2Index = document.getElementById("player2").selectedIndex;
    var p2Selected = document.getElementById("player2").options;
    if (p1Selected[p1Index].text == p2Selected[p2Index].text) {
        alert("Error: Player 1 and Player 2 cannot both be assigned as: "+p1Selected[p1Index].text)
    } else {
        document.getElementById("p1Display").innerHTML= p1Selected[p1Index].text;
        document.getElementById("p2Display").innerHTML= p2Selected[p2Index].text;
    }
}

//returns the currently assigned avatar for each player
function getAvatars() {
    var p1Avatar = document.getElementById("p1Display").innerHTML;
    var p2Avatar = document.getElementById("p2Display").innerHTML;
    var avatarArray = [p1Avatar, p2Avatar];
    return avatarArray;
}

//returns active player avatar
function determineAvatar() {
    //determine correct avatar
    var avatarArray = getAvatars();
        var active = document.getElementById("showPlayer").innerHTML;
        p1Avatar = avatarArray[0];
        p2Avatar = avatarArray[1];
        if (active == "Player 1") { //check which player is active and their corresponding avatar
            var paintAvatar = p1Avatar;
        } else if (active == "Player 2") {
            var paintAvatar = p2Avatar;
        }
        return paintAvatar;
}

//changes active player over to next player
function avatarPlaced() {
    var parseText = document.getElementById("gameMsg").innerHTML;
    var showPlayer = document.getElementById("showPlayer"); //select the current element to memory
    //check for winner and if there is then stop the game
    if (parseText == "That's three in a row, Player 1 wins!" || parseText == "That's three in a row, Player 2 wins!") {
        showPlayer.innerHTML = "Game Stopped";
        showPlayer.style.color= "red";
    }
    activePlayer = showPlayer.innerHTML; //get current player
    if (activePlayer == "Player 1") { //once active player selects a square change the active player
        showPlayer.innerHTML = "Player 2";
    } else {
        showPlayer.innerHTML = "Player 1";
    }
    check4Tie();
}

//get the array of the current board and check proposed moves
function check(info,square) {
    for (var i in info) {
        var tempInfo = info[i].charAt(0); //comparing index of square
        if (tempInfo == square) {
            return tempInfo;
        }
    }
}

//check squares to see if the have been taken yet and if not record new square with assigned avatar
function recordMoves(square) {
    var proposedMove = square;
    var boardState = document.getElementById("boardState").innerHTML; //retrieve board state array
    var info = boardState.split(","); //seperates the string by a comma to create an array
    verdict = check(info,square); //check to see if proposed square is occupied
    return verdict;
}

//get list of previous moves and concatenate the current move to it
function recordMove(currentMove) {
    var target = document.getElementById("boardState");
    var previousMoves = target.innerHTML;
    target.innerHTML = previousMoves+currentMove;
}

function checkForWinCon() {
	var squareArray = [];
	var target = document.getElementById('boardState');
	var info = target.innerHTML; // raw array with squares and avatars
	info = info.substring(1); 
	info = info.split(','); // separate the string by commas into an array
    info.sort(); 
    for (var i in info) {
    	squareArray.push(info[i].charAt(0)); // new array with only squares not avatars
    }
    
	checkWinCon1(info,squareArray);
    checkWinCon2(info,squareArray);
    checkWinCon3(info,squareArray);
    checkWinCon4(info,squareArray);
    checkWinCon5(info,squareArray);
    checkWinCon6(info,squareArray);
    checkWinCon7(info,squareArray);
    checkWinCon8(info,squareArray);
	//console.log("New CHECK: "+document.getElementById('gameMsg').innerHTML);
	check4Tie();
}

// check for ties and act accordingly
function check4Tie() {
    var boardState = document.getElementById("boardState").innerHTML;
    boardState = boardState.substring(1); //remove leading comma
    boardState = boardState.split(","); //seperate the string by commas into an array
    var check = document.getElementById("gameMsg").innerHTML;
    if(boardState.length >= 9 && check != "That's three in a row, Player 1 wins!" && check !="That's three in a row, Player 2 wins!") {
        var txt1 = "Oh no! Nobody wins, it was a tie!";
        tieSound();
        writeMsg(txt1);
        setTimeout(function() {stopGame();}, 3000);
    }
}

// after a win is detected this function will produce the winning process
function winner(winDetected,winCon) {
	if (winDetected == "win") {
		var showme = winDetected;
		var activePlayer = document.getElementById('showPlayer').innerHTML;
		var txt2 = "That's three in a row, "+activePlayer+" wins!";
		writeMsg(txt2);
		var btn = document.getElementById('btnStart');
		startEnabled(btn); // enable the start button since the game is now stopped
		var btn = document.getElementById('btnStop');
		btnDisabled(btn); // disable the stop button since the game is now stopped
		document.getElementById('showPlayer').innerHTML = "Game Stopped";
		glowBoard(winCon); // call function to make the gameboard pulse with colors
	} 
}

//makes the winning squares light up in celebration
function glowBoard(pos) {
    var index0 = pos[0];
    var index1 = pos[1];
    var index2 = pos[2];
    var squares = document.getElementsByClassName("square")
    for (var i=0; i<squares.length; i++) {
        if (i == index0) {
            var bg1 = squares[1];
            blink();
            winSound();
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244, 179, 66);"}, 100);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244, 238, 66);"}, 200);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(197, 244, 66);"}, 300);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(122, 244, 66);"}, 400);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(66, 244, 235);"}, 500);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244, 179, 66);"}, 600);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244, 238, 66);"}, 700);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(197, 244, 66);"}, 800);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(122, 244, 66);"}, 900);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(66, 244, 235);"}, 1000);
            setTimeout(function() {bg1.style.backgroundColor = "#d7f3f7;"}, 1100);                 
        } else if (i == index1) {
            var bg2 = squares[1];
            setTimeout(function() {bg2.style.backgroundColor = "rgb(66, 244, 235);"}, 100);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(122, 244, 66);"}, 200);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(197, 244, 66);"}, 300);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244, 238, 66);"}, 400);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244, 179, 66);"}, 500);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(66, 244, 235);"}, 600);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(122, 244, 66);"}, 700);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(197, 244, 66);"}, 800);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244, 238, 66);"}, 900);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244, 179, 66);"}, 1000);
            setTimeout(function() {bg2.style.backgroundColor = "#d7f3f7";}, 1100);
        } else if (i == index2) {
            var bg3 = squares[i];
            var bg3 = squares[1];
            setTimeout(function() {bg3.style.backgroundColor = "rgb(244, 179, 66);"}, 100);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(244, 238, 66);"}, 200);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(197, 244, 66);"}, 300);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(122, 244, 66);"}, 400);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(66, 244, 235);"}, 500);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(244, 179, 66);"}, 600);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(244, 238, 66);"}, 700);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(197, 244, 66);"}, 800);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(122, 244, 66);"}, 900);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(66, 244, 235);"}, 1000);
            setTimeout(function() {bg3.style.backgroundColor = "#d7f3f7";}, 1100);
        }
    }
    setTimeout(function() {stopGame();}, 1200);
}

// game sounds
function squareSound() {
    var sound = document.getElementById("placeAvatar");
    sound.play();
    setTimeout(function() {sound.pause();}, 400);
    setTimeout(function() {sound.currentTime = 0;}, 500);
}
function tieSound() {
    var sound = document.getElementById("tieGame");
    var check = document.getElementById("gameMsg").innerHTML;
    setTimeout(function() {sound.play();}, 500);
}
function winSound() {
    var sound = document.getElementById("winGame");
    setTimeout(function() {sound.play();}, 500);
    setTimeout(function() {sound.pause();}, 2700);
    setTimeout(function() {sound.currentTime = 0;}, 2800);
}
function diceRoll() {
    var sound = document.getElementById("diceRoll");
    sound.play();
}

//background flash after win animation
function blink() {
    var body = document.getElementById("body");
    setTimeout(function() {body.style.backgroundColor = "#94f7ed";}, 100);
    setTimeout(function() {body.style.backgroundColor = "#94cef7";}, 200);
    setTimeout(function() {body.style.backgroundColor = "#94a6f7";}, 300);
    setTimeout(function() {body.style.backgroundColor = "#b094f7";}, 400);
    setTimeout(function() {body.style.backgroundColor = "#cc94f7";}, 500);
    setTimeout(function() {body.style.backgroundColor = "#e894f7";}, 600);
    setTimeout(function() {body.style.backgroundColor = "#f794d9";}, 700);
    setTimeout(function() {body.style.backgroundColor = "#f73881";}, 800);
    setTimeout(function() {body.style.backgroundColor = "#c6034e";}, 900);
    setTimeout(function() {body.style.backgroundColor = "#e00202";}, 1000);
    setTimeout(function() {body.style.backgroundColor = "#ffffff";}, 1100);
}

// win condition algorithms

// checking for wincon squares 012
function checkWinCon1(info,squareArray) {
	var winDetected = "on";
	var winCon1 = [0,1,2];
	for (var i in info) {
		if (info[i].charAt(0) == "0") {
			var match0Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "1") {
			var match1Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "2") {
			var match2Avatar = info[i].charAt(1);
		}
	}
	
	if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
		if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
			winDetected = "win"; 
			winner(winDetected,winCon1);
			return;
		}
	}
	winner(winDetected,winCon1); // winCon1 is the array of win combo
}

// checking for wincon squares 345
function checkWinCon2(info,squareArray) {
	var winCon2 = [3,4,5];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "3") {
			var match3Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "4") {
			var match4Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "5") {
			var match5Avatar = info[i].charAt(1);
		}
	}
	if (match3Avatar != undefined && match4Avatar != undefined && match5Avatar != undefined) { // this will trigger (ONLY) if there was a match for index3, index4, and index5
		if (match3Avatar == match4Avatar && match3Avatar == match5Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon2);
}

// checking for wincon squares 678
function checkWinCon3(info,squareArray) {
	var winCon3 = [6,7,8];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "6") {
			var match6Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "7") {
			var match7Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "8") {
			var match8Avatar = info[i].charAt(1);
		}
	}
	if (match6Avatar != undefined && match7Avatar != undefined && match8Avatar != undefined) {
		if (match6Avatar == match7Avatar && match6Avatar == match8Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon3);
}

// checking for wincon squares 036
function checkWinCon4(info,squareArray) {
	var winCon4 = [0,3,6];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "0") {
			var match0Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "3") {
			var match3Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "6") {
			var match6Avatar = info[i].charAt(1);
		}
	}
	if (match0Avatar != undefined && match3Avatar != undefined && match6Avatar != undefined) {
		if (match0Avatar == match3Avatar && match0Avatar == match6Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon4);
}

// checking for wincon squares 147
function checkWinCon5(info,squareArray) {
	var winCon5 = [1,4,7];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "1") {
			var match1Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "4") {
			var match4Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "7") {
			var match7Avatar = info[i].charAt(1);
		}
	}
	if (match1Avatar != undefined && match4Avatar != undefined && match7Avatar != undefined) {
		if (match1Avatar == match4Avatar && match1Avatar == match7Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon5);
}

// checking for wincon squares 258
function checkWinCon6(info,squareArray) {
	var winCon6 = [2,5,8];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "2") {
			var match2Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "5") {
			var match5Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "8") {
			var match8Avatar = info[i].charAt(1);
		}
	}
	if (match2Avatar != undefined && match5Avatar != undefined && match8Avatar != undefined) {
		if (match2Avatar == match5Avatar && match2Avatar == match8Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon6);
}

// checking for wincon squares 642
function checkWinCon7(info,squareArray) {
	var winCon7 = [6,4,2];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "6") {
			var match6Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "4") {
			var match4Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "2") {
			var match2Avatar = info[i].charAt(1);
		}
	}
	if (match6Avatar != undefined && match4Avatar != undefined && match2Avatar != undefined) {
		if (match6Avatar == match4Avatar && match6Avatar == match2Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon7);
}

// checking for wincon squares 048
function checkWinCon8(info,squareArray) {
	var winCon8 = [0,4,8];
	var winDetected = "on";
	for (var i in info) {
		if (info[i].charAt(0) == "0") {
			var match0Avatar = info[i].charAt(1); // only interested in recording the avatar
		}
		if (info[i].charAt(0) == "4") {
			var match4Avatar = info[i].charAt(1);
		}
		if (info[i].charAt(0) == "8") {
			var match8Avatar = info[i].charAt(1);
		}
	}
	if (match0Avatar != undefined && match4Avatar != undefined && match8Avatar != undefined) {
		if (match0Avatar == match4Avatar && match0Avatar == match8Avatar) {
			winDetected = "win";
		}
	}
	winner(winDetected,winCon8);
}

function square1Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "0";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [0];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square2Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "1";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [1];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square3Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "2";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [2];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square4Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "3";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [3];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square5Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "4";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [4];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square6Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "5";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [5];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square7Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "6";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [6];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square8Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "7";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [7];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function square9Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "8";
        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar) [8];
            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }
            var currentMove = ","+square+paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square, paintAvatar);
            squareSound();
        }
    }
}

function animateO(selected) {
    selected.style.transform = (selected.style.transform == "translateY(0%)" || null) ? "translateY(0%)" : "translateY(0%)";
}

function animateX(selected) {
    selected.style.transform = (selected.style.transform == "translateY(100%)" || null) ? "translateY(0%)" : "translateY(-100%)";
}