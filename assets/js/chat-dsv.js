	 // ============================================================================
	 // ,,,,,,,,, ,,,
	 // ,,,,,,,, ,,,  Copyright:
	 // ,,,     ,,,          This source is subject to the Designveloper JSC
	 // ,,,    ,,,           All using or modify must have permission from us.
	 // ,,,   ,,,            http://designveloper.com
	 // ,,,,,,,,
	 // ,,,,,,,       Name:  DSVScriptTemplate
	 // Purpose:
	 //          Processing all client request chat and action
	 // Class:
	 //          chat Object
	 // Functions:
	 //          
	 // Called From:
	 //          client
	 // Author:
	 //          Nhien Phan (nhienpv@designveloper.com)
	 // Notes:
	 //          
	 // Changelog:
	 //          05/28/2014 - Nhien Phan - Init first revision.
	 // ============================================================================
	 //
	_.findIndex = function(obj, iterator, context) {
	    var result = -1;
	    _.any(obj, function(value, index, list) {
	        if (iterator.call(context, value, index, list)) {
	            result = index;
	            return true;
	        }
	    });
	    return result;
	}

	_.findIndexWhere = function(obj, attrs) {
	    return _.findIndex(obj, function(value) {
	        for (var key in attrs) {
	            if (attrs[key] !== value[key]) return false;
	        }
	        return true;
	    })
	}
	var chat = {

	    sURL: "",
	    socket: null,
	    bFlashLoaded: false,
	    bFlashInit: false,
	    bFlashConnected: false,
	    oCurrentUser: null,
	    oFlash: null,
	    arUsers: [],
	    arParticipant: [],
	    arParticipantUser: [],
	    arReportUser: [], //array save reported user
	    arVoteSystem: [],
	    sUserListID: "usersList",
	    sMessageListID: "messages",
	    arFavoriteIds: [],
	    setTimetoUser: 10000,
	    flagVoteUp: false,
	    flagVoteDown: false,
	    flagReport: false,
	    timenow: null,
	    
	    //System vote action command
	    KEY_VOTE_UP: "#vote up",
	    KEY_VOTE_DOWN: "#vote down",
	    KEY_REPORT: "#report",

	    
	    // Message system info
	    ALERT_VOTE_UP_SUCCESS: "SYSTEM: Vote up success!",
	    ALERT_VOTE_DOWN_SUCCESS: "SYSTEM: Vote down success!",
	    ALERT_HAD_VOTE_UP: "SYSTEM: You has already voted up",
	    ALERT_HAD_VOTE_DOWN: "SYSTEM: You has already voted down",
	    ALERT_HAD_REPORT: "SYSTEM: You has already reported user: ",
	    ALERT_REPORT_SUCCESS: "SYSTEM: Report success to user: ",
	    ALERT_REPORT_YOURSELF: "SYSTEM: Can't report yourself ",
	    ALERT_REPORT_SPEAKING: "SYSTEM: You are speaking. Can't use this command",
	    ALERT_GUID_COMMAND: "SYSTEM: Command ussing: #vote up, #vote down or #report [username]",
	    ALERT_NOT_COMMAND: "SYSTEM: You don't have permission",
	    ALERT_USER_REPORT_NOT_FOUND: "SYSTEM: User report not found.",
	    ALERT_NOT_FOUND_SPEAKING_USER: "SYSTEM: Not found speaking user to action vote",

	    
	    // Context menu
	    oContextMenu: {
	        selector: '.contextmenu, .messageUsername',

	        build: function(trigger, e) {
	            var user = _.findWhere(chat.arUsers, {
	                id: trigger.data('id')
	            });
	            var currentspeaking = user.status;
	            var enableAction = false;
	            var ebableParticipant = false;
	            if (user.status == "speaking") {
	                enableAction = true;
	            }
	            if (user.status == "participant") {
	                ebableParticipant = true;
	            }
	            return {
	                callback: function(key, options) {

	                },
	                events: {
	                    show: function(opt) {

	                    }
	                },

	                items: {
	                    "name": {
	                        name: user.username,
	                        className: "menuUsername",
	                        disabled: true
	                    },
	                    "sep1": "---------",
	                    "rating": {
	                        name: "Rating " + user.rating,
	                        disabled: true
	                    },
	                    "sep3": "---------",
	                    "Vote Up": {
	                        name: "Vote Up",
	                        className: user.status,
	                        icon: "like",
	                        callback: function(key, opt) {
	                            if (enableAction) {
	                                $("a#like").trigger("click");
	                            }
	                        },
	                        disabled: function(){
	                        	if (chat.oCurrentUser.id === user.id 
	                        			|| user.status !== 'speaking') {
	                                return true;
	                            }
	                            return false;
	                        }
	                    },
	                    "Vote Down": {
	                        name: "Vote Down",
	                        className: user.status,
	                        icon: "dislike",
	                        callback: function() {
	                            if (enableAction)
	                                $("a#dislike").trigger("click");
	                        },
	                        disabled: function(){
	                        	if (chat.oCurrentUser.id === user.id 
	                        			|| user.status !== 'speaking') {
	                                return true;
	                            }
	                            return false;
	                        }
	                    },
	                    "report": {
	                        name: "Report",
	                        className: user.status,
	                        icon: "delete",
	                        disabled: function() {
	                        	if (chat.oCurrentUser.id === user.id) {
	                                return true;
	                            }
	                            return false;
	                        },
	                        callback: function(key, opt) {
	                        		chat.reportSpamUser(user);
	                        }
	                    }
	                } //end items
	            };
	        }

	    },
	    
	    // Logout leave chat
	    logout: function() {
	        window.location.replace("/logout");
	    },
	    
	    // Add favorite user
	    favorite: function(toUserId) {
	        chat.socket.request(chat.sURL + "/chat/favorite", {
	            toUserId: toUserId
	        }, function(data) {})
	    },

	    // Init flash chat for user connect
	    init: function() {
	        //chat.setTimeUser();
	        chat.socket = window.socket;
	        if (chat.socket.socket && chat.socket.socket.connected) {
	            chat.joinChat();
	        } else {
	            chat.socket.on("connect", function() {
	                chat.joinChat();
	            })
	        }
	    },

	    // Join chat for user
	    joinChat: function() {
	        chat.socket.request(chat.sURL + "/chat/join", {
	            test: "ZZZC"
	        }, function(data) {
	            if (data.currentUser) {
	                chat.onChatConnected(data);
	            }
	        });
	    },
	    // onChatConnected
	    onChatConnected: function(data) {

	        this.oCurrentUser = data.currentUser;
	        this.initFlash();
	        //update list user chat active
	        _.each(data.userList, chat.updateUser, chat);
	        //Listen all socket function for 
	        chat.addSocketListeners();
	        // set chat for user on connected
	        $("#inputMessage").keypress(function(event) {
	            if (event.which == 13) {
	                event.preventDefault();
	                chat.sendMessage();
	            }
	        });
	        $("#sendBtn").click(function(event) {
	            chat.sendMessage();
	        });
	    },
	    // calls to flash
	    initFlash: function() {
	        if (this.bFlashLoaded && this.oCurrentUser && !this.bFlashInit) {
	            this.bFlashInit = true;
	            this.oFlash = document.getElementById("flashInterface");
	            this.oFlash.onConnectedToChat(this.oCurrentUser);
	        }
	    },
	    //4 update user
	    updateUser: function(user) {
	        //if user current (just login) // User each on Userlist on Room
	        if (chat.oCurrentUser.id == user.id) {
	            //if current user on list uerchat, disable debate click
	            chat.setCurrentUser(user);
	            $("#btnDebate").off('click');
	            $("#btnDebate").removeClass('btnDisabled');
	            if (user.status == "participant") {
	                $("#btnDebate").text('JOIN DEBATE');
	                $("#btnLogoutDebate").text('LOG OUT');
	                $("#background-right").css('background-image', 'url(../images/banner-left.png)');
	                $("#btnDebate").on('click', chat.onDebateJoin);
	                $("#btnLogoutDebate").on('click', chat.logout);

	            } else {
	                $("#btnDebate").on('click', chat.onDebateLeave);
	                $("#btnDebate").text('LEAVE DEBATE');
	            }
	        }
	        oOldUser = _.clone(_.findWhere(chat.arUsers, {
	            id: user.id
	        }));
	        this.removeUser(user.id, true);
	        //chat.arParticipant = _.where(chat.arUsers,{status:"participant"});
	        //chat.arParticipant = _.sortBy(chat.arParticipant, function(num){ return num.rating; });
	        var nIndex = _.sortedIndex(this.arUsers, user, function(value) {
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
	                case "participant":
	                    chat.arParticipant = value.rating;
	                    chat.arParticipantUser.push(chat.arParticipant);
	                    var newParticipant = _.uniq(chat.arParticipantUser);
	                    var sortParticipant = _.sortBy(newParticipant, function(num) {
	                        return -num;
	                    });
	                    var currentatIndex = _.indexOf(sortParticipant, value.rating);
	                    compare += "3" + currentatIndex;
	                    break;
	            }
	            return compare.toLowerCase();
	        });
	        chat.arUsers.splice(nIndex, 0, user);
	        this.insertAtIndex(user, nIndex);
	        chat.updateFlashQueue();

	    },

	    insertAtIndex: function(user, i) {
	        //console.log("insertAtIndex " + io.JSON.stringify(user) +", "+ i +" "+chat.arUsers.length);
	        if (i === chat.arUsers.length - 1) {
	            $("#" + this.sUserListID).append(this.templateUser(user));
	        } else {
	            $("#" + this.sUserListID + " div:eq(" + i + ")").before(this.templateUser(user));
	        }
	        $("#" + this.sUserListID).parent().nanoScroller();
	    },

	    removeAtIndex: function(i) {
	        //console.log("removeAtIndex "+ i)
	        $("#" + this.sUserListID + " div:eq(" + i + ")").remove();
	        $("#" + this.sUserListID).parent().nanoScroller();
	    },

	    addSocketListeners: function() {
	        chat.socket.on("userUpdated", function(data) {
	            if (!data.hasOwnProperty("user")) {
	                return;
	            }
	            //reset action vote and report for all user
	            chat.flagVoteUp = false;
	            chat.flagVoteDown = false;

	            chat.updateUser(data.user);
	        });

	        chat.socket.on("userRemoved", function(data) {
	            if (!data.hasOwnProperty("userId")) {
	                return;
	            }

	            chat.removeUser(data.userId);
	        });

	        chat.socket.on("newMessage", function(data) {
	            if (!data.hasOwnProperty("message")) {
	                return;
	            }
	            chat.addMessage(data.message);
	        });

	        chat.socket.on("clearVoteSystem", function(bClear) {
	            if (bClear.bClear == 1) {
	                chat.arVoteSystem = [];
	            }

	        });

	    },

	    setCurrentUser: function(user) {
	        this.oCurrentUser = user;
	        this.initFlash();
	    },
	    // updateFlashQueue
	    updateFlashQueue: function() {
	        if (this.bFlashConnected) {

	            var arQueue = _.filter(chat.arUsers, function(user) {
	                return (user.status == "speaking" || user.status == "queuing");
	            });
	            arQueue = _.first(arQueue, 5);
	            this.oFlash.onUpdateQueue(arQueue);
	        }
	    },

	    // calls from Flash
	    onFlashLoaded: function() {
	        this.bFlashLoaded = true;
	        this.initFlash();
	    },

	    onFlashConnected: function() {
	        this.bFlashConnected = true;
	        this.updateFlashQueue();
	        $("#btnDebate").show();
	        $("#btnDebate").off('click');
	        $("#btnDebate").on('click', chat.onDebateJoin);
	    },

	    onDebateJoin: function(evt) {
	        $("#btnDebate").off('click');
	        $("#btnDebate").text('PROCESSING...');
	        $("#btnDebate").addClass('btnDisabled');
	        chat.socket.request(chat.sURL + "/chat/debatejoin", {}, function(data) {

	        });
	    },

	    onDebateLeave: function(evt) {
	        $("#btnDebate").off('click');
	        $("#btnDebate").text('PROCESSING...');
	        $("#btnDebate").addClass('btnDisabled');

	        chat.socket.request(chat.sURL + "/chat/debateleave", {}, function(data) {
	            //console.log("onDebateLeave "+data);
	        });
	    },

	    removeUser: function(userId, bFlashIgnore) {
	        // Return index of userId in arUsers that no sorting
	        var nIndex = _.findIndexWhere(this.arUsers, {
	            id: userId
	        });
	        if (nIndex != -1) {
	            this.arUsers.splice(nIndex, 1);
	            this.removeAtIndex(nIndex);
	        }
	        if (bFlashIgnore === undefined) {
	            chat.updateFlashQueue();

	        }
	    },

	    addMessage: function(message) {
	        this.insertMessage(message);
	    },

	    // events
	    onUserClick: function(evt) {

	    },

	    // get current time
	    timecurrent: function() {
	        var now = new Date();
	        var year = now.getFullYear();
	        var month = now.getMonth() + 1;
	        var day = now.getDate();
	        var hour = now.getHours();
	        var minute = now.getMinutes();
	        var second = now.getSeconds();
	        if (month.toString().length == 1) {
	            var month = '0' + month;
	        }
	        if (day.toString().length == 1) {
	            var day = '0' + day;
	        }
	        if (hour.toString().length == 1) {
	            var hour = '0' + hour;
	        }
	        if (minute.toString().length == 1) {
	            var minute = '0' + minute;
	        }
	        if (second.toString().length == 1) {
	            var second = '0' + second;
	        }
	        timenow = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
	        return timenow;
	    },

	    actionReportSpamUser: function(user, callback){
	    	chat.socket.request(chat.sURL + "/chat/reportSpam", {
            username: user.username
        }, function(data) {
        		//console.log("Data report return:"+ JSON.stringify(data));
            if (data) {
            		if(user.status === 'speaking' || user.status === 'queuing'){
            			// call function disable flash video
        					chat.oFlash.reportspamSpeaker(user.id); 
            		}	
            		// Save report formUserID to toUserID in chat.arReportUser
                chat.arReportUser.push({
                    formUserID: chat.oCurrentUser.id,
                    toUserID: user.id,
                    reported: true
                });
                callback(true);
            }
            else{
            	callback(false);
            }
        });
	    },

	    // Report system function
	    reportSpamUser: function(user){
	    		console.log("User:"+JSON.stringify(user));
	    		// Template message
          var message = {
              "fromUserId": chat.oCurrentUser.id,
              "toUserId": 0,
              "text": "",
              "fromUsername": chat.oCurrentUser.username
          };
          // check if had report false
          if (chat.checkedReportToUser(chat.oCurrentUser.id,user.id)) {
          		message.text = chat.ALERT_HAD_REPORT + " " + user.username;
              chat.insertMessage(message);
              return;
          } //end if
          else{
          	chat.actionReportSpamUser(user,function(success){
          		if(success){
          			message.text = chat.ALERT_REPORT_SUCCESS + " " + user.username;
                chat.insertMessage(message);

                return;
	          	}
	          	else{
	          		message.text = "SYSTEM: Error report";
                chat.insertMessage(message);
                return;
	          	}         
          	});
          }
	    },//end function reportSpamUser

	    // Get true or false when user reported to another user on userlist
	    checkedReportToUser: function(fromUserReportID, toUserReportID){
          if (chat.arReportUser.length > 0) {
              var oReportedSpeaker;
              // check if had reported to user.id
              oReportedSpeaker = _.where(chat.arReportUser, {
                  formUserID: fromUserReportID,
                  toUserID: toUserReportID
              });
              // Return if have
              if (oReportedSpeaker.length > 0)
                  return checkedReport = oReportedSpeaker[0].reported;
          }
          return false;
	    },

	    // template insert user chat
	    templateUser: function(user) {

	    		// Check if reported
	        var reportedByUser = (function(value) {
	            if (user.id == chat.oCurrentUser.id) {
	                return 'true';
	            } else {
	                return 'false';
	            }
	        })();

	        // set backgound .current for current user on list user chat
	        var current = "";
	        if (user.id === chat.oCurrentUser.id) {
	            current = "current";
	        }

	        // template insert to window chat
	        template = $('<div>')
	            .addClass('contextmenu row ' + current)
	            .data('id', user.id)
	            .append($('<section>')
	                .addClass('column width-user-info')
	                // add icon avata chat
	                .append($('<span>')
	                    .addClass('iconsp-3511-18px')
	                )
	                .append($('<span>')
	                    // show user name and status
	                    .text(user.username + "  -  " + user.status)
	                    .data('userId', user.id)
	                    .on('click', chat.onUserClick)
	                )
	                .append($('<button>')
	                    .addClass('btn btn-primary repSpamUser' + ' ' + user.username + '-' + user.id)
	                    //.id(user.id)
	                    .data('reported', reportedByUser) //false this current user not report
	                    .data('enableReported', 'false') //enable report
	                    .data('id', user.id)
	                    .attr('id', user.id)
	                    .text('')
	                    .on('click', function(){})
	                )
	        ) //end append
	        .append($('<section>')
	            .addClass('column width-start start-number')
	            .append($('<span>')

	            ).text(user.rating)
	        )
	        return template;
	    },

	    // template for user chat
	    templateMessage: function(message) {
	        var currentMessage = message.text;
	        var template;
	        var bShowCommand = true;
	        var hiddenUser = "";
	        var colorSystem = "";
	        var messageSystem = "";
	        var timeSystem = "";
	        //set template for curent user (speaking)
	        if (message.text.substring(0, 7) === 'SYSTEM:') {
	            bShowCommand = false;
	            hiddenUser = "hidden";
	            colorSystem = "csgrey";
	            messageSystem = 'align-center';
	            timeSystem = chat.timecurrent();

	        }
	        if (chat.oCurrentUser.id === message.fromUserId) {
	            template = $('<aside>')
	                .addClass('comment-ct ' + messageSystem)
	                .append($('<span>')
	                    .addClass('iconsp-3511-18px')
	                    .addClass(hiddenUser)
	            )
	                .append($('<div>')
	                    .addClass('green-yellow')
	                    .append($('<span>')
	                        .addClass(hiddenUser)
	                        .text(message.fromUsername + ':')
	                        //.text(chat.timecurrent)
	                        .data('userId', message.fromUserId)
	                        .on('click', chat.onUserClick)
	                    )
	                    .append($('<p>')
	                        .addClass(colorSystem)
	                        .text(timeSystem + " " + message.text)
	                    )
	            )
	        }
	        //set template for another  user (queing, viewing)
	        if (bShowCommand && chat.oCurrentUser.id != message.fromUserId) {
	            template = $('<aside>')
	                .addClass('comment-ct right-comment')
	                .append($('<div>')
	                    .addClass('blue-sky')
	                    .append($('<span>')
	                        .text(message.fromUsername + ':')
	                        .data('userId', message.fromUserId)
	                        .on('click', chat.onUserClick)
	                    )
	                    .append($('<p>')
	                        .text(message.text)
	                    )
	            )
	                .append($('<span>')
	                    .addClass('iconsp-3511-18px')
	            )
	        }

	        return template;
	    },

	    // insert message to window chat
	    insertMessage: function(message) {
	        $("#" + this.sMessageListID).append(this.templateMessage(message));
	        $("#" + this.sMessageListID).parent().nanoScroller();
	        $("#" + this.sMessageListID).parent().nanoScroller({
	            scroll: 'bottom'
	        });
	    },

	    //return speaking user find on arUsers
	    speakingUser: function() {
	        return _.findWhere(chat.arUsers, {
	            status: 'speaking'
	        });
	    },

	    //vote click
	    vote: function(toUserId, value) {
	        chat.socket.request(chat.sURL + "/chat/vote", {
	            toUserId: toUserId,
	            value: value
	        }, function(data) {
	            if (data) {
	                chat.arVoteSystem = [];
	                chat.arVoteSystem.push({
	                    voteFormUser: data.data.fromUserId,
	                    voteToUser: toUserId,
	                    voteValue: value
	                });
	            }
	        })
	    },

	    // check if user had vote to seaking user on session speaking
	    checkVoteSytem: function(fromUserID, toUserID) {
	        if (chat.arVoteSystem.length > 0) {
	            var oVote = _.where(chat.arVoteSystem, {
	                voteFormUser: fromUserID,
	                voteToUser: toUserID
	            });
	            if (oVote[0].voteValue > 0) {
	                return oVote[0].voteValue;
	            }
	            if (oVote[0].voteValue < 0) {
	                return oVote[0].voteValue;
	            }
	        } else {
	            return 0;
	        }
	    },

	    // get userID chat by username
	    getUserByUserName : function(username){
	    		var ogetUser = _.where(chat.arUsers, {
	                            username: username
	                        });
	    		if(ogetUser.length > 0)
	    			return ogetUser[0];
	    		return null;
	    },

	    //send message socket to server ChatController
	    sendMessage: function() {
	        if ($("#inputMessage").val() != "") {
	            var currentMessage = $("#inputMessage").val().trim();
	            var message = {
	                "fromUserId": chat.oCurrentUser.id,
	                "toUserId": 0,
	                "text": "",
	                "fromUsername": chat.oCurrentUser.username
	            };
	           	
	           	switch(currentMessage){
	           		case chat.KEY_VOTE_UP:{
	           			$('#like').trigger('click');
	           			$("#inputMessage").val("");
	           			return;
	           			break;
	           		}
	           			
	           		case chat.KEY_VOTE_DOWN:{
	           			$('#dislike').trigger('click');
	           			$("#inputMessage").val("");
	           			return;
	           			break;
	           		}
	           		default:{
	           				//check if speaking only use report system dont't use vote system
				           	var key = currentMessage.substring(0,7);
				           	var usernameReport = currentMessage.substring(8);
			           		// Check if not rule key then return guid key
			           		if(key !== chat.KEY_REPORT && currentMessage.substring(0,1) === "#"){
		           			 		message.text = chat.ALERT_GUID_COMMAND;
		                    break;
			           		}

			           		if(key === chat.KEY_REPORT){
			           				var oHaveUserReport = [];
			           				oHaveUserReport = _.where(chat.arUsers,{username: usernameReport});
			           				if(usernameReport === chat.oCurrentUser.username){
			           						message.text = chat.ALERT_REPORT_YOURSELF;
			           						break;
			           				}
			           				
			           				if(oHaveUserReport.length <= 0){
			           						message.text = chat.ALERT_USER_REPORT_NOT_FOUND;
			           						break;
			           				}
			           				else{
			           					chat.reportSpamUser(chat.getUserByUserName(usernameReport));
			           					$("#inputMessage").val("");
	           							return;
			           					break;
			           				}
			           				


			           		}
	           		}
	           		
	           			

	           	}//end switch

	           	if(message.text === ""){
	           		chat.socket.request(chat.sURL + "/chat/message", {
	                toUserId: 0,
	                text: currentMessage
		            }, function(data) {});
		            $("#inputMessage").val("");
		            return;
	           	}
	           	else{
	           		chat.insertMessage(message);
                $("#inputMessage").val("");
                return;
	           	}
	            
	        }
	    },
	   
	    //listen report spam event from flash
	    onReportSpamFlash: function(user) {

	    },

	    getNumberBanCount: function(userID, callback) {
	        chat.socket.request(chat.sURL + "/chat/getbancount", {
	            id: userID
	        }, function(userban) {
	            callback(userban);
	        });
	    },

	} //end chat class

	// init document jquery
	$(document).ready(function() {

			//check real time if user be report then disconnect this user
	    setInterval(function() {
	        $('button.repSpamUser').each(function() {
	            chat.socket.request(chat.sURL + "/chat/getbancount", {
	                id: $(this).data('id')
	            }, function(userban) {
	                $('button#' + userban.userban.id).text('Report : ' + userban.userban.bancount);
	            });
	        });
	    }, 1000);

	    // init nano scroller
	    $(".nano").nanoScroller();
	    $(".nano").nanoScroller({
	        alwaysVisible: true
	    });
	    $(".nano").nanoScroller({
	        preventPageScrolling: true
	    });
	    $.contextMenu(chat.oContextMenu);

	    // Config flash server media
	    var flashvars = "sRTMP: rtmp://www.talkingheads.tream.co.uk/talkingheads";
	    var params = {
	        "wmode": "transparent"
	    };
	    var attributes = {};
	    swfobject.embedSWF("/swf/main.swf", "flashInterface", "100%", "100%", "10.0.0", "/swf/expressInstall.swf", flashvars, params, attributes);
	    
	    // call init chat
	    chat.init();

	    // Action vote up and vote down click

	    // vote up click
	    $('#like').click(function(e) {
	        e.preventDefault();

	        var message = {
	            "fromUserId": chat.oCurrentUser.id,
	            "toUserId": 0,
	            "text": "",
	            "fromUsername": chat.oCurrentUser.username
	        };
	        if (chat.speakingUser() === undefined) {
	            message.text = chat.ALERT_NOT_FOUND_SPEAKING_USER;
	            chat.insertMessage(message);
	            return;
	        }
	        if (chat.oCurrentUser.status === 'speaking') {
	            message.text = chat.ALERT_REPORT_SPEAKING;
	            chat.insertMessage(message);
	            return;
	        }
	       
	        if ( //chat.oCurrentUser.status != 'participant' &&
	            chat.oCurrentUser.status !== 'speaking') {
	            switch (chat.checkVoteSytem(chat.oCurrentUser.id, chat.speakingUser().id)) {
	                case 0:
	                    {
	                        chat.vote(chat.speakingUser().id, 1);
	                        message.text = chat.ALERT_VOTE_UP_SUCCESS;
	                        chat.insertMessage(message);
	                        break;
	                    }
	                case 1:
	                    {
	                        message.text = chat.ALERT_HAD_VOTE_UP;
	                        chat.insertMessage(message);
	                        break;
	                    }
	                case -1:
	                    {
	                        chat.vote(chat.speakingUser().id, 1);
	                        message.text = chat.ALERT_VOTE_UP_SUCCESS;
	                        chat.insertMessage(message);
	                        break;
	                    }
	            }

	        }
	        return;

	    });
	    //end vote up click

	    // vote down click
	    $('#dislike').click(function(e) {
	        e.preventDefault();
	        var message = {
	            "fromUserId": chat.oCurrentUser.id,
	            "toUserId": 0,
	            "text": "",
	            "fromUsername": chat.oCurrentUser.username
	        };

	       
	        if (chat.speakingUser() === undefined) {
	            message.text = chat.ALERT_NOT_FOUND_SPEAKING_USER;
	            chat.insertMessage(message);
	            return;
	        }

	        if (chat.oCurrentUser.status === 'speaking') {
	            message.text = chat.ALERT_REPORT_SPEAKING;
	            chat.insertMessage(message);
	            return;
	        }

	        //if vote enable
	        if ( //chat.oCurrentUser.status != 'participant' &&
	            chat.oCurrentUser.status !== 'speaking') {

	            switch (chat.checkVoteSytem(chat.oCurrentUser.id, chat.speakingUser().id)) {
	                case 0:
	                    {
	                        chat.vote(chat.speakingUser().id, -1);
	                        message.text = chat.ALERT_VOTE_DOWN_SUCCESS;
	                        chat.insertMessage(message);
	                        break;
	                    }
	                case 1:
	                    {
	                        chat.vote(chat.speakingUser().id, -1);
	                        message.text = chat.ALERT_VOTE_DOWN_SUCCESS;
	                        chat.insertMessage(message);
	                        break;
	                    }
	                case -1:
	                    {
	                        message.text = chat.ALERT_HAD_VOTE_DOWN;
	                        chat.insertMessage(message);
	                        break;
	                    }
	            }

	        }
	        return;

	    }) //end click #dislike
	});
	// end init document jquery -->

	// tooltip for vote up and vote down button
	$('.tooltip').tooltipster({
	    position: 'bottom'
	});

