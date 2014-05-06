/**
 * ChatUsers
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	autoPK: false,
	adapter: "memory",
	attributes: {

		id:{
			type: "integer",
			primaryKey: true
		},
		username:{
			type: "string"
		},
		rating: {
			type: "integer"
		},
		favorites: {
			type: "integer"
		},
		time: {
			type: "integer", // seconds
			defaultsTo: 30 //30 s for speaker
		},
		status: {
			type: "string",
			in: ["viewing", "queuing", "speaking","participant"],
         /*
         * 1 speaking, 4 queuing, 2 viewing, and any login is participant
         * 
         */
         defaultsTo: "participant"
		},

		loadRating: function(cb){
			var self = this;
			Votes.find({toUserId: self.id}).done(function(error, votes){
				if(error){
					cb(error);
				}else{
					self.rating = _.reduce(votes, function(r, v){return r + v.value;}, 0);

					self.save(function(error){
						if(error){
							cb(error);
						}else{
							cb();
						}
					});
				}

			})
		},

		loadFavorites: function(cb){
			var self = this;
			Favorites.find({toUserId: self.id}).done(function(error, favorites){
				if(error){
					cb(error);
				}else{
					self.favorites = favorites.length;
					self.save(function(error){
						if(error){
							cb(error);
						}else{
							cb();
						}
					});

				}

			})
		}

	}

};
