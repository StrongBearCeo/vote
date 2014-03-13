/**
 * LoginAttempts
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
		userId:{
			type: "integer"
		},
		ip:{
			type: "string"
		},
		result:{
			type: "string",
			in: ["success", "fail"]
		}
	}

};
