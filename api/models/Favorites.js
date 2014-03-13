/**
 * Favorites
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  
	autoUpdatedAt: false,

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
		}

	}

};
