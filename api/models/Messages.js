/**
 * Messages
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
//          Save message chat of each user
// Class:
//          Message Model
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

module.exports = {
  	autoUpdatedAt: false,
    // attributes of each fiels model
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
