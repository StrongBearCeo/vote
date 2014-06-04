/**
 * MainController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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
// ============================================================================
// ,,,,,,,,, ,,,
// ,,,,,,,, ,,,  Copyright:
// ,,,     ,,,          This source is subject to the Designveloper JSC
// ,,,    ,,,           All using or modify must have permission from us.
// ,,,   ,,,            http://designveloper.com
// ,,,,,,,,
// ,,,,,,,       Name:  DSVScriptTemplate
// Purpose:
//          Processing main
// Class:
//          MainController
// Functions:
//          index, signup, login, logout, confirm
// Called From:
//          (script) any
// Author:
//          Ha Truong (truongvieth@designveloper.com)
// Notes:
//          Additional information [long version]
// Changelog:
//          05/27/2014 - Ha Truong - Init first revision.
// ============================================================================

module.exports  = {
    // -------------------------------------------------------------------
    // index ( req ; res )
    //
    // PARAMETERS:
    //            @req (object) request from client
    //            @res (object) response to client
    // RETURNS:
    //            (view chat): if isset req.user
    //            
    // DEPENDENCIES:
    //            none
    // PURPOSE:
    //            Router for request main url site
    // NOTES:
    //            none
    // REVISIONS:
    //            05/30/14 - Initial release
    // -------------------------------------------------------------------
    index: function(req, res) {
        if (req.user) {
            return res.redirect("/chat");

        } else {
            res.locals.notifications = _.clone(req.session.notifications);
            req.session.notifications = {};
            res.view();
        }
    },
    // -------------------------------------------------------------------
    // signup ( req ; res )
    //
    // PARAMETERS:
    //            @req (object) request from client
    //            username: post request from client
    //            password: post request from client
    //            confirmPassword: post request from client
    //            email: post email request from client
    //            @res (object) response to client
    // RETURNS:
    //            (/):
    //              
    //            
    // DEPENDENCIES:
    //            Models: Users
    // PURPOSE:
    //            Register new user
    // NOTES:
    //            none
    // REVISIONS:
    //            05/30/14 - Initial release
    // -------------------------------------------------------------------
    signup: function(req, res) {
        var username = req.param("username");
        var password = req.param("password");
        var confirmPassword = req.param("confirmPassword");
        var email = req.param("email");

        if (password != confirmPassword) {
            req.session.notifications = {
                signup: {
                    message: "Passwords do not match."
                }

            }
            return res.redirect("/");
        }

        Users.findByUsername(username).done(function(err, usr) {
            if (err) {
                req.session.notifications = {
                    signup: {
                        message: "DB Error"
                    }
                }
                return res.redirect("/");
            } else if (usr.length) {
                req.session.notifications = {
                    signup: {
                        message: "Username already taken."
                    }
                }
                return res.redirect("/");

            } else {
                Users.create({
                    username: username,
                    password: password,
                    email: email
                }).done(function(error, user) {
                    if (error) {
                        req.session.notifications = {
                            signup: error
                        }
                        return res.redirect("/");
                    } else {
                        return res.redirect("/");
                    }
                });
            }
        })

    },
    // -------------------------------------------------------------------
    // login ( req ; res )
    //
    // PARAMETERS:
    //            @req (object) request from client
    //            username: post request from client
    //            password: post request from client
    //            provider: post request from client
    //            @res (object) response to client
    // RETURNS:
    //            (/):
    //              
    //            
    // DEPENDENCIES:
    //            Models: Users
    //            modules: passport
    // PURPOSE:
    //            User login to website, check rule and return
    // NOTES:
    //            none
    // REVISIONS:
    //            05/30/14 - Initial release
    // -------------------------------------------------------------------
    login: function(req, res) {
        passport = require("passport");
        var username = req.param("username");
        var password = req.param("password");
        var provider = req.param("provider");
        //if use provider and not found
        if (["local", "twitter", "facebook"].indexOf(provider) == -1) {
            sails.log.info("provider request from client not found");
            req.session.notifications = {
                login: {
                    message: "Invalid provider."
                }
            }
            return res.redirect("/");
        }


        if (req.user) {
            module.exports.onLeaveChat(req.user.id);
        }

        passport.authenticate(provider, function(error, user, info) {
            if (error) {
                sails.log.info("Error login with provider:" + provider + "User:" + username);
                req.session.notifications = {
                    login: error
                }
                return res.redirect("/");
            }

            if (!user) {
                req.session.notifications = {
                    login: {
                        message: info.sError
                    }
                }
                return res.redirect("/");
            }


            req.logIn(user, function(err) {
                if (err) {
                    req.session.notifications = {
                        login: {
                            message: "Login error."
                        }
                    }
                    return res.redirect("/");
                } else {
                    return res.redirect("/chat");
                }
            });

        })(req, res);
    },
    // -------------------------------------------------------------------
    // logout ( req ; res )
    //
    // PARAMETERS:
    //            @req (object) request logout from client
    //            @res (object) response to client
    // RETURNS:
    //            (/):            
    // DEPENDENCIES:
    //     
    // PURPOSE:
    //            Logout site for user
    // NOTES:
    //            none
    // REVISIONS:
    //            05/30/14 - Initial release
    // -------------------------------------------------------------------
    logout: function(req, res) {
        //sails.log.info("Logout success for user:" + req.session.password.user);
        req.logout();
        return res.redirect("/");
    },
    // not in use
    confirm: function(req, res) {

    },

  // ============================================================================
  // ,,,,,,,,, ,,,
  // ,,,,,,,, ,,,  Copyright:
  // ,,,     ,,,          This source is subject to the Designveloper JSC
  // ,,,    ,,,           All using or modify must have permission from us.
  // ,,,   ,,,            http://designveloper.com
  // ,,,,,,,,
  // ,,,,,,,       Name:  DSVScriptTemplate
  // Purpose:
  //          Processing all request socket from client and response
  // Class:
  //          Sockets
  // Functions:
  //
  // Called From:
  //          Any controller
  // Author:
  //          Nhien Phan (nhienpv@designveloper.com)
  // Notes:
  //
  // Changelog:
  //          03/06/2014 - Nhien Phan - Init first revision.
  // ============================================================================


  // Order user join chat
  nOrder: 10,
  nTimerID: null,
  // The first time used talking 15s
  TOTAL_TALK: 15000,
  // Count report spam, 10
  REPORT_SPAM: 0,
  // Total spam count out
  REPORT_SPAM_OUT: 10,
  // Action after 15s
  TIME_ACTION: 15000,
  // Time for speaking user, default speaker 30s
  TOTAL_SPEAKER_TIME: 30,
  // Time increase for speaking user if vote up
  TIME_ENCREASE: 15,
  // Total talk out
  TIME_OUT_ALL_TALK: 120000,
  DEFAULT_RATING: 0,
  DEFAULT_FAVORITE: 0,

  // -------------------------------------------------------------------
  // onInit()
  // PARAMETERS:
  // RETURNS:
  // PURPOSE:
  //            Call function onChatTimer cut down -1s
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  onInit: function () {
    module.exports.nTimerID = setInterval(module.exports.onChatTimer, 1000);
  },

  // -------------------------------------------------------------------
  // onChatTimer()
  // PARAMETERS:
  // RETURNS:
  // PURPOSE:
  //            call function manageSpeaker for cut down time 1
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  onChatTimer: function () {
    module.exports.manageSpeaker(-1);
  },

  // This custom onConnect function will be run each time AFTER a new socket connects
  // (To control whether a socket is allowed to connect, check out `authorization` config.)
  // Keep in mind that Sails' RESTful simulation for sockets
  // mixes in socket.io events for your routes and blueprints automatically.
  onConnect: function (session, socket) {
    // By default: do nothing
    // This is a good place to subscribe a new socket to a room, inform other users that
    // someone new has come online, or any other custom socket.io logic
    //this.onTest();
  },

  // -------------------------------------------------------------------
  // onJoinChat ( sesstion ; socket; user )
  // PARAMETERS:
  //            @sesstion (object) session of user login chat
  //            @socket (object) socket client of user login chat
  //            @user (object) user request join chat
  // RETURNS:
  //
  // PURPOSE:
  //            join user request to chat room, then update position and
  //            update chat flash
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  onJoinChat: function (session, socket, user) {
    socket.join('chatroom');
    //listen disconnect from client
    socket.on("disconnect", function () {
      //listen disconnect from client then call onLeaveChat for user disconnect
      sails.log.info("Disconnect from chat of user:" + user.id);
      module.exports.onLeaveChat(user.id);
    });
    sails.log.info("Update chat list for user:"+ JSON.stringify(user));
    module.exports.onUserUpdated(user);
  },

  // -------------------------------------------------------------------
  // onLeaveChat ( userId)
  // PARAMETERS:
  //            @userId: Id of user leavechat
  // RETURNS:
  // PURPOSE:
  //            leave chat remove user form ChatUsers
  //            and emit to client "userRemoved"
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  onLeaveChat: function (userId) {
    ChatUsers.findOne({id: userId}).done(function (error, user) {
      if (user) {
        user.destroy(function (err) {
          sails.log.info("onLeaveChat user:" + userId);
          sails.io.sockets.in('chatroom').emit('userRemoved', {userId: userId});
        })
      }
    });
  },

  // -------------------------------------------------------------------
  // changeStatusUserDebate(user)
  // PARAMETERS:
  //            @user(object): user change status
  // RETURNS:
  //            (bool) True or False based on proper
  // PURPOSE:
  //          config status for user joindebate to chat
  //          if have user: viewing < 2 then join to viewing
  //          if have user: queuing < 4 then join to queuing
  //          if have user: speaking = 0 then join to speaking
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  changeStatusUserDebate: function (user) {
    ChatUsers.find({status: "viewing"}).done(function (error, userchats) {
      if (userchats.length <= 1) {//limit for 2 user is viewing 0 and 1
        user.status = "viewing";
        user.order = module.exports.nOrder++;//nOrder default 0
        user.save(function (err) {
          module.exports.onUserUpdated(user);
          ChatUsers.find({status: "queuing"}).done(function (error, userqueuing) {
            //limit for 4 user is queuing
            if (userqueuing.length <= 3) {
              user.status = "queuing";
              user.order = module.exports.nOrder++;//nOrder default 0
              user.save(function (err) {
                module.exports.onUserUpdated(user);
                ChatUsers.find({status: "speaking"}).done(function (error, userspeaking) {
                  //limit for 1 user is speaking
                  if (userspeaking.length < 1) {
                    user.status = "speaking";
                    user.order = module.exports.nOrder++;//nOrder default 0
                    user.save(function (err) {
                      module.exports.onUserUpdated(user);
                    });
                  }//end if < 1 speaking
                });//end status speaking
              });//end save
            }//end if < 4 queuing
          });//end status queuing
        });
      }//end if <= 1 viewing
      else {
        console.log("No place that joint to debate:"+JSON.stringify(userchats));
      }
    });
  },

  // -------------------------------------------------------------------
  // customFunctionName ( session ; socket )
  // PARAMETERS:
  //            @session (object): session of user
  //            @socket (object): socket of client user
  // RETURNS:
  // PURPOSE:
  //            Change status user participant to queuing system
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  onDebateJoin: function (session, socket) {
    ChatUsers.findOne(
      {
        id: session.passport.user.id
      }).done(function (error, user) {
        if (user && user.status == "participant") {
          //if current user is participant in user chat list join to viewing
          module.exports.changeStatusUserDebate(user);
        }//end participant
      })
  },

  // -------------------------------------------------------------------
  // onUserUpdated:( user )
  // PARAMETERS:
  //            @user (object): user update position and flash queuing system
  // RETURNS:
  // PURPOSE:
  //            Emit event to client change position and queuing system
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------

  onUserUpdated: function (user) {
    sails.io.sockets.in('chatroom').emit('userUpdated', {user: user});
  },

  // -------------------------------------------------------------------
  // onDebateLeave: ( parameter1 ; parameter2 )
  // PARAMETERS:
  //            @session(object): session of client conntect
  //            @socket (object): socket of user connect to server
  // RETURNS:
  // PURPOSE:
  //            if speaker onDebateLeave change: s
  //              eapking or queing --> participant
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------

  onDebateLeave: function (session, socket) {
    ChatUsers.findOne({id: session.passport.user.id}).done(function (error, user) {
      if (user && user.status != "participant") {
        user.status = "participant";
        user.save(function (err) {
          module.exports.onUserUpdated(user);
          module.exports.manageSpeaker();
        });
      }
    });
  },

  // -------------------------------------------------------------------
  // clearVoting:()
  // PARAMETERS:
  // RETURNS:
  // PURPOSE:
  //            Clear all vote after calcula 15s
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------

  clearVoting: function () {
    Votes.destroy({}).done(function (err) {
      if (err) {
        return console.log(err);
      } else {
      }
    });
  },


  // -------------------------------------------------------------------
  // getReportSpam ( speaker; callback)
  // PARAMETERS:
  //            @callback function: when return done
  //            @speaker: user check number ban
  // RETURNS:
  //            (bool) False if have not user ban
  //            (object: user) if have user ban
  // PURPOSE:
  //            return user have number bancount > REPORT_SPAM_OUT
  //            if >= number spam out then return user
  //              els return false if not have user
  //              REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  getReportSpam: function (speaker, callback) {
    Users.findOne({id: speaker.id}).done(function (error, user_banned) {
      if (user_banned) {
        if (user_banned.bancount >= module.exports.REPORT_SPAM_OUT) {
          callback(user_banned);
        }
        else {
          callback(false);
        }
      }
    });
  },
  getCurrentViewingUser: function (callback) {

  },
  // -------------------------------------------------------------------
  // nextQueuingSystem( speaker )
  // PARAMETERS:
  //            @speaker: speaker is next queuing
  // RETURNS:
  // PURPOSE:
  //            // When speaking user end time out 30s or vote down 15s
  //            If have user viewing
  //              Change user speaking to viewing
  //              Change user queuing to speaking
  //              Change user viewing to queuing
  //            else
  //            Prevent user status to queuing
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------

  nextQueuingSystem: function (speaker) {
    ChatUsers.findOne({status: "viewing"}).done(function (err, userFirst) {
      if (userFirst) {
        //set user on speaking to viewing
        speaker.status = "viewing";
        speaker.order = module.exports.nOrder++;
        speaker.save(function (err) {
          module.exports.onUserUpdated(speaker);
          //set next speaker speaking from queuing
          module.exports.nextSpeaker();
          //set next speaker user form view to queuing
          ChatUsers.findOne({id: userFirst.id}).done(function (err, userViewsCurent) {
            if (userViewsCurent) {
              userViewsCurent.order = module.exports.nOrder++;
              userViewsCurent.status = "queuing";
              userViewsCurent.save(function (err, queuingUser) {
                module.exports.onUserUpdated(queuingUser);
              });
            }
          });
        });
      } else {
        speaker.order = module.exports.nOrder++;//nOrder default 0
        speaker.status = "queuing";
        speaker.save(function (err) {
          //console.log("Speak user change:"+speaker.username);
          module.exports.onUserUpdated(speaker);
          module.exports.nextSpeaker();
          //
        });
      }
    });
  },

  // -------------------------------------------------------------------
  // manageSpeaker( nTimeDelta)
  // PARAMETERS:
  //            @nTimeDelta(int); Time down -1
  // RETURNS:
  // PURPOSE:
  //            Check realtime if
  //              Have user ban by report: leave chat this user and banned
  //              Calculating vote after 15s speaking of user
  //              Change queuing system speaking user if total talk time over 2 minute
  //              Set Queuing System of all userchat
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  manageSpeaker: function (nTimeDelta) {
    // Check if user be bancount then leave this user
    // Callback function getReportSpam of list ChatUsers
    ChatUsers.find().done(function (error, baneduser) {
      if (baneduser && baneduser.length > 0) {
        for (var i = 0; i < baneduser.length; i++) {
          module.exports.getReportSpam(baneduser[i], function (bannedUserReturn) {
            if (bannedUserReturn) {
              sails.log.info("User be banned, Leave this user"+ bannedUserReturn.username);
              module.exports.onLeaveChat(bannedUserReturn.id);
              //if this user ban is speaking then nextspeaker
              if (bannedUserReturn.username == "speaking") {
                module.exports.nextSpeaker();
                module.exports.nextParticipant();
              }
              //module.exports.nextQueuingSystem(speaker);
            }
            else {

            }//end else check banned user spam
          });//end function get report spam
        }//end for
      }
      if (error) {
        console.log("ERROR" + error);
      }

    });//end find user banned
    ChatUsers.findOne({status: "speaking"}).done(function (error, speaker) {
      if (speaker) {
        if (nTimeDelta === undefined) {
          nTimeDelta = 0;
        }
        speaker.time += nTimeDelta;
        //console.log("Time left:"+speaker.time);
        if (speaker.time % 15 == 0) {
          Users.findOne({id: speaker.id}).done(function (err, user) {
            if (user) {
              var sum = 0;
              Votes.find({toUserId: speaker.id}).done(function (error, votes) {
                if (error) {
                  //
                } else {
                  sum = _.reduce(votes, function (r, v) {
                    return r + v.value;
                  }, 0);
                  var newscore = sum;
                  user.rating += sum;
                  delete user.password;
                  user.save(function (err) {
                  });
                  if (newscore > 0) {
                    if (module.exports.TOTAL_TALK >= module.exports.TIME_OUT_ALL_TALK) {
                      module.exports.nextQueuingSystem(speaker);
                    } else {
                      module.exports.TOTAL_TALK += module.exports.TIME_ACTION;
                      speaker.time = speaker.time + module.exports.TIME_ENCREASE;
                      speaker.rating += sum;
                      speaker.save(function (err, returnUserSave) {
                        module.exports.onUserUpdated(returnUserSave);
                        module.exports.clearVoting();
                      });
                    }
                  } else if (newscore < 0) {
                    speaker.rating += sum;
                    speaker.save(function (err, returnUserSave) {
                      module.exports.clearVoting();
                    });
                    module.exports.nextQueuingSystem(speaker);
                  } else {

                    if (speaker.time == 0) {
                      module.exports.nextQueuingSystem(speaker);

                    }
                    else {
                      speaker.save(function (err) {

                      });
                    }
                    module.exports.clearVoting();
                  }
                }//else not error
              });
            }
          });
        }//if % 15s
        else {
          //update time for speaker realtime
          speaker.save(function (err) {
          });
        }//end if % 15s
      }
      else {
        //if have user speaking or next
        module.exports.nextSpeaker();
      }
    });//end find user status speaking
  },
  // -------------------------------------------------------------------
  // nextQueuing(s)
  // PARAMETERS:
  // RETURNS:
  // PURPOSE:
  //            Set user have status viewing to queuing
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  nextQueuing: function () {
    ChatUsers.findOne({status: "viewing"}).done(function (error, users) {
      //if have users queuing
      users.status = "queuing";
      users.save(function (err, speakingUser) {
        sails.log.info("User has just change status to queuing:"+ JSON.stringify(speakingUser));
        module.exports.onUserUpdated(speakingUser);
      });
      //end if
    });
  },

  // -------------------------------------------------------------------
  // nextParticipant()
  // PARAMETERS:
  // RETURNS:
  // PURPOSE:
  //            Select user have status participant then change status for
  //            this user
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  nextParticipant: function () {
    ChatUsers.findOne({status: "participant"}).done(function (error, users) {
      module.exports.changeStatusUserDebate(users);
    });
  },

  // -------------------------------------------------------------------
  // nextSpeaker( )
  // PARAMETERS:
  // RETURNS:
  // PURPOSE:
  //            Set user have status queuing to speaking
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  nextSpeaker: function () {
    ChatUsers.find({status: "queuing"}).done(function (error, users) {
      //if have users queuing
      if (users && users.length) {
        users = _.sortBy(users, function (value) {
          var compare = "";
          switch (value.status) {
            case "speaking":
              compare += "0" + value.order;
              break;
            case "queuing":
              compare += "1" + value.order;
              break;
            case "viewing":
              compare += "2" + value.order;
              break;
          }
          return parseInt(compare);
        });
        //set speaking user is: speaker is first of users
        speaker = _.first(users);
        // Set default speaker time 30s
        speaker.time = module.exports.TOTAL_SPEAKER_TIME;
        // Set time talked alway is 15s
        module.exports.TOTAL_TALK = 15000;
        speaker.status = "speaking";
        speaker.save(function (err, speakingUser) {
          sails.log.info("User speaking is:"+ speaker.username);
          // Update position and status to client
          module.exports.onUserUpdated(speakingUser);
          // when user change to speaking then clear all vote, reset vote to this user
          sails.io.sockets.in('chatroom').emit('clearVoteSystem', {bClear: 1});
        });
      }//end if
    });
  },

  // -------------------------------------------------------------------
  // customFunctionName ( session ; socket; message )
  // PARAMETERS:
  //            @sesstion (object) this session of browser
  //            @socket (object) socket connect of all client and server
  //            @message (string) text message to client
  // RETURNS:
  // PURPOSE:
  //            imit newMessage to client
  // REVISIONS:
  //            6/3/14 - nhienphan - Initial revision
  // -------------------------------------------------------------------
  onNewMessage: function (session, socket, message) {
    sails.io.sockets.in('chatroom').emit('newMessage', {message: message});
  },

  // This custom onDisconnect function will be run each of time a socket disconnect
  onDisconnect: function (session, socket) {
    // By default: do nothing
    // This is a good place to broadcast a disconnect message,
    // or any other custom socket.io logic
  },


  /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to MainController)
     */
    //_config: {}
};
//module.exports = MainController;
