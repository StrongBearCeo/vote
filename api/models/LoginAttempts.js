/**
 * LoginAttempts
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
//          Save loginatemt of each user
// Class:
//          LoginAtempts Model
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
    // attributes of model
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
