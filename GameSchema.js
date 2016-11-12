/* jshint esversion: 6 */

module.exports = (mongoose) => {
	var GameSchema = new mongoose.Schema({ // creates a new mongoose schema called UserSchema
		creator: String,
		startDate: String,
		endDate: String,
		players: [String],
		activePlayers: [String],
		inProgress: Boolean,
		kills: [String]
	});

	var Game = mongoose.model('Game', GameSchema); // create a new model called 'User' based on 'UserSchema'

	return Game;
};
