/**
 * Votes
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	autoUpdatedAt: false,
	//adapter: "memory",

	attributes: {
		
		id:{
			type: "integer",
			primaryKey: true
		},
		toUserId:{
			type: "integer"
		},
		fromUserId:{
			type: "integer"
		},
		value: {
			type: "integer",
			in: [1,-1]
		},
		loadVote: function(cb){
			var self = this;
			Votes.find({toUserId: self.id}).done(function(error, votes){
				if(error){
					cb(error);
				}else{
					self.value = _.reduce(votes, function(r, v){return r + v.value;}, 0);

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

	}

};
