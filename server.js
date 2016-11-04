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
	// todo this will change once app is completed and ready to serve
	res.sendFile(__dirname + "/public/index.html");
});


app.post("/api/signup", (req, res) => {
	console.log("hit signup api", req.body);
	if(!req.body.email || !req.body.password) {
		res.send({message: "error, invalid email or password"});
	}
	User.find({$or:[{email: req.body.email}, {name: req.body.username}]}, (err, user) => {
		if (user.length === 0) {
			var newUser = new User({
				email: req.body.email,
				name: req.body.username,
				password: req.body.password,
				score: 0
			});
			newUser.save((err)=> {
				if(err) {
					console.log(err);
					res.status(500);
					res.send({error: "error registering new user"});
					return;
				}
				res.send({message: "successfully added new user"});
			});
		} else if (err) {
			console.log(err);
			res.status(500);
			res.send({error: "internal server error"});
			return;
		} else {
			res.send({error: "User already exists"});
		}
	});
});

app.post("/api/login", (req, res) => {
	console.log(req.body);
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
			user[0].password = "";
			req.session.user = user[0];
			res.send({message: "successfully logged in!", loggedIn: true, userData: user});
		} else {
			res.status(401);
			res.send({message: "invalid login", loggedIn: false});
		}
	});
});

app.post("/api/newGame", (req, res) => {
//todo: add verification
	var email = req.session.user.email;
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
			{currentGame: gameId,
			gameAdmin: true},
			{new: true},
			(err, data) => {
				if(err) {
					console.log(err);
					res.status(500);
					res.send({message: "error updating user"});
					return;
				}
				console.log("updated user", data);
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

app.post("/api/launch", (req, res) => {
	// todo add verification
	// todo write method for launching the game
	console.log(req.body);
	res.send({success: "success"});
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
