
function Game () {
	let score = 0
	let turn = true
	// const placements = new Array(3).fill(new Array(3)) 
	// ^ not working as expected
	const placements = [["", "", ""], ["", "", ""], ["", "", ""]]
	return {score, turn, placements}
}

function Player (game, board, gamepiece) {
	const Move = (x, y) => {
		game.placements[x][y] = gamepiece
		board.Update()
	}

	return {gamepiece, Move}
}

const logic = (function () {
	
	return {a: "b"}
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

let currentGame = new Game()
let currentBoard = new Board(currentGame)
let currentPlayer = new Player(currentGame, currentBoard, "x")
let currentOpponent = new Player(currentGame, currentBoard, "o")
currentBoard.Update()
currentPlayer.Move(1, 2)

