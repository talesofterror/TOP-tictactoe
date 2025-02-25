
const Engine = (function () {
	let gameArchive = []
	let userTurn = false
	const gameboardElement = document.getElementById("gameboard")

	// Consider Object.apply() ??
	function CreateGame (playerSigil, oppSigil) {
		const game = new Game()
		const player = new Player(playerSigil, game)
		const opponent = new Player(oppSigil, game)
		const newGame = {game, player, opponent}
		game.InitializeBoard()
		gameArchive.push(newGame)
		player.InitializeListeners()
		player.Move.bind(player)

		return newGame
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
			WinGame(player)	
		}
		else { /* turn */ }

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
		}
	}

	return {
		gameArchive, gameboardElement, GetCurrentGame, turn: userTurn, 
		Evaluate, CreateGame, Error}
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
				boardElement[i].children[j].textContent = newGame.game.placements[i][j]
			}
		}
	}

	const LogBoard = () => {
		console.log(placements[0])
		console.log(placements[1])
		console.log(placements[2])
		console.log(" ")
	}

	return {placements, cells, InitializeBoard, DrawBoard, LogBoard}
}

function Player(gamePiece, game) {
	let score = new Array(8).fill(0)
	function Move (x, y) {
		if (game.placements[x][y] == " "){
			game.placements[x][y] = gamePiece
			game.LogBoard()
			game.DrawBoard()
			Engine.Evaluate(this)
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
						this.Move(rIndex, cIndex)
					})
				})
			})
		}
	}

	return {
		gamePiece, game, score, 
		Move, ResetScore, InitializeListeners
	}
}

let newGame = Engine.CreateGame("x", "o")
// newGame.player.Move(0, 0)
// newGame.player.Move(1, 0)
// newGame.player.Move(2, 1)
//
// newGame.opponent.Move(1, 0)
// newGame.opponent.Move(1, 1)

