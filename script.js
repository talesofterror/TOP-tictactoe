
function Game () {
	let score = 0
	let turn = true
	// const placements = new Array(3).fill(new Array(3)) 
	// ^ not working as expected
	const placements = [["", "", ""], ["", "", ""], ["", "", ""]]

	return {score, turn, placements}
}

function Player (gamepiece, game, board) {
	const Move = (x, y) => {
		game.placements[x][y] = gamepiece
		board.Update()
	}

	return {gamepiece, game, board, Move}
}

const Engine = (function () {
	let gameArchive = []
	let currentGame = gameArchive[gameArchive.length-1]
	let turn = false
	const Evaluate = () => {

	}

	const CreateGame = (playerSigil, oppSigil) => {
		const game = new Game()
		const board = new Board(game)
		return {
			game,
			// game: new Game(),
			board,
			// board: new Board(this.game),
			player : new Player(playerSigil, game, board),
			opponent: new Player(oppSigil, game, board),
		}
	}

	return {gameArchive, currentGame, turn, Evaluate, CreateGame}
})()

function Board (game) {
	const Update = () => {
		console.log(game.placements[0])
		console.log(game.placements[1])
		console.log(game.placements[2])
		console.log(" ")
	}

	return {Update}
}


