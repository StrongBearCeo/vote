/**
 * Schedule
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
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
//          Save schedule of each user
// Class:
//          Schedule Model
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
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: "integer",
      primaryKey: true
    },
    title: "string",
    description: "string",
    category: "string",
    startAt: "datetime",
    endAt: "datetime"

  }
};
