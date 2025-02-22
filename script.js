
const Engine = (function () {
	let gameArchive = []
	let turn = false
	const gameboardElement = document.getElementById("gameboard")

	// Consider Object.apply() ??
	function CreateGame (playerSigil, oppSigil) {
		const game = new Game()
		const player = new Player(playerSigil, game)
		const opponent = new Player(oppSigil, game)
		const newGame = {game, player, opponent}
		gameArchive.push(newGame)

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
		gameArchive, gameboardElement, GetCurrentGame, turn, 
		Evaluate, CreateGame, Error}
})()

function Game () {
	const placements = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]

	let boardElement = Engine.gameboardElement.children
	let cells = Array(3)

	function DrawBoard () {
		for (let i = 0; i < boardElement.length; i++) {
			cells[i] = Array.from(boardElement[i])
		}

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

	return {placements, DrawBoard, LogBoard}
}

function Player(gamePiece, game) {
	let score = new Array(8).fill(0);
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
		score.fill(0)
	}

	return {
		gamePiece, game, score, 
		Move, ResetScore
	}
}

// let newGame = Engine.CreateGame("x", "o")
// newGame.player.Move(0, 0)
// newGame.player.Move(1, 0)
// newGame.player.Move(2, 1)
//
// newGame.opponent.Move(1, 0)
// newGame.opponent.Move(1, 1)

