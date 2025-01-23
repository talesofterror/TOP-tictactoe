
const Engine = (function () {
	let gameArchive = []
	let currentGame = gameArchive[gameArchive.length-1]
	let turn = false

	const Evaluate = (target) => {
		for (row of target.game.placements) {
			for (cell of row) {
				/*
				 * if CELL == " "
				 * 	continue
				 * if CELL == target.player.gamePiece
				 * 	player.{x: +row.indexOf()+1, y: +cell.indexOf()+1}
				 *
				 * if key of player.{x || y || (x && y)} == 5
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

function Player (gamepiece, game, board) {
	const Move = (x, y) => {
		if (game.placements[x][y] == " "){
			game.placements[x][y] = gamepiece
			board.Update()
		} else {
			Engine.Error("move")
		}
	}

	return {gamepiece, game, board, Move}
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


