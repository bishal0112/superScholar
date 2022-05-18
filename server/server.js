const express = require("express");
const app = express();

const PORT = 3000;

let boards = [];

app.use(express.json());
app.get("/boards", (req, res) => {
	res.send(boards);
});
app.post("/boards", (req, res) => {
	if (!req.body.title) {
		return res.status(400).json({
			error: "Missing Title",
		});
	}
	const newBoard = {
		id: boards.length + 1,
		stage: 1,
		title: req.body.title,
	};
	boards.push(newBoard);

	res.json("Created Kanban Board Item");
});

app.put("/boards/:id", (req, res) => {
	let id = req.params.id;
	if (req.body.stage > 3) {
		return res.status(400).json({
			error: "Accepted Stage Less than 4",
		});
	}
	boards[id - 1]["stage"] = req.body.stage;

	res.json(boards[id - 1]);
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});

module.exports = app;
