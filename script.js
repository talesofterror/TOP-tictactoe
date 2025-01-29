
const Engine = (function () {
	let gameArchive = []
	let currentGame = gameArchive[gameArchive.length-1]
	let turn = false

	function Evaluate (target) {
		for (row of target.game.placements) {
			let rowIndex = target.game.placements.indexOf(row)
			for (cell of row) {
				if (cell == " ") {
					continue
				}

				/*
				 * score array: 
				 * [0] = row 1, [1] = row 2, [2] = row 3
				 * [3] = col 1, [4] = col 2, [5] = col 3
				 * [6] = dia 1, [7] = dia 2
				 *
				 * array playerScore[length = 8]
				 * array oppScore[length = 8]
				 *
				 * for row in gameboard
				 * 		for cell in row
				 * 			if cell == gamepiece
				 * 			 increase score[row.index]
				 * 			 increase score[2 + col.index]
				 * 			 if (0, 0 || 2, 2)	
				 * 			 	increase dia 1
				 * 			 if (0, 2 || 2, 0)
				 *				increase dia 2
				 *
				 * if cell in gameboard == 3
				 * 	win
				 */

			}
		}
	}

	// Consider Object.apply()
	const CreateGame = (playerSigil, oppSigil) => {
		const game = new Game()
		const board = new Board(game)
		const player = new Player(playerSigil, game, board)
		const opponent = new Player(oppSigil, game, board)
		const newGame = {game, board, player, opponent}
		gameArchive.push(newGame)
		return newGame
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
	let scoreX = 0;
	let scoreY = 0;
	const Move = (x, y) => {
		if (game.placements[x][y] == " "){
			game.placements[x][y] = gamePiece
			board.Update()
		} else {
			Engine.Error("move")
		}
	}

	return {gamePiece, game, board, scoreX, scoreY, Move}
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

