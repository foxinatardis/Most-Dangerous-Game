/* jshint esversion: 6 */

module.exports = (mongoose) => {
   var UserSchema = new mongoose.Schema({ // creates a new mongoose schema called UserSchema
      name: String,
      email: String,
      password: String,
	  score: Number,
	  currentGame: String, //holds id of current game
	  inGame: Boolean, // if true, current game has been launched
	  gameAdmin: Boolean,  //true if admin of current game
	  gameHistory: [String],
	  lastLocation: String,
   });

   var User = mongoose.model('User', UserSchema); // create a new model called 'User' based on 'UserSchema'

   return User;
};
