
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
				else if (cell == target.player.gamePiece) {
					target.player.scoreX += target.game.placements[rowIndex].indexOf(cell) + 1
					target.player.scoreY += target.game.placements.indexOf(row) + 1
				}
				else if (cell == target.opponent.gamePiece) {
					target.opponent.scoreX += target.game.placements[rowIndex].indexOf(cell)
					target.opponent.scoreY += target.game.placements.indexOf(row)
				}
				if (target.player.scoreX == 6 || target.player.scoreY == 6 || (target.player.scoreX == 6 && target.player.scoreY == 6)){
					console.log("You win")
				}
				else if (target.opponent.scoreX == 6 || target.opponent.scoreY == 6 || (target.opponent.scoreX == 5 && target.player.scoreY == 6)){
					console.log("Computer wins")
				}
				else {
					console.log("no winner")
				}

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

