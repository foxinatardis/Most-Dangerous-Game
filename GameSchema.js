/* jshint esversion: 6 */

module.exports = (mongoose) => {
   var GameSchema = new mongoose.Schema({ // creates a new mongoose schema called UserSchema
	   creator: String,
	   players: [String],
	   inProgress: Boolean,
	   
   });

   var Game = mongoose.model('Game', GameSchema); // create a new model called 'User' based on 'UserSchema'

   return Game;
};
