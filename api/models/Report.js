// ============================================================================
// ,,,,,,,,, ,,,
// ,,,,,,,, ,,,  Copyright:
// ,,,     ,,,          This source is subject to the Designveloper JSC
// ,,,    ,,,           All using or modify must have permission from us.
// ,,,   ,,,            http://designveloper.com
// ,,,,,,,,
// ,,,,,,,       Name:  DSVScriptTemplate
// Purpose:
//          Save all report each other user
// Class:
//          Report Model
// Functions:
//          None
// Called From:
//          (script) any Controller and sails.config.sockets
// Author:
//          Nhien Phan (nhienpv@designveloper.com)
// Notes:
//
// Changelog:
//          05/30/2014 - Nhien Phan - Init first revision.
// ============================================================================
//

module.exports = {

  attributes: {
      id:{
          type: "string",
          primaryKey: true
      },
      fromUserId:{
          type: "integer"
      },
      toUserId:{
          type: "integer"
      },
      value: {
          type: "integer",
          in: [0,1]
      }
  }
};

