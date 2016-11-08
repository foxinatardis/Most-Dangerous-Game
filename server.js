/*jshint esversion: 6*/

var express = require("express"),
	bodyParser = require("body-parser"),
	session = require("express-session");
var mongoose = require("mongoose");

var app = express();


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
	var name = req.session.user.name;
	var newGame = new Game({
		players: [name]
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
			{name: name},
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

app.post("/api/joinGame", (req, res) => {

	if (!req.session.user.name) {
		res.status(500);
		res.send({error: true, message: "no session user name"});
	}
	Game.findByIdAndUpdate(
		req.body.gameId,
		{$push: {players: req.session.user.name}},
		{new: true},
		(err, data) => {
			if (err) {
				console.log("error in post /api/joinGame at Game.findByIdAndUpdate: ", err);
				res.status(500);
				res.send({error: true, message: "Failed to Join Game"});
			}
			User.findOneAndUpdate(
				{name: req.session.user.name},
				{currentGame: req.body.gameId},
				{new: true},
				(err, data) => {
					if (err) {
						console.log("error in post /api/joinGame at User.findOneAndUpdate: ", err);
						res.status(500);
						res.send({error: true, message: "Failed to join Game!"});
					}
					res.send({success: true, message: "Successfully joined game: " + data.currentGame});
				}
			);
		}
	);
});

app.get("/api/game", (req, res) => {
	// todo add verification
	var userEmail = req.session.user.email;
	User.find({email: userEmail}, (err, data) => {
		var gameId = data[0].currentGame;
		var admin = data[0].gameAdmin;
		Game.find({_id: gameId}, (err, data) => {
			var players = data[0].players;
			req.session.gameId = gameId;
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
	console.log("/api/launch req.body: ", req.body, req.session.gameId);
	Game.findById(
		req.session.gameId,
		"players",
		(err, data) => {
			if (err) {
				console.log("Error at /api/launch Game.findById: ", err);
				res.status(500);
				res.send({message: "error launching game... Sorry"});
			}
			console.log("line 196 data is: ", data);
			var shuffle = data.players;
			var j, x, i;
			for (i = shuffle.length; i; i--) {
				j = Math.floor(Math.random() * i);
				x = shuffle[i - 1];
				shuffle[i - 1] = shuffle[j];
				shuffle[j] = x;
			}
			Game.findByIdAndUpdate(
				req.session.gameId,
				{
					players: shuffle,
					inProgress: true
				},
				{new: true},
				(err, data) => {
					if (err) {
						console.log("error at /api/launch Game.findByIdAndUpdate: ", err);
						res.status(500);
						res.send({error: true, message: "Terribly sorry but I encountered an error whilst attempting to launch yur game."});
						return;
					}
					User.update(
						{name: {$in: shuffle}},
						{inGame: true},
						{multi: true},
						(err, data) => {
							if (err) {
								console.log("error with multiUser update /api/launch: ", err);
								res.status(500);
								res.send({error: true, message: "Error launching game"});
								return;
							}
							console.log("Data from multiUser update: ", data);
							res.send({success: true});
						}
					);
				}
			);
		}
	);

});

app.get("/api/target", (req, res) => {
	Game.findById(
		req.session.user.currentGame,
		(err, data) => {
			if (err) {
				console.log("error at get:/api/target Game.findById: ", err);
				res.status(500);
				res.send({error: true, message: "Error finding target!!!"});
			}
			var player = req.session.user.name;
			var players = data.players;
			var targetPlayer = "";
			for (var i = 0; i < players.length; i++) {
				console.log("in for loop");
				if (players[i] === player && i < (players.length - 1)) {
					targetPlayer = players[i + 1];
					console.log("met first if condition");
					break;
				} else if (players[i] === player && i === (players.length -1)) {
					console.log("met second if condition");
					targetPlayer = players[0];
					break;
				}
			}
			// todo update User to contain current target
			if (!targetPlayer) {
				res.status(500);
				res.send({error: true, message: "Failed to aquire target"});
			} else {
				User.findOneAndUpdate(
					{name: req.session.user.name},
					{currentTarget: targetPlayer},
					{new: true},
					(err, data) => {
						if(err) {
							console.log("error at /api/target User.findOneAndUpdate: ", err);
							res.status(500);
							res.send({error: true, message: "failed to find target"});
							return;
						}
						console.log(data.currentTarget);
						res.send({targetName: data.currentTarget});
					}
				);
			}
		}
	);
});

app.get("/api/target/location", (req, res) => {
	User.findOne(
		{name: req.session.user.currentTarget},
		"lastLatitude lastLongitude lastAccuracy lastTimestamp",
		(err, data) => {
			if (err) {
				console.log("error in api/target/loction at User.findOne", err);
				res.status(500);
				res.send({error: true, message: "failed to find target location"});
				return;
			}
			if (!data.lastLongitude) {
				res.send({message: "Target not found."});
				return;
			}
			res.send({
				latitude: data.lastLatitude,
				longitude: data.lastLongitude,
				accuracy: data.lastAccuracy,
				timestamp: data.lastTimestamp
			});
		}
	);
});

app.post("/api/location", (req, res) => {
	// todo add verifiaction
	console.log(req.body.location);
	User.findOneAndUpdate(
		{email: req.session.user.email},
		{
			lastLatitude: req.body.location.latitude,
			lastLongitude: req.body.location.longitude,
			lastAccuracy: req.body.location.accuracy,
			lastTimestamp: req.body.location.timestamp
		},
		{new: true},
		(err, data) => {
			if (err) {
				console.log("location post error from User.findOneAndUpdate: " + err);
				res.send({error: true, message: "failed to update location"});
			}
			res.send({message: "successfully posted location!"});
		}
	);
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



require('letsencrypt-express').create({
	server: 'staging',
	email: 'abellive@me.com',
	agreeTos: true,
	approveDomains: [ 'adamb.me' ],
	app: app
}).listen(8000, 8443);
