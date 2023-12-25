import { Chess } from "/js/chess.js";
const correctDialog = document.getElementById("correct");
const incorrectDialog = document.getElementById("incorrect");
const endDialog = document.getElementById("end");
let board = Chessboard("board", {
	draggable: false,
	position: "start",
	moveSpeed: 500,
});

let game = new Chess();
let pgn = Math.floor(Math.random() * 45); // del 0 al 44
let pgnFile = "games/" + pgn + ".pgn";
let moves = [];
let currentMove = 0;
console.log(pgn);
function nextMove() {
	if (currentMove < moves.length) {
		let move = moves[currentMove];
		game.move(move);
		board.position(game.fen());
	} else {
		showEndDialog();
	}
}

function validateInput() {
	let move = document.querySelector("#move-input-button").value;
	if (move === moves[currentMove]) {
		addCorrectMoveToTable(currentMove + 1, move);
		currentMove++;
		$("#move-input-button").val("");
		showCorrectDialog();
	} else {
		showIncorrectDialog();
	}
}

function addCorrectMoveToTable(moveNumber, moveText) {
	let table = $("#moves-list");

	if (moveNumber % 2 !== 0) {
		var newRow = "<tr><td>" + Math.ceil(moveNumber / 2) + "</td>";
		newRow += "<td>" + moveText + "</td>";
		newRow += "<td></td></tr>";
		table.append(newRow);
	} else {
		var lastRow = table.find("tr:last");
		lastRow.find("td:last").text(moveText);
	}
}

function showCorrectDialog() {
	correctDialog.showModal();
}

function showIncorrectDialog() {
	incorrectDialog.showModal();
}

function showEndDialog() {
	endDialog.showModal();
}

document
	.getElementById("correct")
	.querySelector("button")
	.addEventListener("click", function () {
		correctDialog.close();
	});

document
	.getElementById("incorrect")
	.querySelector("button")
	.addEventListener("click", function () {
		incorrectDialog.close();
	});

document
	.getElementById("end")
	.querySelector("button")
	.addEventListener("click", function () {
		endDialog.close();
	});

document
	.querySelector("#move-input")
	.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			validateInput();
		}
	});
document.querySelector("#submit-move").addEventListener("click", validateInput);

document.querySelector("#nextmove").addEventListener("click", nextMove);

document.addEventListener("DOMContentLoaded", function () {
	fetch(pgnFile)
		.then((response) => response.text())
		.then((pgn) => {
			game.load_pgn(pgn);
			let header = game.header();
			console.log(header);
			moves = game.history();
			$("#whitename").text(header.White);
			$("#blackname").text(header.Black);
			game.reset();
			nextMove();
		});
});
