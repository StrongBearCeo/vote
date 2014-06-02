/**
 * ChatController
 *
 * @module      :: Controller
 * @description  :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

  //
  // ============================================================================
  // Copyright:
  //          This source is subject to the Designveloper JSC (designveloper.com)
  //          All using or modify must have permission from us.
  //
  // Name:    ChatController
  // Purpose:
  //          Processing all chat request
  // Class:
  //          ChatController
  // Functions:
  //          index ; join ; message ; debateJoin ; debateLeave ; reportSpam ; vote
  //  				getbancount ; favorite
  // Called From:
  //          (script) Another controller and socket
  // Author:
  //          Nhien Phan (nhienpv@designveloper.com)
  // Notes:
  //          Additional information [long version]
  // Changelog:
  //          05/28/2014 - Nhien Phan - Init first revision.
  // ============================================================================
  //

module.exports = {

  // -------------------------------------------------------------------
  // Index ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request form client to controller
  //            @res (object) server response to client
  // RETURNS:
  //            if request user : reponse user object and sRTMP to view
  //            else response to index
  // DEPENDENCIES:
  //            none
  // PURPOSE:
  //            Use this function in order to accomplish
  //            most wonderful things possible!
  // NOTES:
  //            none
  // REVISIONS:
  //            05/28/2014 - Initial release
  // -------------------------------------------------------------------

  index: function (req, res) {
    if (req.user) {
      sails.log.info("Give user to chat:" + JSON.stringify(req.user));
      res.view({
        user: req.user,
        sRTMP: sails.config.custom.sRTMP
      });
    } else {
      return res.redirect("/");
    }
  },

  // -------------------------------------------------------------------
  // join ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request form client to controller
  //						req: {id,username, rating, favorites}
  //            @res (object) server response to client
  //						res: error if have error, userList: All list userchat and
  //						usercurent: user has just create
  // RETURNS:
  //            if request socket :
  // 						Create user chat and save to ChatUsers Model, ChatUsers save all user chat
  // 						- if error: Response error to client if not create ChatUsers item
  // 						- if success: join chat for user create, find all user and response to client
  //
  // DEPENDENCIES:
  //            socketio, ChatUsers Model
  // PURPOSE:
  //            Use this function in order to accomplish
  //            most wonderful things possible!
  // NOTES:
  //            none
  // REVISIONS:
  //            05/28/2014 - Initial release
  // -------------------------------------------------------------------
  join: function (req, res) {
    if (!req.socket || Object.getOwnPropertyNames(req.session.passport).length === 0) {
      return;
    } else {
      sails.log.info("session User info: " + req.session.passport.user);
      ChatUsers.create({
        id: req.session.passport.user.id,
        username: req.session.passport.user.username,
        rating: req.session.passport.user.rating,
        favorites: sails.config.sockets.DEFAULT_FAVORITE
      }).done(function (error, user) {
        if (error) {
          sails.log.info("Error join chat:" + error);
          res.send({
            error: error
          });
        } else {
          sails.log.info("Join chat success for user:" + user.username);
          sails.config.sockets.onJoinChat(req.session, req.socket, user);
          ChatUsers.find().done(function (error, users) {
            if (error) {
              res.send({
                error: error
              });
            } else {
              res.send({
                currentUser: user,
                userList: users
              });
            }
          });
        }
      });
    }
  },
  // -------------------------------------------------------------------
  // message ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request socket
  //            @res (object) server response to client
  // RETURNS:
  //            Status header 200:
  //
  // DEPENDENCIES:
  //            socketio, Messages,Users Model, sails.config.socket.js
  // PURPOSE:
  //            Send message chat from a client user
  // NOTES:
  //            none
  // REVISIONS:
  //            05/30/2014 - Comments function
  // -------------------------------------------------------------------
  message: function (req, res) {

    if (!req.socket) {
      return;
    }

    Messages.create({
      fromUserId: req.session.passport.user.id,
      toUserId: req.param("toUserId"),
      text: req.param("text")
    }).done(function (error, message) {
      // send error if have
      if (error) {
        res.send({
          error: error
        });
      } else {
        var msg = message.toObject();
        Users.findOne({
          id: msg.fromUserId
        }).done(function (error, user) {
          if (user) {
            msg.fromUsername = user.username;
          } else {
            msg.fromUsername = "SYSTEM"
          }
          Users.findOne({
            id: msg.toUserId
          }).done(function (error, user) {
            if (user) {
              msg.toUsername = user.username;
            } else {
              msg.toUsername = "ALL";
            }
            // Call function onNewMessage sails.config.sockets.js
            sails.config.sockets.onNewMessage(req.session, req.socket, msg);
            sails.log.info("Message chat from:" + JSON.stringify(msg));
            res.send(200);
          })
        })

      }
    });

  },
  // -------------------------------------------------------------------
  // debateJoin ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request socket
  //            @res (object) server response to client
  // RETURNS:
  //            Send bSuccess
  //
  // DEPENDENCIES:
  //            sails.config.socket.js
  // PURPOSE:
  //            Call function onDebateJoin to room chat from user request
  // NOTES:
  //            none
  // REVISIONS:
  //            05/30/2014 - Comments function
  // -------------------------------------------------------------------
  //
  debateJoin: function (req, res) {
    if (!req.socket) {
      return;
    }
    sails.log.info("Join to room chat for user:" + JSON.stringify(req.session.passport.user));
    res.send({
      bSuccess: true
    });
    sails.config.sockets.onDebateJoin(req.session, req.socket);

  },

  // -------------------------------------------------------------------
  // debateLeave ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request socket
  //            @res (object) server response to client
  // RETURNS:
  //            Send bSuccess
  //
  // DEPENDENCIES:
  //            sails.config.socket.js
  // PURPOSE:
  //            Call function onDebateLeave to room chat from user request
  // NOTES:
  //            none
  // REVISIONS:
  //            05/30/2014 - Comments function
  // -------------------------------------------------------------------

  debateLeave: function (req, res) {
    if (!req.socket) {
      return;
    }

    sails.config.sockets.onDebateLeave(req.session, req.socket);
    res.send({
      bSuccess: true
    });
  },

  // -------------------------------------------------------------------
  // reportSpam ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request socket
  //            @res (object) server response to client
  // RETURNS:
  //            data: true if report to user success
  //
  // DEPENDENCIES:
  //            sails.config.socket.js, Model: Users Model
  // PURPOSE:
  //            Call function onDebateLeave to room chat from user request
  // NOTES:
  //            none
  // REVISIONS:
  //            05/30/2014 - Comments function
  // -------------------------------------------------------------------

  reportSpam: function (req, res) {

    var fromUserid = req.param('formUserID');
    var toUserid = req.param('toUserID');
    var value = req.param('value');
    //Find user name be report

    Report.findOne({
      fromUserId: fromUserid,
      toUserId: toUserid
    }).done(function (error, report) {
      if (report) {
        console.log("User had reported from:" + fromUserid + " to user: " + toUserid);
        res.send({report: false});
      }
      else {
        // Create new report spam
        Report.create({
          id: fromUserid.toString() + toUserid.toString(),
          fromUserId: fromUserid,
          toUserId: toUserid,
          value: value
        }).done(function (error, report) {
          if (report) {
            sails.log.info("Report saved success:" + JSON.stringify(report));
            //Update bancount for Users Model
            module.exports.updateNumberBanCount(toUserid);
            res.send({report: true});
          }
        });
      }
    });
  },
  // -------------------------------------------------------------------
  // updateNumberBanCount (userid)
  // PARAMETERS:
  //            @userid (int) id of user
  // RETURNS:
  // PURPOSE:
  //            Update number bancount of user if number >= to then update user
  //            status is blocked user
  // REVISIONS:
  //            6/2/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------

  updateNumberBanCount : function(userid)
  {
    Users.findOne({
      id: userid
    }).done(function (error, user) {
      // If have user then increase bancount + 1
      if (user) {
        user.bancount = user.bancount + 1;
        delete user.password;
        // If have user.bancount >= 10 then update status: blocked
        if (user.bancount >= 10) {
          sails.log.info("User:" + username + " had locked");
          user.status = "blocked";
        }
        // Save all data
        user.save(function (err, user) {});
      }
      if (error) {
        sails.log.info("Error report to user:" + username + " - " + error);
      }
    });
  },
  // -------------------------------------------------------------------
  // vote ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request socket
  //							toUserId: vote to user
  //							value vote: 1, -1 or 0
  //            @res (object) server response to client
  // RETURNS:
  //            data: is user be vote
  //
  // DEPENDENCIES:
  //            Model: Votes
  // PURPOSE:
  //            save vote to Votes Model if have the update value
  // 						if not found then create Votes
  // NOTES:
  //            none
  // REVISIONS:
  //            05/30/2014 - Comments function
  // -------------------------------------------------------------------
  vote: function (req, res) {
    // get info vote from client
    var toUserId = req.param("toUserId");
    var value = req.param("value");
    //action vote
    //if user had vote then update value vote
    Votes.findOne({
      fromUserId: req.session.passport.user.id
    }).done(function (error, votejs) {
      if (votejs) {
        votejs.value = value;
        votejs.save(function (error) {
          sails.log.info("Change value vote of User:" + votejs.username);
          return res.send({
            data: votejs
          }); //if success
        });
      } else {
        // if not create vote for fromUserId:toUserID: value
        // send error if have
        // send user create at Model: Votes to client
        Votes.create({
          fromUserId: req.session.passport.user.id,
          toUserId: toUserId,
          value: value
        }).done(function (error, vote) {
          if (error) {
            return res.send({
              error: error
            });
          } else {
            sails.log.info("Votes created success:" + JSON.stringify(vote));
            return res.send({
              data: vote
            }); //if success
          }
        })
      }
    });

  },

  // -------------------------------------------------------------------
  // getbancount ( req ; res )
  //
  // PARAMETERS:
  //            @req (object) request socket
  //							id: id of users
  //            @res (object)
  // RETURNS:
  //            send user find by id
  //
  // DEPENDENCIES:
  //            Model: Users
  // PURPOSE:
  //            Get Users bancount by user id
  // NOTES:
  //            none
  // REVISIONS:
  //            05/30/2014 - Comments function
  // -------------------------------------------------------------------
  getbancount: function (req, res) {
    Users.findOne({
      id: req.param('id')
    }).done(function (error, userban) {
      if (error) {

        return res.send({
          error: error
        });
      }
      if (userban) {
        res.send({
          userban: userban
        });
      }
    })

  },

  // Not use
  favorite: function (req, res) {
    var toUserId = req.param("toUserId");
    Favorites.findOne({
      fromUserId: req.session.passport.user.id,
      toUserId: toUserId
    }).done(function (error, favorite) {
      if (error) {
        return res.send({
          error: error
        });
      } else {
        if (favorite) { // unfavorite
          favorite.destroy(function (error) {
            if (error) {
              return res.send({
                error: error
              });
            } else {
              ChatUsers.findOne({
                id: toUserId
              }).done(function (error, user) {
                if (user) {
                  user.loadFavorites(function (error) {
                    sails.config.sockets.onUserUpdated(user);
                  });
                }
              })
              return res.send({
                bSuccess: true
              });
            }
          })
        } else { //favorite
          Favorites.create({
            fromUserId: req.session.passport.user.id,
            toUserId: toUserId
          }).done(function (error, favorite) {
            if (error) {
              return res.send({
                error: error
              });
            } else {
              ChatUsers.findOne({
                id: toUserId
              }).done(function (error, user) {
                if (user) {
                  user.loadFavorites(function (error) {
                    sails.config.sockets.onUserUpdated(user);
                  });
                }
              })
              return res.send({
                bSuccess: true
              });
            }
          })
        }
      }
    })
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ChatController)
   */
  _config: {}


};
