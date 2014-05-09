	_.findIndex = function(obj, iterator, context) {
		var result = -1;
		_.any(obj, function(value, index, list) {
			if(iterator.call(context, value, index, list)) {
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
		bFlashLoaded:false,
		bFlashInit: false,
		bFlashConnected:false,
		oCurrentUser:null,
		oFlash: null,
		arUsers: [],
		arParticipant:[],
		arParticipantUser:[],
		arReportUser:[],//array save reported user
		sUserListID: "usersList",
		sMessageListID: "messages",
		arFavoriteIds: [],
		setTimetoUser:10000,
		flagVoteUp:false,
		flagVoteDown:false,
		flagReport:false,

		KEY_VOTE_UP: "#vote up",
		KEY_VOTE_DOWN: "#vote down",
		KEY_REPORT: "#report",
		ALERT_VOTE_UP_SUCCESS:"SYSTEM: Vote up success!",
		ALERT_VOTE_DOWN_SUCCESS:"SYSTEM: Vote down success!",
		ALERT_HAD_VOTE_UP:"SYSTEM: You had vote up",
		ALERT_HAD_VOTE_DOWN:"SYSTEM: You had vote up",
		ALERT_HAD_REPORT:"SYSTEM: You had report: ",
		ALERT_REPORT_YOURSELF:"SYSTEM: Can't report yourself ",
		ALERT_REPORT_SPEAKING:"SYSTEM: You are speaking. Can't use command",
		ALERT_GUID_COMMAND:"SYSTEM: Command ussing:#vote up, #vote down or #report [username]",
		ALERT_NOT_COMMAND:"SYSTEM: You don't have permission",
		// create ContextMenu
		oContextMenu: {
			selector: '.contextmenu, .messageUsername',
			build: function(trigger, e){
				var user = _.findWhere(chat.arUsers, {id: trigger.data('id')});
				var enableAction =  false;
				var ebableParticipant = false;
				if(user.status == "speaking"){
					enableAction = true;

				}
				if(user.status == "participant"){
					ebableParticipant = true;
				}



				return {
					callback: function(key, options) {
					//	var m = "clicked: " + key + " on " + $(this).text();
					//	window.console && console.log(m) || alert(m);
						//if(key == 'report'){
						//	$.trigger('.repSpamUser').click();

					},

					items: {
						"name": {name: user.username, className:"menuUsername", disabled:true},
						"sep1": "---------",
						"rating": {name: "Rating "+user.rating, disabled:true},
						//	"ratingnow": {name: "Rating Today "+user.rating, disabled:true },
						//"favorites": {name: "Favorites "+user.favorites, disabled:true},
						"sep3": "---------",
						//"addfavorite": {name: "Add as Favorite", icon: "copy", callback: function(){chat.favorite(user.id)}},
						//"ignore": {name: "Ignore User", icon: "paste"},
						//"block": {name: "Block Video", icon: "delete"},
						"Vote Up": {name: "Vote Up", className:user.status, icon: "like" ,callback: function(){
								if(enableAction)
									$("a#like").trigger("click" );
								}
						},
						"Vote Down": {name: "Vote Down", className:user.status,icon: "dislike",callback: function(){
								if(enableAction)
									$( "a#dislike").trigger( "click" );
							}
						},
						"report": {name: "Report",className:user.status, icon: "delete",callback: function(){
							if(!ebableParticipant)
								$("button#"+user.id ).trigger( "click" );
							}
						}
					}
				};
			}

		},
		//Logout
		logout:function(){
			window.location.replace("/logout");
		},
		//Add favorite
		favorite: function(toUserId) {
			chat.socket.request(chat.sURL+"/chat/favorite", {toUserId : toUserId}, function(data){
			})
		},
		//init flash, chat
		init: function() {
			//chat.setTimeUser();
			chat.socket = window.socket;
			if(chat.socket.socket && chat.socket.socket.connected){
				chat.joinChat();
			}else{
				chat.socket.on("connect", function(){
					chat.joinChat();
				})
			}
		},
		//1 joinChat
		joinChat: function() {
			chat.socket.request(chat.sURL+"/chat/join", {test : "ZZZC"}, function(data){
				//console.log("B2: joinChat for User: "+ io.JSON.stringify(data) );
				//return data have: currentUser[] is user login, userList[] is all user
				if(data.currentUser){
					chat.onChatConnected(data);
				}
			});
		},
		//2 onChatConnected
		onChatConnected: function(data) {
			//set this currentUser = data.currentUser = user has just login
			this.oCurrentUser = data.currentUser;//Current user is connected set for flash
			this.initFlash();
			//update list user
			_.each(data.userList, chat.updateUser, chat);
			chat.addSocketListeners();
			// set chat for user on connected
			$("#inputMessage").keypress(function(event) {
				if(event.which == 13) {
					event.preventDefault();
					chat.sendMessage();
				}
			});
			$("#sendBtn").click(function(event) {
				chat.sendMessage();
			});
		},
		// 3 calls to flash
		initFlash: function() {
			if(this.bFlashLoaded && this.oCurrentUser && !this.bFlashInit){
				this.bFlashInit = true;
				this.oFlash = document.getElementById("flashInterface");
				this.oFlash.onConnectedToChat(this.oCurrentUser);
			}
		},
		//4 update user
		updateUser: function(user){
			//if user current (just login) // User each on Userlist on Room

			if(chat.oCurrentUser.id == user.id){
				//if current user on list uerchat, disable debate click
				chat.setCurrentUser(user);
				$("#btnDebate").off('click');
				$("#btnDebate").removeClass('btnDisabled');
				if(user.status == "participant"){
					$("#btnDebate").text('JOIN DEBATE');
					$("#btnLogoutDebate").text('LOG OUT');
					$("#background-right").css('background-image','url(../images/banner-left.png)');
					$("#btnDebate").on('click', chat.onDebateJoin);
					$("#btnLogoutDebate").on('click', chat.logout);

				}else{
					$("#btnDebate").on('click', chat.onDebateLeave);
					$("#btnDebate").text('LEAVE DEBATE');
				}
			}
			oOldUser = _.clone(_.findWhere(chat.arUsers, {id:user.id}));
			this.removeUser(user.id, true);

			//chat.arParticipant = _.where(chat.arUsers,{status:"participant"});
			//chat.arParticipant = _.sortBy(chat.arParticipant, function(num){ return num.rating; });
			
			var nIndex = _.sortedIndex(this.arUsers, user, function(value){
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
						case "participant":
							chat.arParticipant = value.rating;
							chat.arParticipantUser.push(chat.arParticipant);
							var newParticipant =_.uniq(chat.arParticipantUser);
							
							var sortParticipant =_.sortBy(newParticipant, function(num){ return -num; });
							var currentatIndex = _.indexOf(sortParticipant,value.rating);
								compare += "3"+ currentatIndex;
							break;
					}
					
					return compare.toLowerCase();


			});
			chat.arUsers.splice(nIndex, 0, user);
			this.insertAtIndex(user, nIndex);
			
			/*
			if(oOldUser){
				if(oOldUser.status != user.status || oOldUser.time != user.time){
					chat.updateFlashQueue();
				}
			}else if((user.status == "speaking" || user.status == "queuing") && nIndex<5){
				chat.updateFlashQueue();
			}
			*/
			chat.updateFlashQueue();

		},
		insertAtIndex: function(user, i) {
			//console.log("insertAtIndex " + io.JSON.stringify(user) +", "+ i +" "+chat.arUsers.length);
			if(i === chat.arUsers.length - 1) {
				$("#"+this.sUserListID).append(this.templateUser(user));
			}else{
				$("#"+this.sUserListID+" div:eq(" + i + ")").before(this.templateUser(user));
			}
			$("#"+this.sUserListID).parent().nanoScroller();
		},
		removeAtIndex: function(i) {
			//console.log("removeAtIndex "+ i)
			$("#"+this.sUserListID+" div:eq(" + i + ")").remove();
			$("#"+this.sUserListID).parent().nanoScroller();
		},
		addSocketListeners: function() {
			chat.socket.on("userUpdated", function(data){
				if(!data.hasOwnProperty("user")){
					return;
				}
				//reset action vote and report for all user
				chat.flagVoteUp = false;
				chat.flagVoteDown = false;
				chat.updateUser(data.user);
			});

			chat.socket.on("userRemoved", function(data){
				if(!data.hasOwnProperty("userId")){
					return;
				}

				chat.removeUser(data.userId);
			});

			chat.socket.on("newMessage", function(data){
				if(!data.hasOwnProperty("message")){
					return;
				}
				chat.addMessage(data.message);
			});

		},
		setCurrentUser: function(user){
			this.oCurrentUser = user;
			this.initFlash();
		},
		// updateFlashQueue
		updateFlashQueue: function() {
			if(this.bFlashConnected){
				var arQueue = _.filter(chat.arUsers, function(user){
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
			chat.socket.request(chat.sURL+"/chat/debatejoin", {}, function(data){
				
			});
		},

		onDebateLeave: function(evt) {
			$("#btnDebate").off('click');
			$("#btnDebate").text('PROCESSING...');
			$("#btnDebate").addClass('btnDisabled');

			chat.socket.request(chat.sURL+"/chat/debateleave", {}, function(data){
				//console.log("onDebateLeave "+data);
			});
		},

		removeUser: function(userId, bFlashIgnore){
			/*
			*	Return index of userId in arUsers that no sorting
			*/
			var nIndex = _.findIndexWhere(this.arUsers, {id:userId});
			if(nIndex != -1){
				this.arUsers.splice(nIndex, 1);
				this.removeAtIndex(nIndex);
			}
			if(bFlashIgnore === undefined){
				chat.updateFlashQueue();

			}
		},

		addMessage: function(message){
			this.insertMessage(message);
		},
		// events
		onUserClick: function(evt){
			
		},
		// template insert user chat
		templateUser: function(user) {
			var reportedByUser =  (function(value){
				if(user.id == chat.oCurrentUser.id){
					return 'true';
				}else{
					return  'false';
				}
			})();

			var current = "";
			if(user.id === chat.oCurrentUser.id){
				current = "current";
			}
				template = $('<div>')
						.addClass('contextmenu row '+current)
						.data('id',user.id)
						.append( $('<section>')
									.addClass('column width-user-info')
									.append( $('<span>')
										.addClass('iconsp-3511-35px')
									)
									.append( $('<span>')
									// show user name and status
										.text(user.username+"  -  "+user.status)
										.data('userId', user.id)
										.on('click', chat.onUserClick)
									)
									.append($('<button>')
										.addClass('btn btn-primary repSpamUser' +' '+ user.username+'-'+user.id)
										//.id(user.id)
										.data('reported',reportedByUser)//false this current user not report
										.data('enableReported','false')//enable report
										.data('id',user.id)
										.attr('id',user.id)
										.text('')
										.on('click',function(){
											var checkedReport = false;
											if(chat.arReportUser.length > 0){
												var oReportedSpeaker;
												oReportedSpeaker = _.where(chat.arReportUser,{formUserID:chat.oCurrentUser.id,toUserID:user.id}) ;
												if(oReportedSpeaker.length > 0)
													checkedReport = oReportedSpeaker[0].reported;
											}
											if(chat.oCurrentUser.status != "speaking"){
													if($(this).data('reported') == "false" && !checkedReport){
														//chat.oFlash.reportspamSpeaker(user.id);
														chat.socket.request(chat.sURL+"/chat/message", {toUserId: 0, text:"#report "+user.username}, function(data){
															chat.arReportUser.push({
																formUserID:chat.oCurrentUser.id,
																toUserID:user.id,
																reported: true
															});

														});
														chat.oFlash.reportspamSpeaker(user.id);
													}//end if

													if($(this).data('reported') == 'true'){
															chat.socket.request(chat.sURL+"/chat/message", {toUserId: 0, text:chat.ALERT_REPORT_YOURSELF }, function(data){
															});
													}//end if

											}else{
												chat.socket.request(chat.sURL+"/chat/message", {toUserId: 0, text: chat.ALERT_REPORT_SPEAKING }, function(data){
												});
											}

											if(checkedReport){
												chat.socket.request(chat.sURL+"/chat/message", {toUserId: 0, text:chat.ALERT_HAD_REPORT + user.username}, function(data){
												});
											}//end if

										}//end on click
									)
								)
						)//end append
						.append( $('<section>')
									.addClass('column width-start start-number')
									.append( $('<span>')

									).text(user.rating)
								)
				return template;
				//return '<div id="user'+user.id+'" class="user">'+user.username+'</div>';
		},

		// template for user chat
		templateMessage: function(message) {
			var currentMessage = message.text;
			var template;
			var bShowCommand = true;

			//check if speaking
			if(chat.oCurrentUser.status === 'speaking'){
				if(message.text === "#vote up" || message.text === "#vote down" ||
					message.text.substring(0,7) === "#report" || message.text.substring(0,1) === "#")
				{
					message.text = chat.ALERT_REPORT_SPEAKING ;
				}

			}//end check speaking

			//check if speaking
			if(chat.oCurrentUser.status === 'participant'){
				if(message.text === "#vote up" || message.text === "#vote down" ||
					message.text.substring(0,7) === "#report" || message.text.substring(0,1) === "#")
				{
					message.text = chat.ALERT_NOT_COMMAND ;
				}

			}//end check speaking

			if(chat.oCurrentUser.status != 'speaking' && chat.oCurrentUser.status != 'participant'){
					if(currentMessage.substring(0,1) ==="#"
					&& currentMessage !== "#vote up"
					&& currentMessage !== "#vote down"
					&& currentMessage.substring(0,7) !== "#report"
					){
						//console.log('currentMessage: ' + currentMessage+"currentMessage.substring(0,1)"+currentMessage.substring(0,1));
						message.text =chat.ALERT_GUID_COMMAND;

					}


					if(message.text === "#vote up")
					{
						if(chat.flagVoteUp){//true
							message.text  = chat.ALERT_HAD_VOTE_UP;
						}
						else{//false
							$('#like').trigger('click');
							message.text  = chat.ALERT_VOTE_UP_SUCCESS;
							chat.flagVoteUp = true;
							chat.flagVoteDown = false;
						}

					}//end vote up


					if(message.text === "#vote down")
					{
						if(chat.flagVoteDown){
							message.text  = chat.ALERT_HAD_VOTE_DOWN;
						}
						else{
							message.text  = chat.ALERT_VOTE_DOWN_SUCCESS;
							$('#dislike').trigger('click');
							chat.flagVoteUp = false;
							chat.flagVoteDown = true;
						}

					}//end vote down

					if(message.text.substring(0,7) === "#report")
					{
						bShowCommand = false;
						if(!chat.flagReport){

							var arhasUserreport = _.where(chat.arUsers,{username: message.text.substring(8)});
							if(arhasUserreport.length>0){
								chat.socket.request(chat.sURL+"/chat/reportSpam", {username:message.text.substring(8)},function(data){
									if(data){
										//chat.flagReport =true;
										message.text = "SYSTEM: Report done !";
									}

								});
							}//else arhasUserreport
							else{
								message.text = "SYSTEM: Can't not report, user: '"+message.text.substring(8)+"' not found!";
							}


						}else{
							message.text = chat.ALERT_HAD_REPORT ;
						}
					}//report peding

			}//end if current user is not speaking

			//set template for curent user (speaking)
			if(message.text.substring(0,7) ==='SYSTEM:'){
				bShowCommand = false;
			}
			if(chat.oCurrentUser.id === message.fromUserId ){
				template = $('<aside>')
							.addClass('comment-ct')
							.append( $('<span>')
										.addClass('iconsp-3511-35px')
									)
							.append( $('<div>')
										.addClass('green-yellow')
										.append( $('<span>')
										.text(message.fromUsername+':')
										.data('userId', message.fromUserId)
										.on('click', chat.onUserClick)
										)
										.append( $('<p>')
										.text(message.text)
										)
									)
			}
			//set template for another  user (queing, viewing)
			if(bShowCommand && chat.oCurrentUser.id != message.fromUserId)
			{
				template = $('<aside>')
							.addClass('comment-ct right-comment')
							.append( $('<div>')
										.addClass('blue-sky')
										.append( $('<span>')
											.text(message.fromUsername+':')
											.data('userId', message.fromUserId)
											.on('click', chat.onUserClick)
										)
										.append( $('<p>')
											.text(message.text)
										)
									)
								.append( $('<span>')
										.addClass('iconsp-3511-35px')
									)

			}

			return template;
		},
		insertMessage: function(message) {
			$("#"+this.sMessageListID).append(this.templateMessage(message));
			$("#"+this.sMessageListID).parent().nanoScroller();
			$("#"+this.sMessageListID).parent().nanoScroller({ scroll: 'bottom' });
		},
		//return speaking user find on arUsers
		speakingUser: function() {
			return _.findWhere(chat.arUsers, {status:'speaking'});
		},
		//vote click
		vote: function(toUserId, value) {
			chat.socket.request(chat.sURL+"/chat/vote", {toUserId : toUserId, value: value}, function(data){
				if(value>0 && data){
					chat.flagVoteUp = true;
					chat.flagVoteDown = false;
					chat.showVoteTemplte("VOTE UP success!");
					
				}
				if(value < 0 && data){
					chat.flagVoteUp = false;
					chat.flagVoteDown = true;
					chat.showVoteTemplte("VOTE DOWN success!");
				}
			})
		},
		//send message socket to server ChatController
		sendMessage: function(){
			if($("#inputMessage").val() != ""){
				chat.socket.request(chat.sURL+"/chat/message", {toUserId: 0, text: $("#inputMessage").val()}, function(data){

				});

				$("#inputMessage").val("");
			}
		},
		//template alert on window for user vote
		showVoteTemplte:function(message){
			var templateVote = "<div id='vote-container'><div id='info-vote'>"+message+"</div></div>";
			$('.like-button').append(templateVote);
			setTimeout(function(){
				$('#vote-container').remove();
			},1000);
		},
		//listen report spam event from flash
		onReportSpamFlash:function(user){

		},
		getNumberBanCount:function(userID,callback){
			chat.socket.request(chat.sURL+"/chat/getbancount", {id:userID}, function(userban){
					callback(userban);
				}
			);
		},

	}//end chat class

	// init document jquery
	$( document ).ready(function() {
		setInterval(function(){
			$('button.repSpamUser').each(function(){
				chat.socket.request(chat.sURL+"/chat/getbancount", {id:$(this).data('id')}, function(userban){
						
						$('button#'+userban.userban.id).text('Report : ' + userban.userban.bancount);
					}
				);
			});
		},1000);

		var myVar = setInterval(function(){myTimer()},1000);
		function myTimer()
		{
			var d = new Date();
			var t = d.toLocaleTimeString();
			$('span#currentDate').html('Today ' + t)
		}
		$(".nano").nanoScroller();
		$(".nano").nanoScroller({ alwaysVisible: true });
		$(".nano").nanoScroller({ preventPageScrolling: true });
		$.contextMenu(chat.oContextMenu);
		//Run flash Server
		var flashvars = {sRTMP:"<%- sRTMP %>"};
		// Run flash Localhost
		//var flashvars = {sRTMP:"rtmp://localhost/SOSample"};
		var params = {};
		var attributes = {};
		swfobject.embedSWF("/swf/main.swf", "flashInterface", "100%", "100%", "10.0.0", "/swf/expressInstall.swf", flashvars, params, attributes);
		chat.init();
		$('#like').click(function(e){
			e.preventDefault();
			if( chat.oCurrentUser.status == 'speaking'){
				chat.showVoteTemplte("You are speaking, Don't VOTE UP!");
				return;
			}

			if( chat.oCurrentUser.status == 'participant'){
				chat.showVoteTemplte("You don't have permission");
				return;
			}

			//if vote enable
			if(!chat.flagVoteUp){
				chat.vote(chat.speakingUser().id,1);
			}
			else{
				chat.showVoteTemplte("You had VOTE UP!");
			}
		});//end click #like
		$('#dislike').click(function(e) {
			e.preventDefault();
			if( chat.oCurrentUser.status == 'speaking'){
				chat.showVoteTemplte("You are speaking, Don't VOTE DOWN!");
				return;
			}
			if( chat.oCurrentUser.status == 'participant'){
				chat.showVoteTemplte("You don't have permission");
				return;
			}
			if(!chat.flagVoteDown){
				chat.vote(chat.speakingUser().id,-1);
			}
			else{
				//show
				chat.showVoteTemplte("You had VOTE DOWN!");
			}

		})//end click #dislike
	});
	// end init document jquery -->
	 $('.tooltip').tooltipster({
		position:'bottom'
	}
	);
