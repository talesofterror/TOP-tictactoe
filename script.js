
const Engine = (function () {
	let gameArchive = []
	let userTurn
	let winState = false
	const gameboardElement = document.getElementById("gameboard")
	const gameDialogueElement = document.getElementById("game-dialogue")
	const dialogues = {
		"new-game": document.getElementById("new-game-dialogue"),
		"info": document.getElementById("info-dialogue"),
		"result": document.getElementById("result-dialogue")
	}

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

	function CreateGame (playerSigil, oppSigil) {
		winState = false
		const game = new Game()
		const player = new Player(playerSigil)
		const opponent = new Player(oppSigil)
		const newGame = {game, player, opponent}

		game.InitializeBoard()
		gameArchive.push(newGame)
		player.InitializeListeners()
		Engine.userTurn = newGame.player.gamePiece == "x" ? true : false
		dialogues["new-game"].classList.add("invisible")
		gameDialogueElement.style.zIndex = -1
		TurnHandler(userTurn)

		console.log(" ****** New game initiated! ******")

		return newGame
	}

	function GameStart (playerSigil, oppSigil) {
		CreateGame(playerSigil, oppSigil)
	}

	function Evaluate (player) {
		player.ResetScore()
		let gamePlacements = Engine.GetCurrentGame().game.placements

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
				Engine.GetCurrentGame().opponent.Move()
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
				}
		}
	}

	return {
		gameArchive, gameboardElement, userTurn, winState,
		Evaluate, DialogueHandler, CreateGame, TurnHandler, GameStart,
		Error, GetCurrentGame }
})()

function Game () {
	const placements = [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]]

	let boardElement = Engine.gameboardElement.children
	let cells = structuredClone(placements)

	function InitializeBoard () {
		for (let i = 0; i < boardElement.length; i++) {
			for (let j = 0; j < boardElement[i].children.length; j++) {
				cells[i][j] = boardElement[i].children[j]
				cells[i][j].textContent = "-"
			}
		}		
	}

	function DrawBoard () {
		for (let i = 0; i < boardElement.length; i++) {
			for (let j = 0; j < boardElement[i].children.length; j++) {
				boardElement[i].children[j].textContent = placements[i][j]
			}
		}
	}

	const LogBoard = () => {
		console.log(placements[0])
		console.log(placements[1])
		console.log(placements[2])
		console.log(" ")
	}

	return { placements, cells, InitializeBoard, DrawBoard, LogBoard }
}

function Player(gamePiece) {

	let score = new Array(8).fill(0)

	function Move () {
		const game = Engine.GetCurrentGame().game
		console.log (`userTurn on Move() call: ${Engine.userTurn}`)
		if (Engine.userTurn){
			console.log(`User move: ${arguments[0]}, ${arguments[1]}`)
			if (game.placements[arguments[0]][arguments[1]] == "-") {
				game.placements[arguments[0]][arguments[1]] = gamePiece
			} else {
				Engine.Error("move")
				return
			}
		} else if (!Engine.userTurn) {
				let rndX = Math.floor(Math.random() * 3)
				let rndY = Math.floor(Math.random() * 3)

				console.log(`Computer move: (${rndX}, ${rndY})`)

				if (game.placements[rndX][rndY] == "-") {
					game.placements[rndX][rndY] = gamePiece
				} else {
					Engine.Error("move")
					return
				}
		}

		let context = Engine.userTurn ? Engine.GetCurrentGame().player 
			: Engine.GetCurrentGame().opponent

		game.LogBoard()
		game.DrawBoard()
		Engine.Evaluate(context)
		Engine.userTurn = !Engine.userTurn
		Engine.TurnHandler()
	}
	
	//
	// function OpponentMove () {
	//
	//
	// 	console.log(`Computer move: (${rndX}, ${rndY})`)
	//
	// 	if (game.placements[rndX][rndY] == "-"){
	// 		game.LogBoard()
	// 		game.DrawBoard()
	// 		Engine.Evaluate(this)
	// 		Engine.userTurn = !Engine.userTurn
	// 		Engine.TurnHandler()	
	// 	} else {
	// 		Engine.Error("move")
	// 	}
	// }


	function ResetScore () {
		this.score.fill(0)
	}

	function InitializeListeners () {
		const game = Engine.GetCurrentGame().game
		if (!game.cells[0][0].getAttribute("listener")) {
			game.cells.forEach( (row, rIndex) => {
				row.forEach( (column, cIndex) => {
					column.addEventListener ( "click", () => {

						this.Move(rIndex, cIndex)
					})
				})
			})
		}
	}

	return {
		gamePiece, score, 
		Move, ResetScore, InitializeListeners
	}
}

// let newGame = Engine.CreateGame("x", "o")
// newGame.player.Move(0, 0)
// newGame.player.Move(1, 0)
// newGame.player.Move(2, 1)
//
// newGame.opponent.Move(1, 0)
// newGame.opponent.Move(1, 1)

