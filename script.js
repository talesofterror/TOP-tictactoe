
const Engine = (function () {
	let gameArchive = []
	let userTurn
	let winState = false
	let tieGame = 0
	const gameboardElement = document.getElementById("gameboard")
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
				cellElements[i][j].classList.remove("cell-user", "cell-computer", "no-click", 
					"cell-user-placement", "cell-computer-placement",
					"cell-user-win", "cell-computer-win", "cell-computer-think-1",
					"cell-computer-think-2", "cell-computer-think-3", "cell-start-game")
				cellElements[i][j].offsetWidth
				cellElements[i][j].classList.add("cell-active-game", "cell-start-game")
			}
		}
		
		Engine.cells = cellElements
	}

	function CreateGame (playerSigil, oppSigil) {
		Engine.winState = false
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

		TurnHandler()

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
			Engine.winState = true
			let winnerStyle = Engine.userTurn ? "cell-user-win" : "cell-computer-win"
			player.placements.forEach((e) => e.classList.add(winnerStyle))
			setTimeout(EndGame, 1000, player)
		}
		else { 
			Engine.cells.forEach ((rCell) => {
				rCell.forEach((cCell) => {
					if (cCell.textContent == "x"){
						Engine.tieGame++
					}
				})
			})
			if (Engine.tieGame == 5) { EndGame(player); Engine.winState = true } 
			else { Engine.tieGame = 0 }
		}
	}

	function TurnHandler () {
		console.log("userTurn TurnHandler() call: " + Engine.userTurn)
		if (!Engine.winState) {
			if (Engine.userTurn) {
				console.log("Switched to user turn")
				Engine.gameboardElement.classList.remove("no-click")
				console.log("Player turn")
			} else {
				console.log("Switched to computer turn")
				Engine.gameboardElement.classList.add("no-click")
				let pulses = [
					"cell-computer-think-1",
					"cell-computer-think-2",
					"cell-computer-think-3"
				]
				for (let i = 0; i < Engine.cells.length; i++) {
					for (let j = 0; j < Engine.cells[i].length; j++) {
						if (Engine.cells[i][j].textContent != "-") { continue }
						Engine.cells[i][j].classList.remove("cell-computer-think-1",
							"cell-computer-think-2", "cell-computer-think-3", "cell-start-game")
						Engine.cells[i][j].offsetWidth // trigger reflow
						let pulseRandomizer = Math.floor(Math.random() * 3)
						console.log(`Apply ${pulses[pulseRandomizer]} to cell ${i}, ${j}`)
						Engine.cells[i][j].classList.add(pulses[pulseRandomizer])
					}
				}
				console.log("Computer turn")
				setTimeout(Engine.GetCurrentGame().opponent.Move, 1000)
			} 
			Engine.userTurn = Engine.userTurn
		}
		else { return }
	}

	function EndGame (player) {
		const winnerElement = document.getElementById("winner")
		if (Engine.tieGame == 5) {
			winnerElement.textContent = "tie"
		} else {
			winnerElement.textContent = player.gamePiece 
		}
		DialogueHandler("result")
		Engine.gameboardElement.classList.add("no-click")
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
		gameArchive, gameboardElement, gameDialogueElement,
		userTurn, winState, tieGame,
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
	let placements = []

	function Move () {
		const gameBoardTarget = Engine.GetCurrentGame().gameBoard
		let userX = arguments[0]
		let userY = arguments[1]
		let rndX = Math.floor(Math.random() * 3)
		let rndY = Math.floor(Math.random() * 3)

		console.log (`userTurn on Move() call: ${Engine.userTurn}`)
		if (Engine.userTurn){
			console.log(`User move: ${userX}, ${userY}`)
			if (gameBoardTarget.placements[userX][userY] == "-") {
				gameBoardTarget.placements[userX][userY] = gamePiece
				placements.push(Engine.cells[userX][userY])
			} else {
				Engine.Error("move")
				return
			}
		} else if (!Engine.userTurn) {
				console.log(`Computer move: (${rndX}, ${rndY})`)

				if (gameBoardTarget.placements[rndX][rndY] == "-") {
					gameBoardTarget.placements[rndX][rndY] = gamePiece
					placements.push(Engine.cells[rndX][rndY])
				} else {
					Engine.Error("move")
					return
				}
		}

		// animate placement
		if (Engine.userTurn) {
			Engine.cells[userX][userY].classList.add("cell-user-placement", "cell-user",
				"no-click")
		} else {
			Engine.cells[rndX][rndY].classList.add("cell-computer-placement", "cell-computer",
				"no-click")
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
		gamePiece, score, placements,
		Move, ResetScore 
	}
}

