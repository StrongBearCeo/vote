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

var MainController = {
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
            sails.config.sockets.onLeaveChat(req.user.id);
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
        sails.log.info("Logout success for user:" + req.session.password.user);
        req.logout();
        return res.redirect("/");
    },
    // not in use
    confirm: function(req, res) {

    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to MainController)
     */
    _config: {}
};
module.exports = MainController;
