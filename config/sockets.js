/**
 * Socket Configuration
 *
 * These configuration options provide transparent access to Sails' encapsulated
 * pubsub/socket server for complete customizability.
 *
 * For more information on using Sails with Sockets, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.sockets = {

	nOrder: 0, // Order speaker
	nTimerID: null,



	//include custom config
	TOTAL_TALK:15000,// the first time used talking 15s
	REPORT_SPAM:0, // count report spam, 10
	REPORT_SPAM_OUT:10,
	TIME_ACTION:15000, // action after 15s
	TOTAL_SPEAKER_TIME:30,// time for speaker, default speaker 30s
	TIME_ENCREASE :15, //time increase for speaking user 
	TIME_OUT_ALL_TALK : 120000,
	DEFAULT_RATING : 0,
	DEFAULT_FAVORITE : 0,
	//Set up time down -1s running cut down timer of speaking user
	onInit: function() {
		sails.config.sockets.nTimerID = setInterval(sails.config.sockets.onChatTimer,1000);
		
	},

	onChatTimer: function() {
		sails.config.sockets.manageSpeaker(-1);
	},

	// This custom onConnect function will be run each time AFTER a new socket connects
	// (To control whether a socket is allowed to connect, check out `authorization` config.)
	// Keep in mind that Sails' RESTful simulation for sockets 
	// mixes in socket.io events for your routes and blueprints automatically.
	onConnect: function(session, socket) {

	// By default: do nothing
	// This is a good place to subscribe a new socket to a room, inform other users that
	// someone new has come online, or any other custom socket.io logic
		//this.onTest();
	},
	//After login / disconect call: onJoinChat
	onJoinChat: function(session, socket, user) {
		//pending count user connect
		console.log("onJoinChat " + JSON.stringify(session) +"\n"+ socket.id);
		socket.join('chatroom');
		//listen disconnect from client
		socket.on("disconnect", function(){
			sails.config.sockets.onLeaveChat(user.id);
		});

		sails.config.sockets.onUserUpdated(user);
	},
	//leave chat remove user form ChatUsers and emit to client "userRemoved"
	onLeaveChat: function(userId){
		ChatUsers.findOne({id:userId}).done(function(error, user){
			if(user){
				user.destroy(function(err) {
					console.log("onLeaveChat " + userId);
					sails.io.sockets.in('chatroom').emit('userRemoved', {userId: userId});
				})
			}
		});
	},
	// when user viewing press onDebate change viewing --> queuing
	onDebateJoin: function(session, socket){
		ChatUsers.findOne({id:session.passport.user.id}).done(function(error, user){
			if(user && user.status == "viewing"){//if current user join is viewing

				ChatUsers.find({status:"queuing"}).done(function(error,userchats){

					if(userchats.length <= 3){//limit for 4 user is queuing
						
						user.status = "queuing";
						user.order = sails.config.sockets.nOrder;//nOrder default 0
						sails.config.sockets.nOrder++;
						console.log("Total user chating: "+userchats.length+"Sort nOder: "+sails.config.sockets.nOrder);
						user.save(function(err){
							console.log("session.passport.user.id:"+ session.passport.user.id +"user.order:"+user.order);
							sails.config.sockets.onUserUpdated(user);
						});
					}//end if set user is viewing and sort rating
					else{
						//sort speaker rating
						user.order = user.rating;//nOrder default 0
						user.save(function(err){
							sails.config.sockets.onUserUpdated(user);
						});
					}
				});
				
				//console.log("___nOrder:"+ sails.config.sockets.nOrder);
				
			}
		})
	},
	//if speaker onDebateLeave change: seapking or queing --> viewing
	onDebateLeave: function(session, socket){
		ChatUsers.findOne({id:session.passport.user.id}).done(function(error, user){
			if(user && user.status != "viewing"){
				user.status = "viewing";
				user.save(function(err){
					sails.config.sockets.onUserUpdated(user);
					sails.config.sockets.manageSpeaker();
				});
			}
		});
	},
	//calculate Voting after 15s
	calculateCurrentVoting: function(speaker,user){
		var sum = 0;
		//console.log("Voting Calcu--all---");
		Votes.find({toUserId: speaker.id}).done(function(error, votes){
			if(error){
				//console.log("Voting Calcu error-----");
			}else{
				//console.log("View votes :" + votes);
				sum = _.reduce(votes, function(r, v){return r + v.value;}, 0) ;
			//	console.log("Voting Calcu-suss----" + sum);	 
			}

			var newscore = sum;
			//console.log("newscore:" + newscore);	
			if(newscore>0){

				newscore=1;
			}
			else if(newscore<0){
				newscore=-1;

			}		
			else{
				newscore=0;
			}
			user.rating += newscore; // -1, 0, 1 from vote table
			speaker.rating += newscore;
			if(newscore>0){
				speaker.time = speaker.time + sails.config.sockets.TIME_ENCREASE;
				console.log("_____speaker.time:"+speaker.time);
			}
			
			
								
				
			delete user.password;
			user.save(function(err){

			});
			speaker.save(function(err) {
				sails.config.sockets.onUserUpdated(speaker);
				//console.log(speaker);
				sails.config.sockets.clearVoting();
			});				
			
			//console.log(user);

		});
	},
	calculateUserRating: function (speaker){
		Users.findOne({id:speaker.id}).done(function(err,user){
			if(user){
				//console.log('---------Caculate Rating After 15s -----------');
				//console.log(user);
				//console.log("Curent Rating:"+ user.rating);
				//console.log("speaker-Rating:"+speaker.rating);
				sails.config.sockets.calculateCurrentVoting(speaker, user);		
			}
			
			

		})
	},
	clearVoting: function(){
		Votes.destroy({			 
			}).done(function(err) {			 
			  if (err) {
			    return console.log(err);
			  
			  } else {
			   // console.log("---------All Rating Done!-----------");
			  }
			});

	},
	getReportSpam:function(speaker, callback){
		Users.findOne({id:speaker.id}).done(function(error,user){
			if(user){	
				if(user.bancount >= sails.config.sockets.REPORT_SPAM_OUT){
					callback(true);
				}
				else{
					callback(false);
				}
			}
		});
	},
	onUserUpdated: function(user){
		sails.io.sockets.in('chatroom').emit('userUpdated', {user: user});
	},
	manageSpeaker: function(nTimeDelta){
		//console.log("manageSpeaker "+nTimeDelta);
		ChatUsers.findOne({status:"speaking"}).done(function(error, speaker){
			if(speaker){
					
				//sails.config.sockets.nTimerID = setInterval(sails.config.sockets.listlike, 15000);
				//console.log(speaker.rating);
				if (nTimeDelta === undefined) {
					nTimeDelta = 0;
				}

				speaker.time += nTimeDelta;
				//console.log("Timed: " + speaker.time);
				if(speaker.time % 15 == 0)
				{
					sails.config.sockets.getReportSpam(speaker, function(banned) {
						//console.log("___________Is banned:"+ banned);
						if(banned || sails.config.sockets.TOTAL_TALK >= sails.config.sockets.TIME_OUT_ALL_TALK ||  //disconenct if speaked 2 minute
						speaker.time <= 0 
						) //disconenct vote down
							{

								speaker.order = sails.config.sockets.nOrder;
								speaker.status = "viewing";
								speaker.order = speaker.rating;
								speaker.save(function(err) {
									sails.config.sockets.onUserUpdated(speaker);
									sails.config.sockets.nextSpeaker();
								});
								
							}


						else{							

								//console.log("update time for speaking user:"+speaker.username);
								sails.config.sockets.TOTAL_TALK += sails.config.sockets.TIME_ACTION;
								//console.log("Total talked:"+sails.config.sockets.TOTAL_TALK);
								//save rating vote
								sails.config.sockets.calculateUserRating(speaker);
							}	
					})
					
				}
				else{
					//update time for speaker realtime
					speaker.save(function(err) {
						//console.log("Time has left:"+speaker.time);
					});

				}//end if % 15s
				
					
			}else{
				//if have user speaking or next
				sails.config.sockets.nextSpeaker();
			}
		});
		
	},

	nextSpeaker: function() {
		ChatUsers.find({status: "queuing"}).done(function(error, users){
			//if have users queuing
			if(users && users.length){
				users = _.sortBy(users, function(value){
					//console.log("Value sort:"+JSON.stringify(value));
					var compare = "";
					switch(value.status){
						case "speaking":
							compare += "0"+ value.order;
							break;
						case "queuing":
							compare += "1"+ value.order;
							break;
						case "viewing":
							compare += "2"+ value.order;
							break;
					}
					return compare.toLowerCase();
					//console.log("Compare:"+compare);
				});
				//set speaking user is: speaker is first of users
				speaker = _.first(users);
				console.log("Before Update status: "+JSON.stringify(speaker));
				speaker.time = sails.config.sockets.TOTAL_SPEAKER_TIME;//default speaker 30s

				sails.config.sockets.TOTAL_TALK = 0;
				speaker.status = "speaking";
				speaker.save(function(err) {
					console.log("After Update status: "+JSON.stringify(speaker));
					sails.config.sockets.onUserUpdated(speaker);

					//set viewing user have rating max to queuing 
					ChatUsers.find({status: "viewing"}).done(function(error, v_users){
						if(v_users && v_users.length){
							users = _.sortBy(v_users, function(value){
								return (value * -1);

							});

							speaker = _.first(users);
							speaker.status = "queuing";
							speaker.sort = sails.config.sockets.nOrder;
							speaker.save(function(err) {
								//console.log("After Update status: "+JSON.stringify(speaker));
								sails.config.sockets.onUserUpdated(speaker);
							});


						}
					});

				});
				



			}//end if
		});
	},
	//imit message to client
	onNewMessage: function(session, socket, message) {
		sails.io.sockets.in('chatroom').emit('newMessage', {message: message});
	},

	// This custom onDisconnect function will be run each time a socket disconnects
	onDisconnect: function(session, socket) {

	// By default: do nothing
	// This is a good place to broadcast a disconnect message, or any other custom socket.io logic
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