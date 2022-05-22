const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db/boards.database");
const cors = require("cors");
const User = require("./register");
const passport = require("./passport");
const axios = require("axios");

sequelize.sync();

const app = express();

const PORT = 3000;

let boards = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const db = new sqlite3.Database("boards.sqlite3", sqlite3.OPEN_READWRITE);

router.post("/register", async (req, res) => {
	const user = new User({
		email: req.body.email,
		password: hashSync(req.body.password, 10),
	});

	await user.save().then((user) => {
		res.send({
			success: true,
			message: "User created Successfully",
			user: {
				id: user.id,
				email: user.email,
			},
		});
	});
});
router.post("/login", (req, res) => {
	console.log(req.body.email);
	User.findOne({ where: { email: req.body.email } }).then((user) => {
		if (!user) {
			return res.status(401).send({
				success: false,
				message: "Could not find the user.",
			});
		}

		if (!compareSync(req.body.password, user.password)) {
			return res.status(401).send({
				success: false,
				message: "Incorrect Password.",
			});
		}

		const payload = {
			email: user.email,
			id: user.id,
		};
		const token = jwt.sign(payload, "Key", { expiresIn: "7d" });

		return res.status(200).send({
			success: true,
			message: "Logged in Successfully.",
			token: "Bearer " + token,
		});
	});
});
app.post(
	"/boards",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
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
	},
);

app.put(
	"/boards/:id",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		let id = req.params.id;
		if (req.body.stage > 3) {
			return res.status(400).json({
				error: "Accepted Stage Less than 4",
			});
		}
		boards[id - 1]["stage"] = req.body.stage;

		res.json(boards[id - 1]);
	},
);
function verifyToken(req, res, next) {
	const bearerHeader = req.headers["authorization"];
	if (typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.statusCode = 403;
		res.send("Invalid or No JWT Token Provided for Authentication.");
	}
}
app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`);
});

module.exports = app;
