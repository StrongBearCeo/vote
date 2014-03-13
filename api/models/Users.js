/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
	beforeCreate: function(values, next) {
		values.password = hashPassword(values.password);
		next();
	},
	beforeUpdate: function(values, next) {
		if (values.password) {
			values.password = hashPassword(values.password);
			next();
		}else {
			User.findOne(values.id).done(function(err, user) {
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
