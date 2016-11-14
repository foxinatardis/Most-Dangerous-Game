/*jshint esversion: 6*/

var express = require("express"),
	bodyParser = require("body-parser"),
	session = require("express-session");
var mongoose = require("mongoose");

var app = express();

var http = express();

// set up a route to redirect http to https
http.get('*', (req,res) => {
	res.redirect('https://adamb.me'+req.url);
});

http.listen(8000);
//
var fs = require("fs");
var https = require("https");
var options = {
	key:fs.readFileSync("./adamb.key"),
	cert: fs.readFileSync("./adamb.crt"),
	ca: fs.readFileSync("./adamb.ca-bundle")
};
httpsPort = 8443;

var secureServer = https.createServer(options, app);

var io = require("socket.io")(secureServer);

var connectedUsers = {}; // to store sockets of connected players


mongoose.connect("mongodb://localhost");

//pull in models for mongo
var User = require("./UserSchema.js")(mongoose);
var Game = require("./GameSchema.js")(mongoose);

//basic config for body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//basic config for express-session
app.use(session({
	secret: require("./secret.js"),
	saveUninitialized: false,
	resave: false
}));

app.get("/", (req, res) => {
	// todo this will change once app is completed and ready to serve
	res.sendFile(__dirname + "/public/dist/index.html");
});

// app.get("/.well-known/acme-challenge/TPM9TOp3anX5P0YEtSGQ07iiKvjhfTH7bMj0kGbTKaM", (req, res)=> {
// 	res.sendFile(__dirname + "/.well-known/acme-challenge/TPM9TOp3anX5P0YEtSGQ07iiKvjhfTH7bMj0kGbTKaM");
// });
//
// app.get("/.well-known/acme-challenge/zAnoH5durfAVFuzi4exhvkUyTxTETQjCC0WfxW1AYEU", (req, res) => {
// 	res.sendfile(__dirname + "/.well-known/acme-challenge/zAnoH5durfAVFuzi4exhvkUyTxTETQjCC0WfxW1AYEU");
// });


app.post("/api/signup", (req, res) => {
	console.log("hit signup api", req.body);
	if(!req.body.email || !req.body.password) {
		res.send({error: true, message: "error, invalid email or password"});
	} else if (req.body.password.length < 8 || !req.body.email.includes("@")) {
		res.send({error: true, message: "error, invalid email or password"});
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
					// res.status(500);
					res.send({error: true, message: "error registering new user"});
					return;
				}
				res.send({user: {email: req.body.email, name: req.body.username, score: 0}});
			});
		} else if (err) {
			console.log(err);
			// res.status(500);
			res.send({error: true, message: "internal server error"});
			return;
		} else {
			res.send({error: true, message: "User already exists"});
		}
	});
});

app.post("/api/login", (req, res) => {
	if(!req.body.email || !req.body.password){
		res.send({error: true, message: "error, please provide valid login"});
		return;
	}
	User.find({email: req.body.email}, (err, user) => {
		if(user.length === 0) {
			res.send({error: true, message: "error, user not found", loggedIn: false});
			return;
		}
		if(user[0].password === req.body.password) {
			user[0].password = "";
			req.session.user = user[0];
			res.send({message: "successfully logged in!", loggedIn: true, userData: user});
		} else {
			// res.status(401);
			res.send({error: true, message: "invalid login", loggedIn: false});
		}
	});
});

app.get("/logout", (req, res) => {
	delete req.session.user;
	res.send({success: true});
});

app.post("/api/change-password", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	} else if (!req.body.oldPassword || !req.body.newPassword){
		// res.status(401);
		res.send({message: "Please provide valid credentials."});
		return;
	}
	User.findOneAndUpdate(
		{
			name: req.session.user.name,
			password: req.body.oldPassword
		},
		{
			password: req.body.newPassword
		},
		(err, data) => {
			if (err) {
				console.log("Error at /api/change-password at User.findOneAndUpdate: ", err);
				// res.status(500);
				res.send({message: "Failed to update password"});
			} else if (!data) {
				// res.status(401);
				res.send({message: "Please provide valid credentials."});
			} else {
				res.send({message: "Password successfully changed."});
			}
		}
	);
});

app.post("/api/leave-game", (req, res) => {
	if (!req.session.user.name) {
		res.redirect("/");
		return;
	} else if (!req.body) {
		res.send({error: true, message: "Couldn't find current game."});
		return;
	}
	User.findOneAndUpdate(
		{
			name: req.session.user.name
		},
		{
			currentGame: "",
			inGame: false,
			gameAdmin: false,
			currentTarget: ""
		},
		(err, data) => {
			if (err) {
				console.log("error at /api/leave-game User.findOneAndUpdate: ", err);
				res.send({error: true, message: "Failed to leave game."});
				return;
			} else if (!data) {
				res.status(401);
				res.send({message: "Womp Womp"});
				return;
			}
			Game.findByIdAndUpdate(
				data.currentGame,
				{$pull: {activePlayers: req.session.user.name}},
				(err, data) => {
					if (err) {
						console.log("Error at /api/leave-game Game.findByIdAndUpdate: ", err);
						res.send({message: "Failed to leave game"});
						return;
					} else if (!data) {
						res.send({message: "Failed to find game"});
						return;
					} res.send({message: "Game Abandoned"});
				}
			);
		}
	);
});

app.post("/api/newGame", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	let date = new Date();
	date = date.toString().split(" ");
	date.pop();
	date.pop();
	date = date.join(" ");
	var name = req.session.user.name;
	var newGame = new Game({
		creator: name,
		startDate: date,
		players: [name],
		activePlayers: [name],
		inProgress: false
	});

	newGame.save((err) => {
		if (err) {
			console.log(err);
			// res.status(500);
			res.send({error: true, message: "Error saving new game."});
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
					// res.status(500);
					res.send({error: true, message: "Error assigning new game."});
					return;
				}
				// console.log("updated user", data);
				res.send({gameId: gameId});
			}
		);
	});
});

app.post("/api/joinGame", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	User.findOne(
		{name: req.body.gameId},
		"currentGame",
		(err, data) => {
			if (err) {
				console.log("Error at /api/joinGame with finding user: ", err);
				// res.status(500);
				res.send({error: true, message: "Could not find game."});
				return;
			} else if (!data) {
				// res.status(500);
				res.send({error: true, message: "Could not find game."});
				return;
			}
			Game.findOneAndUpdate(
				{
					_id: data.currentGame,
					inProgress: false
				},
				{$push: {players: req.session.user.name, activePlayers: req.session.user.name}},
				{new: true},
				(err, data) => {
					if (err) {
						console.log("error in post /api/joinGame at Game.findByIdAndUpdate: ", err);
						// res.status(500);
						res.send({error: true, message: "Failed to Join Game"});
						return;
					} else if (!data) {
						res.send({error: true, message: "Game not found or already in progress."});
						return;
					}
					var gameId = data._id;
					User.findOneAndUpdate(
						{name: req.session.user.name},
						{currentGame: gameId},
						{new: true},
						(err, data) => {
							if (err) {
								console.log("error in post /api/joinGame at User.findOneAndUpdate: ", err);
								// res.status(500);
								res.send({error: true, message: "Failed to join Game!"});
							}
							res.send({success: true, message: "Successfully joined game: " + data.currentGame, gameId: data.currentGame});
						}
					);
				}
			);
		}
	);
});

app.get("/api/game", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	var userEmail = req.session.user.email;
	User.find({email: userEmail}, (err, data) => {
		var gameId = data[0].currentGame;
		var admin = data[0].gameAdmin;
		if (err) {
			console.log("error at /api/game User.find: ", err);
			// res.status(500);
			res.send({error: true, message: "Error finding user information, please logout and try again."});
			return;
		} else if (!data) {
			// res.status(500);
			res.send({error: true, message: "Error finding user information, please logout and try again."});
			return;
		}
		Game.find({_id: gameId}, (err, data) => {
			if (err) {
				console.log("error at /api/game Game.find: ", err);
				// res.status(500);
				res.send({error: true, message: "Error finding game information, please logout and try again."});
				return;
			} else if (!data) {
				// res.status(500);
				res.send({error: true, message: "Error finding game information, please logout and try again."});
				return;
			}
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
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	console.log("/api/launch req.body: ", req.body, req.session.gameId);
	Game.findById(
		req.body.gameId,
		"activePlayers",
		(err, data) => {
			console.log("launch game data is: ", data);
			if (err) {
				console.log("Error at /api/launch Game.findById: ", err);
				res.send({message: "error launching game... Sorry"});
				return;
			} else if (!data) {
				res.send({message: "error launching game... Sorry"});
				return;
			} else if (data.activePlayers.length < 3) {
				res.send({message: "Not enough players to launch game."});
				return;
			}
			var shuffle = data.activePlayers;
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
						// res.status(500);
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
								// res.status(500);
								res.send({error: true, message: "Error launching game"});
								return;
							}
							res.send({success: true});
						}
					);
				}
			);
		}
	);

});

app.get("/api/target", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	User.findOne(
		{email: req.session.user.email},
		"currentGame",
		(err, data) => {
			if (err) {
				console.log("Error at /api/target Iser.findOne: ", err);
				// res.status(500);
				res.send({error: true, message:"Error finding user information, please logout and try again."});
				return;
			} else if (!data) {
				// res.status(500);
				res.send({error: true, message:"Error finding user information, please logout and try again."});
				return;
			}
			Game.findById(
				data.currentGame,
				(err, data) => {
					if (err) {
						console.log("error at get:/api/target Game.findById: ", err);
						res.status(500);
						res.send({error: true, message: "Error finding target!!!"});
						return;
					}
					var player = req.session.user.name;
					var players = data.activePlayers;
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
					if (!targetPlayer) {
						// res.status(500);
						res.send({error: true, message: "Failed to aquire target"});
						return;
					} else {
						User.findOneAndUpdate(
							{name: req.session.user.name},
							{currentTarget: targetPlayer},
							{new: true},
							(err, data) => {
								if(err) {
									console.log("error at /api/target User.findOneAndUpdate: ", err);
									// res.status(500);
									res.send({error: true, message: "failed to find target"});
									return;
								}
								console.log(data.currentTarget);
								var targetName = data.currentTarget;
								User.findOne(
									{name: targetName},
									"lastLatitude lastLongitude lastAccuracy lastTimestamp",
									(err, data) => {
										if (err) {
											console.log("error in api/target/loction at User.findOne", err);
											// res.status(500);
											res.send({error: true, message: "failed to find target location", targetName: targetName});
											return;
										}
										if (!data.lastLongitude) {
											res.send({message: "Target not found.", targetName: targetName});
											return;
										}
										res.send({
											latitude: data.lastLatitude,
											longitude: data.lastLongitude,
											accuracy: data.lastAccuracy,
											timestamp: data.lastTimestamp,
											targetName: targetName
										});
									}
								);
							}
						);
					}
				}
			);
		}
	);
});

app.post("/api/location", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
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

app.get("/api/game-history", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	User.findOne(
		{name: req.session.user.name},
		"gameHistory",
		(err, data) => {
			if (err) {
				console.log("error at /api/game-history: ", err);
				// res.status(500);
				res.send({error: true, message: "Could not find game history."});
			} else if (!data) {
				// res.status(500);
				res.send({error: true, message: "No game history to display."});
			} else {
				res.send({history: data.gameHistory});
			}
		}
	);
});

app.post("/api/game-stats", (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
	Game.findById(req.body.gameId,
		(err, data) => {
			if (err) {
				console.log("error at /api/game-stats, id: " + req.body + " err: ", err);
				res.status(500);
				res.send({error: true, message: "Error finding game history"});
			} else if (!data) {
				res.status(500);
				res.send({error: true, message: "Error finding game history"});
			} else {
				res.send({game: data});
			}
		}
	);
});

io.on("connection", (socket) => {

	console.log("socket connected");

	socket.on("disconnect", () => {
		delete connectedUsers[socket._name];
		if (socket._score) {
			User.findOneAndUpdate(
				{name: socket._name},
				{
					lastLongitude: socket._long,
					lastLatitude: socket._lat,
					lastAccuracy: socket._acc,
					lastTimestamp: socket._time,
					score: socket._score
				},
				(err) => {
					if (err) {
						console.log("Err at disconnect with User.findOneAndUpdate: ", err);
					} else {
						console.log("socekt saved: " + socket._name);
					}
				}
			);
		} else {
			console.log("socket for user: " + socket._name + " disconnected without save.");
		}
	});

	socket.on("update-location", (data) => {
		// console.log("hit update-location socket", data);
		if (data.latitude) {
			socket._lat = data.latitude;
			socket._long = data.longitude;
			socket._time = data.time;
			socket._acc = data.accuracy;
			if (data.accuracy < 30) {
				socket._score += 5;
			}
		}
		socket.emit("score", socket._score);
		if (connectedUsers[socket._targetName]) {
			let targetSocket = connectedUsers[socket._targetName];
			let targetData = {
				targetName: socket._targetName,
				targetLat: targetSocket._lat,
				targetLong: targetSocket._long,
				targetAcc: targetSocket._acc,
				targetTime: targetSocket._time
			};
			socket.emit("target online", targetData);
		} else {
			socket.emit("target online", false);
		}

	});

	socket.on("join", (data) => {
		socket._name = data.name;
		socket._targetName = data.targetName;
		socket._lat = data.lat;
		socket._long = data.long;
		socket._time = data.time;
		socket._acc = data.acc;
		socket._score = data.score;
		connectedUsers[data.name] = socket;
		console.log("joined");
		if (connectedUsers[socket._targetName]) {
			let targetSocket = connectedUsers[socket._targetName];
			let targetData = {
				targetName: socket._targetName,
				targetLat: targetSocket._lat,
				targetLong: targetSocket._long,
				targetAcc: targetSocket._acc,
				targetTime: targetSocket._time
			};
			socket.emit("target online", targetData);
		} else {
			socket.emit("target online", false);
		}
	});

	socket.on("waiting", (data) => {
		console.log("hit socket 'waiting'");
		socket.join(data.gameId);
		console.log("Joined room: ", data.gameId);
		io.sockets.in(data.gameId).emit("update waiting", data.name);
	});

	socket.on("launch", (data) => {
		io.sockets.in(data).emit("launch");
	});

	socket.on("take aim", (data) => {
		console.log("hit take aim socket connection: ", data);
		var targetSocket = connectedUsers[data.targetName];
		if (!targetSocket) {
			console.log("targetSocketId not found");
			socket.emit("target online", targetSocket);
		} else {
			console.log("taking aim");
			targetSocket.emit("being watched", data.trackerName);
		}
	});

	socket.on("give aim", (data) => {
		console.log("giving aim to: ", data.trackerName);
		console.log("from: ", socket._name);
		let trackerSocket = connectedUsers[data.trackerName];
		if (trackerSocket) {
			let toSend = {
				targetLat: data.latitude,
				targetLong: data.longitude,
				targetAcc: data.accuracy,
				targetTime: data.time
			};
			trackerSocket.emit("target online", toSend);
		}
	});

	socket.on("attack", (data) => {
		console.log("attack attempted");
		let attempt = data.distance + data.accuracy;
		if (attempt > 100 || !connectedUsers[socket._targetName]) { // if distance+accuracy is too great or target is offline attempt fails
			socket.emit("attack result", false);
		} else {
			let result = Math.random() * attempt;
			if (result > 20) {
				socket.emit("attack result", false);
			} else {
				User.findOneAndUpdate(
					{
						name: socket._targetName
					},
					{
						inGame: false,
						$push: {gameHistory: data.gameId},
						currentGame: "",
						currentTarget: "",
						gameAdmin: false
					},
					(err, oldData) => {
						if (err) {
							console.log("error at socket attack first User.findOneAndUpdate");
							socket.emit("attack result", false);
						} else if (!oldData) {
							console.log("failed to find target user at socket attack");
							socket.emit("attack result", false);
						} else {
							if (connectedUsers[socket._targetName]) {
								connectedUsers[socket._targetName].emit("killed", socket._name);
								connectedUsers[socket._targetName].disconnect();
							}
							Game.findByIdAndUpdate(
								data.gameId,
								{
									$pull: {activePlayers: socket._targetName},
									$push: {kills: (socket._targetName + " taken out by: " + socket._name)}
								},
								{new: true},
								(err, newData) => {
									if (err) {
										console.log("error at socket attack, game update: ", err);
										socket.emit("attack result", false);
									} else if (newData.activePlayers.length > 1){
										console.log("attack success, new game data: ", newData);
										socket._score += 100;
										socket.emit("score", socket._score);
										socket.emit("attack result", true);
									} else {
										User.findOneAndUpdate(
											{name: socket._name},
											{
												inGame: false,
												$push: {gameHistory: data.gameId},
												currentGame: "",
												currentTarget: "",
												gameAdmin: false
											},
											(err, endData) => {
												if (err) {
													console.log("error updating last man standing", err);
												}
												let date = new Date();
												date = date.toString().split(" ");
												date.pop();
												date.pop();
												date = date.join(" ");
												Game.findByIdAndUpdate(
													data.gameId,
													{
														inProgress: false,
														endDate: date
													},
													(err, stuff) => {
														if (err) {
															console.log("error ending game after final kill: ", err);
														}
														socket._score += (newData.players.length * 10);
														socket.emit("end game");
													}
												);
											}
										);
									}
								}
							);
						}
					}
				);
			}
		}
	});

});

app.use(express.static(__dirname + '/public/dist'));

app.all('/*', function(req, res) { // todo change the route for this once the landing page is in place
	if (!req.session.user) {
		res.redirect("/");
		return;
	}
    res.sendFile(__dirname + '/public/dist/index.html');
});

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



secureServer.listen(httpsPort);
