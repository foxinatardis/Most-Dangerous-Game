/*jshint esversion: 6*/

var express = require("express"),
	bodyParser = require("body-parser"),
	session = require("express-session");
var mongoose = require("mongoose");

var app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost");

//pull in models for mongo
var User = require("./UserSchema.js")(mongoose);
var Game = require("./GameSchema.js")(mongoose);

//basic config for body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//basic config for express-session
app.use(session({
	secret: "wiufhn49qeiurhfn249fuewindq298ef2n0eo",
	saveUninitialized: false,
	resave: false
}));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", (req, res) => {
	console.log("hit signup api", req.body);
	if(!req.body.email || !req.body.password) {
		res.send({message: "error, invalid email or password"});
	}
	User.find({email: req.body.email}, (err, user) => {
		if (user.length === 0) {
			var newUser = new User({
				email: req.body.email,
				password: req.body.password
			});
			newUser.save((err)=> {
				if(err) {
					console.log(err);
					res.status(500);
					res.send({message: "error registering new user"});
					return;
				}
				res.send({message: "successfully added new user"});
			});
		} else if (err) {
			console.log(err);
			res.status(500);
			res.send({message: "internal server error"});
			return;
		} else {
			res.send({status: "error", message: "User already exists"});
		}
	});
});

app.post("/login", (req, res) => {
	if(!req.body.email || !req.body.password){
		res.send({message: "error, please provide valid login"});
		return;
	}
	User.find({email: req.body.email}, (err, user) => {
		if(user.length === 0) {
			res.send({message: "error, user not found", loggedIn: false});
			return;
		}
		if(user[0].password === req.body.password) {
			req.session.email = user[0].email;
			res.send({message: "successfully logged in!", loggedIn: true});
		} else {
			res.status(401);
			res.send({message: "invalid login", loggedIn: false});
		}
	});
});

app.post("/newGame", (req, res) => {
//todo: add verification
	console.log("hit /newGame api");
	var email = req.session.email || "me@me.me";
	var newGame = new Game({
		players: [email]
	});

	newGame.save((err) => {
		if (err) {
			console.log(err);
			res.status(500);
			res.send({message: "error saving new game"});
			return;
		}

		var gameId = newGame._id;

		User.findOneAndUpdate(
			{email: email},
			{currentGame: gameId},
			(err, data) => {
				if(err) {
					console.log(err);
					res.status(500);
					res.send({message: "error updating user"});
					return;
				}
				res.send({gameId: gameId});
			}
		);
	});
});

app.get("/api/game", (req, res) => {
	// todo add verification
	var userEmail = req.session.email || "me@me.me";
	User.find({email: userEmail}, (err, data) => {
		var gameId = data[0].currentGame;
		var admin = data[0].gameAdmin;
		Game.find({_id: gameId}, (err, data) => {
			var players = data[0].players;
			res.send({
				gameId: gameId,
				gameAdmin: admin,
				players: players
			});
		});
	});

});

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
	console.log("file not found");
	res.status(404);
	res.send("File not found. You need additional stealth.");
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500);
	res.send("500 Error: Killed by ninjas");
});

app.listen(PORT, () => {
	console.log("Server started on Port: " + PORT);
});
