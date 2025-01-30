
const Engine = (function () {
	let gameArchive = []
	let currentGame = gameArchive[gameArchive.length-1]
	let turn = false

	function Evaluate (target) {
		ResetScore(target)
		let gamePlacements = target.game.placements

		for (let row = 0; row < gamePlacements.length; row ++) { // rows

			for (let col = 0; col < gamePlacements[row].length; col++) {

				if (gamePlacements[row][col] != " ") {
					let playerPlacement = gamePlacements[row][col] 
						== target.player.gamePiece ? true : false
					let diagonalLeft = (row == 0 && col == 0) || (row == 2 && col == 2)
					let diagonalRight = (row == 2 && col == 0) || (row == 0 && col == 2)
					let centerPlacement = (row == 1 && col == 1)
					if (playerPlacement) {
						target.player.score[row]++
						target.player.score[3 + col]++
						if (diagonalLeft) {target.player.score[6]++}
						if (diagonalRight) {target.player.score[7]++}
						if (centerPlacement) { 
							target.player.score[6]++
							target.player.score[7]++
						}
					} else {

					}
				} else { continue }

			}

		}


	/*
	 * score array: 
	 * [0] = row 1, [1] = row 2, [2] = row 3
	 * [3] = col 1, [4] = col 2, [5] = col 3
	 * [6] = dia L, [7] = dia R
	 *
	 * array playerScore[length = 8]
	 * array oppScore[length = 8]
	 *
	 * score[all] = 0
	 *
	 * for row in gameboard
	 * 		for cell in row
	 * 			if cell == gamepiece
	 * 			 increase score[row.index]
	 * 			 increase score[3 + col.index]
	 * 			 if (0, 0 || 2, 2)	
	 * 			 	increase dia 1
	 * 			 if (0, 2 || 2, 0)
	 *				increase dia 2
	 *			 if (1, 1)
	 *			 	increase dia 1 & 2
	 *
	 * if score[any] == 3
	 * 	win
	 */

	/*
	 * for (let i = 0; i < target.game.placements)
	 * */

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

	function ResetScore (game) {
		game.player.score.fill(0)
		game.opponent.score.fill(0)
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
	const Move = (x, y) => {
		if (game.placements[x][y] == " "){
			game.placements[x][y] = gamePiece
			board.Update()
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

