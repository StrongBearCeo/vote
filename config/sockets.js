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

module.exports.sockets = {
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
    sails.config.sockets.nTimerID = setInterval(sails.config.sockets.onChatTimer, 1000);
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
    sails.config.sockets.manageSpeaker(-1);
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
      sails.config.sockets.onLeaveChat(user.id);
    });
    sails.log.info("Update chat list for user:"+ JSON.stringify(user));
    sails.config.sockets.onUserUpdated(user);
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
        user.order = sails.config.sockets.nOrder++;//nOrder default 0
        user.save(function (err) {
          sails.config.sockets.onUserUpdated(user);
          ChatUsers.find({status: "queuing"}).done(function (error, userqueuing) {
          //limit for 4 user is queuing
            if (userqueuing.length <= 3) {
              user.status = "queuing";
              user.order = sails.config.sockets.nOrder++;//nOrder default 0
              user.save(function (err) {
                sails.config.sockets.onUserUpdated(user);
                ChatUsers.find({status: "speaking"}).done(function (error, userspeaking) {
                //limit for 1 user is speaking
                  if (userspeaking.length < 1) {
                    user.status = "speaking";
                    user.order = sails.config.sockets.nOrder++;//nOrder default 0
                    user.save(function (err) {
                      sails.config.sockets.onUserUpdated(user);
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
          sails.config.sockets.changeStatusUserDebate(user);
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
          sails.config.sockets.onUserUpdated(user);
          sails.config.sockets.manageSpeaker();
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
        if (user_banned.bancount >= sails.config.sockets.REPORT_SPAM_OUT) {
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
        speaker.order = sails.config.sockets.nOrder++;
        speaker.save(function (err) {
          sails.config.sockets.onUserUpdated(speaker);
          //set next speaker speaking from queuing
          sails.config.sockets.nextSpeaker();
          //set next speaker user form view to queuing
          ChatUsers.findOne({id: userFirst.id}).done(function (err, userViewsCurent) {
            if (userViewsCurent) {
              userViewsCurent.order = sails.config.sockets.nOrder++;
              userViewsCurent.status = "queuing";
              userViewsCurent.save(function (err, queuingUser) {
                sails.config.sockets.onUserUpdated(queuingUser);
              });
            }
          });
        });
      } else {
        speaker.order = sails.config.sockets.nOrder++;//nOrder default 0
        speaker.status = "queuing";
        speaker.save(function (err) {
          //console.log("Speak user change:"+speaker.username);
          sails.config.sockets.onUserUpdated(speaker);
          sails.config.sockets.nextSpeaker();
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
          sails.config.sockets.getReportSpam(baneduser[i], function (bannedUserReturn) {
            if (bannedUserReturn) {
              sails.log.info("User be banned, Leave this user"+ bannedUserReturn.username);
              sails.config.sockets.onLeaveChat(bannedUserReturn.id);
              //if this user ban is speaking then nextspeaker
              if (bannedUserReturn.username == "speaking") {
                sails.config.sockets.nextSpeaker();
                sails.config.sockets.nextParticipant();
              }
              //sails.config.sockets.nextQueuingSystem(speaker);
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
                    if (sails.config.sockets.TOTAL_TALK >= sails.config.sockets.TIME_OUT_ALL_TALK) {
                      sails.config.sockets.nextQueuingSystem(speaker);
                    } else {
                      sails.config.sockets.TOTAL_TALK += sails.config.sockets.TIME_ACTION;
                      speaker.time = speaker.time + sails.config.sockets.TIME_ENCREASE;
                      speaker.rating += sum;
                      speaker.save(function (err, returnUserSave) {
                        sails.config.sockets.onUserUpdated(returnUserSave);
                        sails.config.sockets.clearVoting();
                      });
                    }
                  } else if (newscore < 0) {
                    speaker.rating += sum;
                    speaker.save(function (err, returnUserSave) {
                      sails.config.sockets.clearVoting();
                    });
                    sails.config.sockets.nextQueuingSystem(speaker);
                  } else {

                    if (speaker.time == 0) {
                      sails.config.sockets.nextQueuingSystem(speaker);

                    }
                    else {
                      speaker.save(function (err) {

                      });
                    }
                    sails.config.sockets.clearVoting();
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
        sails.config.sockets.nextSpeaker();
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
        sails.config.sockets.onUserUpdated(speakingUser);
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
      sails.config.sockets.changeStatusUserDebate(users);
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
        speaker.time = sails.config.sockets.TOTAL_SPEAKER_TIME;
        // Set time talked alway is 15s
        sails.config.sockets.TOTAL_TALK = 15000;
        speaker.status = "speaking";
        speaker.save(function (err, speakingUser) {
          sails.log.info("User speaking is:"+ speaker.username);
          // Update position and status to client
          sails.config.sockets.onUserUpdated(speakingUser);
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

  // `transports`
  //
  // A array of allowed transport methods which the clients will try to use.
  // The flashsocket transport is disabled by default
  // You can enable flashsockets by adding 'flashsocket' to this list:
  transports: [
    'websocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling'
  ],

  // Use this option to set the datastore socket.io will use to manage rooms/sockets/subscriptions:
  // default: memory
  adapter: 'memory',

  // Node.js (and consequently Sails.js) apps scale horizontally.
  // It's a powerful, efficient approach, but it involves a tiny bit of planning.
  // At scale, you'll want to be able to copy your app onto multiple Sails.js servers
  // and throw them behind a load balancer.
  //
  // One of the big challenges of scaling an application is that these sorts of clustered
  // deployments cannot share memory, since they are on physically different machines.
  // On top of that, there is no guarantee that a user will "stick" with the same server between
  // requests (whether HTTP or sockets), since the load balancer will route each request to the
  // Sails server with the most available resources. However that means that all room/pubsub/socket
  // processing and shared memory has to be offloaded to a shared, remote messaging queue (usually Redis)
  //
  // Luckily, Socket.io (and consequently Sails.js) apps support Redis for sockets by default.
  // To enable a remote redis pubsub server:
  // adapter: 'redis',
  // host: '127.0.0.1',
  // port: 6379,
  // db: 'sails',
  // pass: '<redis auth password>'
  // Worth mentioning is that, if `adapter` config is `redis`,
  // but host/port is left unset, Sails will try to connect to redis
  // running on localhost via port 6379

  // `authorization`
  //
  // Global authorization for Socket.IO access,
  // this is called when the initial handshake is performed with the server.
  //
  // By default (`authorization: true`), when a socket tries to connect, Sails verifies
  // that a valid cookie was sent with the upgrade request.  If the cookie doesn't match
  // any known user session, a new user session is created for it.
  //
  // However, in the case of cross-domain requests, it is possible to receive a connection
  // upgrade request WITHOUT A COOKIE (for certain transports)
  // In this case, there is no way to keep track of the requesting user between requests,
  // since there is no identifying information to link him/her with a session.
  //
  // If you don't care about keeping track of your socket users between requests,
  // you can bypass this cookie check by setting `authorization: false`
  // which will disable the session for socket requests (req.session is still accessible
  // in each request, but it will be empty, and any changes to it will not be persisted)
  //
  // On the other hand, if you DO need to keep track of user sessions,
  // you can pass along a ?cookie query parameter to the upgrade url,
  // which Sails will use in the absense of a proper cookie
  // e.g. (when connection from the client):
  // io.connect('http://localhost:1337?cookie=smokeybear')
  //
  // (Un)fortunately, the user's cookie is (should!) not accessible in client-side js.
  // Using HTTP-only cookies is crucial for your app's security.
  // Primarily because of this situation, as well as a handful of other advanced
  // use cases, Sails allows you to override the authorization behavior
  // with your own custom logic by specifying a function, e.g:
  /*
   authorization: function authorizeAttemptedSocketConnection(reqObj, cb) {

   // Any data saved in `handshake` is available in subsequent requests
   // from this as `req.socket.handshake.*`

   //
   // to allow the connection, call `cb(null, true)`
   // to prevent the connection, call `cb(null, false)`
   // to report an error, call `cb(err)`
   }
   */
  authorization: true,

  // Match string representing the origins that are allowed to connect to the Socket.IO server
  origins: '*:*',

  // Should we use heartbeats to check the health of Socket.IO connections?
  heartbeats: true,

  // When client closes connection, the # of seconds to wait before attempting a reconnect.
  // This value is sent to the client after a successful handshake.
  'close timeout': 60,

  // The # of seconds between heartbeats sent from the client to the server
  // This value is sent to the client after a successful handshake.
  'heartbeat timeout': 60,

  // The max # of seconds to wait for an expcted heartbeat before declaring the pipe broken
  // This number should be less than the `heartbeat timeout`
  'heartbeat interval': 25,

  // The maximum duration of one HTTP poll-
  // if it exceeds this limit it will be closed.
  'polling duration': 20,

  // Enable the flash policy server if the flashsocket transport is enabled
  // 'flash policy server': true,

  // By default the Socket.IO client will check port 10843 on your server
  // to see if flashsocket connections are allowed.
  // The Adobe Flash Player normally uses 843 as default port,
  // but Socket.io defaults to a non root port (10843) by default
  //
  // If you are using a hosting provider that doesn't allow you to start servers
  // other than on port 80 or the provided port, and you still want to support flashsockets
  // you can set the `flash policy port` to -1
  'flash policy port': 10843,

  // Used by the HTTP transports. The Socket.IO server buffers HTTP request bodies up to this limit.
  // This limit is not applied to websocket or flashsockets.
  'destroy buffer size': '10E7',

  // Do we need to destroy non-socket.io upgrade requests?
  'destroy upgrade': true,

  // Should Sails/Socket.io serve the `socket.io.js` client?
  // (as well as WebSocketMain.swf for Flash sockets, etc.)
  'browser client': true,

  // Cache the Socket.IO file generation in the memory of the process
  // to speed up the serving of the static files.
  'browser client cache': true,

  // Does Socket.IO need to send a minified build of the static client script?
  'browser client minification': false,

  // Does Socket.IO need to send an ETag header for the static requests?
  'browser client etag': false,

  // Adds a Cache-Control: private, x-gzip-ok="", max-age=31536000 header to static requests,
  // but only if the file is requested with a version number like /socket.io/socket.io.v0.9.9.js.
  'browser client expires': 315360000,

  // Does Socket.IO need to GZIP the static files?
  // This process is only done once and the computed output is stored in memory.
  // So we don't have to spawn a gzip process for each request.
  'browser client gzip': false,

  // Optional override function to serve all static files,
  // including socket.io.js et al.
  // Of the form :: function (req, res) { /* serve files */ }
  'browser client handler': false,

  // Meant to be used when running socket.io behind a proxy.
  // Should be set to true when you want the location handshake to match the protocol of the origin.
  // This fixes issues with terminating the SSL in front of Node
  // and forcing location to think it's wss instead of ws.
  'match origin protocol': false,

  // Direct access to the socket.io MQ store config
  // The 'adapter' property is the preferred method
  // (`undefined` indicates that Sails should defer to the 'adapter' config)
  store: undefined,

  // A logger instance that is used to output log information.
  // (`undefined` indicates deferment to the main Sails log config)
  logger: undefined,

  // The amount of detail that the server should output to the logger.
  // (`undefined` indicates deferment to the main Sails log config)
  'log level': undefined,

  // Whether to color the log type when output to the logger.
  // (`undefined` indicates deferment to the main Sails log config)
  'log colors': undefined,

  // A Static instance that is used to serve the socket.io client and its dependencies.
  // (`undefined` indicates use default)
  'static': undefined,

  // The entry point where Socket.IO starts looking for incoming connections.
  // This should be the same between the client and the server.
  resource: '/socket.io'

};
