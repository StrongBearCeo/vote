/**
 * MainController
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
 /*
function censor(censor) {
		  return (function() {
		    var i = 0;

		    return function(key, value) {
		      if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
		        return '[Circular]'; 

		      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
		        return '[Unknown]';

		      ++i; // so we know we aren't using the original object anymore

		      return value;  
		    }
		  })(censor);
		}
*/

 var MainController = {

    index: function (req, res) {
		if(req.user){
			return res.redirect("/chat");
		}
		else{
			res.locals.notifications = _.clone(req.session.notifications);
			req.session.notifications = {};
			res.view(); 		
		}	
	

    },

    signup: function (req, res) {
        var username = req.param("username");
        var password = req.param("password");
        var confirmPassword = req.param("confirmPassword");
        var email = req.param("email");

        if(password != confirmPassword){
        	req.session.notifications = {
				signup: {message: "Passwords do not match."}

			}
	        return res.redirect("/");
        }

       	Users.findByUsername(username).done(function(err, usr){
			if (err) {
				req.session.notifications = {
					signup: {message: "DB Error"}
				}
		        return res.redirect("/");
		    } else if (usr.length) {
		    	req.session.notifications = {
					signup: {message: "Username already taken."}
				}
		        return res.redirect("/");

		    } else {
		        Users.create({username: username, password: password, email: email}).done(function(error, user) {
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

    login: function (req, res) {
    	passport = require("passport");

        var username = req.param("username");
        var password = req.param("password");
        var provider = req.param("provider");

        if(["local", "twitter", "facebook"].indexOf(provider) == -1){
        	req.session.notifications = {
				login: {message: "Invalid provider."}
			}
	        return res.redirect("/");
        }


        if(req.user){
        	sails.config.sockets.onLeaveChat(req.user.id);
        }

    	passport.authenticate(provider, function(error, user, info){
    		
			if (error) {
				req.session.notifications = {
					login: error
				}
		        return res.redirect("/");
			}

			if(!user){
				req.session.notifications = {
					login: {message: info.sError}
				}
		        return res.redirect("/");
			}
			
			
			req.logIn(user, function(err){
				if (err){
					req.session.notifications = {
						login: {message: "Login error."}
					}
			        return res.redirect("/");
				}else{
					return res.redirect("/chat");
				}
			});

		})(req, res);
    },
	
	logout: function (req,res){
		req.logout();
		return res.redirect("/");
	},
	
    confirm: function (req, res) {
         
    },

    /**
	* Overrides for the settings in `config/controllers.js`
	* (specific to MainController)
	*/
	_config: {}
};

module.exports = MainController;
