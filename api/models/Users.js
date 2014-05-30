/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
// ============================================================================
// ,,,,,,,,, ,,,
// ,,,,,,,, ,,,  Copyright:
// ,,,     ,,,          This source is subject to the Designveloper JSC
// ,,,    ,,,           All using or modify must have permission from us.
// ,,,   ,,,            http://designveloper.com
// ,,,,,,,,
// ,,,,,,,       Name:  DSVScriptTemplate
// Purpose:
//          Save user info of each user
// Class:
//          User Model
// Functions:
//          None
// Called From:
//          (script) any Controller and sails.config.sockets
// Author:
//          Nhien Phan (nhienpv@designveloper.com)
// Notes:
//
// Changelog:
//          05/27/2014 - Nhien Phan - Init first revision.
// ============================================================================
//


// -------------------------------------------------------------------
// hashPassword ( req ; res )
//
// PARAMETERS:
//            @password (string): input password
// RETURNS:
//            Password hash encode
// DEPENDENCIES:
//            modules: password-hash
// PURPOSE:
//            Encode password of user
// NOTES:
//            none
// REVISIONS:
//            05/28/2014 - Initial release
// -------------------------------------------------------------------
function hashPassword(password) {
	var hasher = require("password-hash");
	return hasher.generate(password);
}

module.exports = {
	autoCreatedAt: false,
  	autoUpdatedAt: false,
	attributes: {
		id:{
			type: "integer",
			primaryKey: true
		},
		username: {
			type: "string",
			required: true
		},
		email: {
			type: "email",
			required: true
		},
		password: {
			type: "string",
			required: true
		},
		rating: {
			type: "integer",
			defaultsTo: 0
		},
		bancount: {
			type: "integer",
			defaultsTo: 0
		},
		provider: {
			type: "string",
			in: ["local", "facebook", "twitter"],
			defaultsTo: "local"
		},
		status: {
			type: "string",
			in: ["active", "pendding", "blocked"],
			defaultsTo: "active"
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		},
		validPassword: function(password) {
			var obj = this.toObject();
			var hasher = require("password-hash");
			return hasher.verify(password, obj.password);
		}
	},
	 // Lifecycle Callbacks
    // Before create User
	beforeCreate: function(values, next) {
		values.password = hashPassword(values.password);
		next();
	},
    // Before Update User
	beforeUpdate: function(values, next) {
		if (values.password) {
			values.password = hashPassword(values.password);
			next();
		}else {
			Users.findOne(values.id).done(function(err, user) {
				if (err) {
					next(err);
				}else {
					values.password = user.password;
					next();
				}
			});
		}
	}

};
