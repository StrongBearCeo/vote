/**
 * Schedule
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	autoCreatedAt: false,
  	autoUpdatedAt: false,

	attributes: {
		
		id:{
			type: "integer",
			primaryKey: true
		},
		title: "string",
		description: "string",
		category:"string",
		startAt:"datetime",
		endAt:"datetime"

	}

};
