// -------------------------------------------------------------------
// Votes Models( parameter1 ; parameter2 )
// PARAMETERS:
// METHODS:
// PURPOSE:
//          Save Votes for User in 15s will calculation and remote all vote rows
// REVISIONS:
//            6/2/14 - nhienphan - Initial revision
// -------------------------------------------------------------------

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
		}
	}
};
