/**
 * Messages
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
		fromUserId:{
			type: "integer",
			defaultsTo: 0 // 0 - FROM SYSTEM
		},
		toUserId:{
			type: "integer",
			defaultsTo: 0 // 0 - TO ALL USERS
		},
		text: {
			type: "string"
		}
	}

};
