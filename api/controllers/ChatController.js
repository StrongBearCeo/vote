/**
 * ChatController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

module.exports = {

    // VIEWS
	index: function (req, res) {
		if(req.user){
			res.view({user: req.user, sRTMP: sails.config.custom.sRTMP});
		}
		else{
			return res.redirect("/");
		}
	},

	// SOCKET
	join: function(req, res){

		if(!req.socket){
			return;
		}
		ChatUsers.create(
         {
            id:req.session.passport.user.id,
            username: req.session.passport.user.username,
            rating: req.session.passport.user.rating ,
            favorites: sails.config.sockets.DEFAULT_FAVORITE
         }).done(function(error, user) {
	        if (error) {
	            res.send({error: error});
	        } else {
	            //
	            sails.config.sockets.onJoinChat(req.session, req.socket, user);
	            ChatUsers.find().done(function(error, users) {
	            	if (error) {
			            res.send({error: error});
			        } else {
		            	res.send({currentUser: user, userList: users});
		            }
	            });
	        }
        });
	},

	message: function(req, res){

		if(!req.socket){
			return;
		}

		Messages.create({fromUserId: req.session.passport.user.id, toUserId:req.param("toUserId"), text:req.param("text")}).done(function(error, message) {
			if (error) {
				res.send({error: error});
			} else {

				var msg = message.toObject();

				Users.findOne({id: msg.fromUserId}).done(function(error, user){
					if(user){
						msg.fromUsername = user.username;
					}else{
						msg.fromUsername = "SYSTEM"
					}

					Users.findOne({id: msg.toUserId}).done(function(error, user){
						if(user){
							msg.toUsername = user.username;
						}else{
							msg.toUsername = "ALL";
						}

						sails.config.sockets.onNewMessage(req.session, req.socket, msg);

						res.send(200);
					})
				})

			}
    	});

	},

	debateJoin: function(req, res){
		if(!req.socket){
			return;
		}

		res.send({bSuccess: true});
		sails.config.sockets.onDebateJoin(req.session, req.socket);

	},

	debateLeave: function(req, res){
		if(!req.socket){
			return;
		}

		sails.config.sockets.onDebateLeave(req.session, req.socket);
		res.send({bSuccess: true});
	},

	reportSpam:function(req,res){
		Users.findOne({username:req.param('username')}).done(function(error,user){
			if(user){
				user.bancount = user.bancount + 1;
				delete user.password;
				if(user.bancount >= 10){
					user.status="blocked";
				}

				user.save(function(err){
					res.send({data: true});
				});
			}
			if(error){
				console.log(error);
			}
		});
	},


	vote: function(req, res){
		var toUserId =  req.param("toUserId");
		var value = req.param("value");
		//action vote
		Votes.findOne({fromUserId:req.session.passport.user.id}).done(function(error,votejs){
			if(votejs){
				votejs.value=value;
				votejs.save(function(error) {
					return res.send({data: votejs});//if success
 				 });

			}
			else{
					Votes.create({fromUserId: req.session.passport.user.id, toUserId:toUserId, value:value}).done(function(error, vote) {
						if (error) {
							return res.send({error: error});
						} else {

							return res.send({data: vote});//if success
						}
					})
			}
		});

	},
   getbancount: function(req, res){
      Users.findOne({id:req.param('id')}).done(function(error,userban){
         if(error){

            return res.send({error: error});
         }
         if(userban){
            res.send({userban:userban});
         }
      })

   },
	favorite: function(req, res){
		var toUserId =  req.param("toUserId");
		Favorites.findOne({fromUserId: req.session.passport.user.id, toUserId:toUserId}).done(function(error, favorite){
			if (error) {
				return res.send({error: error});
			} else {
				if(favorite){ // unfavorite
					favorite.destroy(function(error){
						if (error) {
							return res.send({error: error});
						} else {
							ChatUsers.findOne({id: toUserId}).done(function(error, user){
								if(user){
									user.loadFavorites(function(error){
										sails.config.sockets.onUserUpdated(user);
									});
								}
							})
							return res.send({bSuccess: true});
						}
					})
				}else{ //favorite
					Favorites.create({fromUserId: req.session.passport.user.id, toUserId:toUserId}).done(function(error, favorite) {
						if (error) {
							return res.send({error: error});
						} else {
							ChatUsers.findOne({id: toUserId}).done(function(error, user){
								if(user){
									user.loadFavorites(function(error){
										sails.config.sockets.onUserUpdated(user);
									});
								}
							})
							return res.send({bSuccess: true});
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
