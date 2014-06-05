// ,,,,,,,,, ,,,
// ,,,,,,,, ,,,  Copyright:
// ,,,     ,,,          This source is subject to the Designveloper JSC
// ,,,    ,,,           All using or modify must have permission from us.
// ,,,   ,,,            http://designveloper.com
// ,,,,,,,,
// ,,,,,,,       Name:  DSVScriptTemplate
// Purpose:
//          Save all chat user
// Class:
//          ChatUsers
// Functions:
//          loadRating ; loadFavorite ;
// Called From:
//          (script) : all controller and sails.config.socket
// Author:
//          Nhien Phan(nhienpv@designveloper.com)
// Notes:
//
// Changelog:
//          05/27/2014 - Nhien Phan - Init first revision.
// =============================================================================

module.exports = {
  // All properties fields of model
  autoPK: false,
  adapter: "memory",
  attributes: {

    id: {
      type: "integer",
      primaryKey: true
    },
    username: {
      type: "string"
    },
    rating: {
      type: "integer"
    },
    favorites: {
      type: "integer"
    },
    time: {
      type: "integer", // seconds
      defaultsTo: 30 //30 s for speaker
    },
    status: {
      type: "string",
      in: ["viewing", "queuing", "speaking", "participant"],
      /*
       * 1 speaking, 4 queuing, 2 viewing, and any login is participant
       *
       */
      defaultsTo: "participant"
    },
    // load rating / vote count of user
    loadRating: function (cb) {
      var self = this;
      Votes.find({
        toUserId: self.id
      }).done(function (error, votes) {
        if (error) {
          cb(error);
        } else {
          self.rating = _.reduce(votes, function (r, v) {
            return r + v.value;
          }, 0);

          self.save(function (error) {
            if (error) {
              cb(error);
            } else {
              cb();
            }
          });
        }

      })
    },
    // not in use this function
    loadFavorites: function (cb) {
      var self = this;
      Favorites.find({
        toUserId: self.id
      }).done(function (error, favorites) {
        if (error) {
          cb(error);
        } else {
          self.favorites = favorites.length;
          self.save(function (error) {
            if (error) {
              cb(error);
            } else {
              cb();
            }
          });
        }
      })
    }
  }
};
