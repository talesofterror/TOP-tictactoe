const game = (function () {
	let score = 0
	let turn = true
	const placements = new Array(3).fill(new Array(3))

	return {score, turn, placements}
})()

function player (gamepiece) {
	const Move = (x, y) => {
		game.placements[x][y] = gamepiece
	}

	return {gamepiece, Move}
}
