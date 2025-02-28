
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
		const game = new Game()
		const player = new Player(playerSigil, game)
		const opponent = new Player(oppSigil, game)
		const newGame = {game, player, opponent}

		game.InitializeBoard()
		player.InitializeListeners()
		gameArchive.push(newGame)
		Engine.userTurn = newGame.player.gamePiece == "x" ? true : false
		dialogues["new-game"].classList.add("invisible")
		gameDialogueElement.style.zIndex = -1
		TurnHandler(userTurn)

		return newGame
	}

	function GameStart (playerSigil, oppSigil) {
		CreateGame(playerSigil, oppSigil)
	}

	function Evaluate (player) {
		player.ResetScore()
		let gamePlacements = player.game.placements

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
		console.log("userTurn value upon entry: " + Engine.userTurn)
		if (!winState) {
			if (Engine.userTurn) {
				console.log("Switched to user turn")
				Engine.gameboardElement.classList.remove("no-click")
				console.log("Player turn")
			} else {
				console.log("Switched to computer turn")
				Engine.gameboardElement.classList.add("no-click")
				console.log("Computer turn")
				setTimeout(Engine.GetCurrentGame().opponent.OpponentMove(), 1000)
			}
			Engine.userTurn = Engine.userTurn
		}
	}

	function WinGame (player) {
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
					Engine.GetCurrentGame().opponent.OpponentMove()
				}
		}
	}

	return {
		gameArchive, gameboardElement, userTurn, 
		Evaluate, DialogueHandler, CreateGame, TurnHandler, GameStart,
		Error, GetCurrentGame }
})()

function Game () {
	const placements = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]

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

function Player(gamePiece, game) {
	let score = new Array(8).fill(0)

	function UserMove (x, y) {
		if (game.placements[x][y] == " "){
			console.log("User move:")
			game.placements[x][y] = gamePiece
			game.LogBoard()
			game.DrawBoard()
			Engine.Evaluate(this)
			Engine.userTurn = !Engine.userTurn
			Engine.TurnHandler()
		} else {
			Engine.Error("move")
		}
	}

	// RNG is not good enough here because it keeps guessing the same coordinates
	// need to exclude occupied cells from the pool of possibilities
	function OpponentMove () {
		let rndX = Math.floor(Math.random() * 2)
		let rndY = Math.floor(Math.random() * 2)

		console.log(`Computer move: (${rndX}, ${rndY})`)

		if (game.placements[rndX][rndY] == " "){
			game.placements[rndX][rndY] = gamePiece
			game.LogBoard()
			game.DrawBoard()
			Engine.Evaluate(this)
			Engine.userTurn = !Engine.userTurn
			Engine.TurnHandler()	
		} else {
			Engine.Error("move")
		}
	}


	function ResetScore () {
		this.score.fill(0)
	}

	function InitializeListeners () {
		if (!game.cells[0][0].getAttribute("listener")) {
			game.cells.forEach( (row, rIndex) => {
				row.forEach( (column, cIndex) => {
					column.addEventListener ( "click", () => {
						this.UserMove(rIndex, cIndex)
					})
				})
			})
		}
	}

	return {
		gamePiece, game, score, 
		UserMove, OpponentMove, ResetScore, InitializeListeners
	}
}

// let newGame = Engine.CreateGame("x", "o")
// newGame.player.Move(0, 0)
// newGame.player.Move(1, 0)
// newGame.player.Move(2, 1)
//
// newGame.opponent.Move(1, 0)
// newGame.opponent.Move(1, 1)

