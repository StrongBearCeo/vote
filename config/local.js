/**
 * Local environment settings
 *
 * While you're developing your app, this config file should include
 * any settings specifically for your development computer (db passwords, etc.)
 * When you're ready to deploy your app in production, you can use this file
 * for configuration options on the server where it will be deployed.
 *
 *
 * PLEASE NOTE:
 *		This file is included in your .gitignore, so if you're using git
 *		as a version control solution for your Sails app, keep in mind that
 *		this file won't be committed to your repository!
 *
 *		Good news is, that means you can specify configuration for your local
 *		machine in this file without inadvertently committing personal information
 *		(like database passwords) to the repo.  Plus, this prevents other members
 *		of your team from commiting their local configuration changes on top of yours.
 *
 *
 * For more information, check out:
 * http://sailsjs.org/#documentation
 */


var passport = require('passport')
	,LocalStrategy = require('passport-local').Strategy
	,TwitterStrategy = require('passport-twitter').Strategy
	,FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		process.nextTick(function () {
			Users.findOne({ username: username }, function(err, user) {
				if(user.status=="blocked"){
					return done(null, false, { sError: 'Account ' + username + ' Blocked.' });
				}
				if (err) {
					return done(null, false, {sError: err});
				}
				if (!user) {
					return done(null, false, { sError: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { sError: 'Incorrect password.' });
				}

				return done(null, user);
			});
		});
	}
));

passport.use(new TwitterStrategy({
		consumerKey: '[TWITTERID]',
		consumerSecret: '[TWITTERSECRET]',
		callbackURL: '/twitter-token' //this will need to be dealt with
	},
	function(token, tokenSecret, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));

passport.use(new FacebookStrategy({
		clientID: '[FBID]',
		clientSecret: '[FBSECRET]',
		callbackURL: '/facebook-token'
	},
	function(accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			// To keep the example simple, the user's Facebook profile is returned to
			// represent the logged-in user. In a typical application, you would want
			// to associate the Facebook account with a user record in your database,
			// and return that user instead.
			return done(null, profile);
		});
	}
));

//define REST proxy options based on logged in user
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

module.exports = {

	// The `port` setting determines which TCP port your app will be deployed on
	// Ports are a transport-layer concept designed to allow many different
	// networking applications run at the same time on a single computer.
	// More about ports: http://en.wikipedia.org/wiki/Port_(computer_networking)
	//
	// By default, if it's set, Sails uses the `PORT` environment variable.
	// Otherwise it falls back to port 1337.
	//
	// In production, you'll probably want to change this setting
	// to 80 (http://) or 443 (ht0tps://) if you have an SSL certificate

	port: process.env.PORT || 8081,



	// The runtime "environment" of your Sails app is either 'development' or 'production'.
	//
	// In development, your Sails app will go out of its way to help you
	// (for instance you will receive more descriptive error and debugging output)
	//
	// In production, Sails configures itself (and its dependencies) to optimize performance.
	// You should always put your app in production mode before you deploy it to a server-
	// This helps ensure that your Sails app remains stable, performant, and scalable.
	//
	// By default, Sails sets its environment using the `NODE_ENV` environment variable.
	// If NODE_ENV is not set, Sails will run in the 'development' environment.

	environment: process.env.NODE_ENV || 'development',

	express: {
		customMiddleware: function(app){
			app.use(passport.initialize());
			app.use(passport.session());
		}
	}

};
