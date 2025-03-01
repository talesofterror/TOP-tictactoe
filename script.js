/* 
 * Need Tie game Condition
 *
 * Need to exclude occupied squares 
 * from opponent's random movement 
 * calculation for rare loop condition
 *
 */

const Engine = (function () {
	let gameArchive = []
	let userTurn
	let winState = false
	const gameboardElement = document.getElementById("gameboard")
	// let cells
	const gameDialogueElement = document.getElementById("game-dialogue")
	const dialogues = {
		"new-game": document.getElementById("new-game-dialogue"),
		"info": document.getElementById("info-dialogue"),
		"result": document.getElementById("result-dialogue")
	}
	let noListeners = true

	function DialogueHandler (dialogue) {
		for (e in dialogues) {
			if (dialogue == e) {
				if (dialogues[e].classList.contains("invisible")) {
					dialogues[e].classList.remove("invisible")
					gameDialogueElement.style.zIndex = 0
				} else {
					dialogues[e].classList.add("invisible")
					gameDialogueElement.style.zIndex = -1
				}
			} else {
				dialogues[e].classList.add("invisible")
			}
		}
	}

	function InitializeListeners () {
		if (noListeners) {
			Engine.cells.forEach( (row, rIndex) => {
				row.forEach( (column, cIndex) => {
					column.addEventListener ( "click", () => {
						Engine.GetCurrentGame().player.Move(rIndex, cIndex)
						noListeners = false
					})
				})
			})
		}
	}

	function InitializeBoard () {
		let cellElements = [[" ", " ", " "],  [" ",  " ", " "], [" ", " ", " "]]
		for (let i = 0; i < Engine.gameboardElement.children.length; i++) {
			for (let j = 0; j < Engine.gameboardElement.children[i].children.length; j++) {
				cellElements[i][j] = Engine.gameboardElement.children[i].children[j]
				cellElements[i][j].textContent = "-"
			}
		}
		
		Engine.cells = cellElements
	}

	function CreateGame (playerSigil, oppSigil) {
		winState = false
		const gameBoard = new GameBoard()
		const player = new Player(playerSigil)
		Engine.userTurn = player.gamePiece == "x" ? true : false
		const opponent = new Player(oppSigil)
		const newGame = { gameBoard, player, opponent }

		gameArchive.push(newGame)
		Engine.InitializeBoard()
		Engine.InitializeListeners()

		
		dialogues["new-game"].classList.add("invisible")
		gameDialogueElement.style.zIndex = -1

		TurnHandler(userTurn)

		console.log(" ****** New game initiated! ******")

		return newGame
	}

	function Evaluate (player) {
		player.ResetScore()
		let gamePlacements = Engine.GetCurrentGame().gameBoard.placements

		for (let row = 0; row < gamePlacements.length; row ++) { // rows
			for (let col = 0; col < gamePlacements[row].length; col++) {
				if (gamePlacements[row][col] != " ") {
					let noPrevPlacement = gamePlacements[row][col] 
						== player.gamePiece ? true : false
					let diagonalLeft = (row == 0 && col == 0) || (row == 2 && col == 2)
					let diagonalRight = (row == 2 && col == 0) || (row == 0 && col == 2)
					let centerPlacement = (row == 1 && col == 1)
					if (noPrevPlacement) {
						player.score[row]++
						player.score[3 + col]++
						if (diagonalLeft) {player.score[6]++}
						if (diagonalRight) {player.score[7]++}
						if (centerPlacement) { 
							player.score[6]++
							player.score[7]++
						}
					}
				} else { continue }
			}
		}
	
		if (player.score.filter( (e) => e == 3 ).length != 0) {
			console.log(player.score)
			winState = true
			WinGame(player)	
		}
		else { /* turn */ }
	}

	function TurnHandler () {
		console.log("userTurn TurnHandler() call: " + Engine.userTurn)
		if (!winState) {
			if (Engine.userTurn) {
				console.log("Switched to user turn")
				Engine.gameboardElement.classList.remove("no-click")
				console.log("Player turn")
			} else {
				console.log("Switched to computer turn")
				Engine.gameboardElement.classList.add("no-click")
				console.log("Computer turn")
				setTimeout(Engine.GetCurrentGame().opponent.Move, 1000)
			} 
			Engine.userTurn = Engine.userTurn
		}
		else { return }
	}

	function WinGame (player) {
		DialogueHandler("result")
		console.log(player.gamePiece + " wins the game!")
	}

	function GetCurrentGame () {
		return gameArchive[gameArchive.length - 1]
	}

	const Error = (errorType) => {
		switch (errorType) {
			case "move":
				console.log("Invalid move")
				if (!Engine.userTurn) {
					Engine.GetCurrentGame().opponent.Move(0,0)
				} else {
					!Engine.userTurn
				}
		}
	}

	return {
		gameArchive, gameboardElement, userTurn, winState,
		Evaluate, DialogueHandler, CreateGame, TurnHandler,
		InitializeBoard, InitializeListeners,
		Error, GetCurrentGame }
})()

function GameBoard () {
	const placements = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]


	function DrawBoard () {
		for (let i = 0; i < Engine.gameboardElement.children.length; i++) {
			for (let j = 0; j < Engine.gameboardElement.children[i].children.length; j++) {
				Engine.cells[i][j].textContent = this.placements[i][j]
			}
		}
	}

	const LogBoard = () => {
		console.log(placements[0])
		console.log(placements[1])
		console.log(placements[2])
		console.log(" ")
	}

	return { placements, DrawBoard, LogBoard }
}

function Player(gamePiece) {

	let score = new Array(8).fill(0)

	function Move () {
		const gameBoardTarget = Engine.GetCurrentGame().gameBoard
		console.log (`userTurn on Move() call: ${Engine.userTurn}`)
		if (Engine.userTurn){
			console.log(`User move: ${arguments[0]}, ${arguments[1]}`)
			if (gameBoardTarget.placements[arguments[0]][arguments[1]] == "-") {
				gameBoardTarget.placements[arguments[0]][arguments[1]] = gamePiece
			} else {
				Engine.Error("move")
				return
			}
		} else if (!Engine.userTurn) {
				let rndX = Math.floor(Math.random() * 3)
				let rndY = Math.floor(Math.random() * 3)

				console.log(`Computer move: (${rndX}, ${rndY})`)

				if (gameBoardTarget.placements[rndX][rndY] == "-") {
					gameBoardTarget.placements[rndX][rndY] = gamePiece
				} else {
					Engine.Error("move")
					return
				}
		}

		let context = Engine.userTurn ? Engine.GetCurrentGame().player 
			: Engine.GetCurrentGame().opponent

		gameBoardTarget.LogBoard()
		gameBoardTarget.DrawBoard()
		Engine.Evaluate(context)
		Engine.userTurn = !Engine.userTurn
		Engine.TurnHandler()
	}

	function ResetScore () {
		this.score.fill(0)
	}

	return {
		gamePiece, score, 
		Move, ResetScore 
	}
}

