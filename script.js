
const Engine = (function () {
	let gameArchive = []
	let currentGame = gameArchive[gameArchive.length-1]
	let turn = false

	// Consider Object.apply() ??
	const CreateGame = (playerSigil, oppSigil) => {
		const game = new Game()
		const board = new Board(game)
		const player = new Player(playerSigil, game, board)
		const opponent = new Player(oppSigil, game, board)
		const newGame = {game, board, player, opponent}
		gameArchive.push(newGame)
		return newGame
	}

	function Evaluate (player) {
		ResetScore(player)
		let gamePlacements = player.game.placements

		for (let row = 0; row < gamePlacements.length; row ++) { // rows
			for (let col = 0; col < gamePlacements[row].length; col++) {
				if (gamePlacements[row][col] != " ") {
					let playerPlacement = gamePlacements[row][col] 
						== player.gamePiece ? true : false
					let diagonalLeft = (row == 0 && col == 0) || (row == 2 && col == 2)
					let diagonalRight = (row == 2 && col == 0) || (row == 0 && col == 2)
					let centerPlacement = (row == 1 && col == 1)
					if (playerPlacement) {
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

	function ResetScore (player) {
		player.score.fill(0)
	}

	const Error = (errorType) => {
		switch (errorType) {
			case "move":
				console.log("Invalid move")
		}
	}

	return {
		gameArchive, currentGame, turn, 
		Evaluate, CreateGame, Error}
})()

function Game () {
	const placements = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]

	return {placements}
}

function Player (gamePiece, game, board) {
	let score = new Array(8).fill(0);
	function Move (x, y) {
		if (game.placements[x][y] == " "){
			game.placements[x][y] = gamePiece
			board.Update()
			Engine.Evaluate(this)
		} else {
			Engine.Error("move")
		}
	}

	return {gamePiece, game, board, score, Move}
}

function Board (game) {
	const Update = () => {
		console.log(game.placements[0])
		console.log(game.placements[1])
		console.log(game.placements[2])
		console.log(" ")
	}

	return {Update}
}

let newGame = Engine.CreateGame("x", "o")
newGame.player.Move(0, 0)
newGame.player.Move(1, 0)
// newGame.player.Move(2, 0)
newGame.player.Move(2, 1)

// newGame.opponent.Move(1, 0)
// newGame.opponent.Move(1, 1)
// newGame.opponent.Move(1, 2)

