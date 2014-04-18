package  {
	import data.RTMPCommunicator;
	import display.VideoBox.VideoBox;
	import display.VideoBox.VideoMain;
	import display.VideoBox.VideoQueue;
	import events.RTMPCommunicatorEvent;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.external.ExternalInterface;//interface giao tiep voi client html
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
   import flash.events.MouseEvent;
	//import org.computus.model.Timekeeper;
	//import org.computus.model.TimekeeperEvent;


	/**
	 * ...
	 * @author Adrian R
	 */
	public class Main extends MovieClip {
		include "trace_implementation.as";
		//config tex: txtStatus
		private var nWidth:Number = 640;
		private var nHeight:Number = 530;
		//Mang cac video member login
		private var arVideos:Array;
		// thong bao text status
		private var txtStatus:TextField;

		private var spQueue:Sprite;

		private var oCommunicator:RTMPCommunicator;


		public function Main() {
			//event contructor call back event to nodejs
			addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		}

		private function onAddedToStage(evt:Event):void {
			//Ham call back tu nodejs: onConnectedToChat thuc hien onConnectedToChat
			//Ham call back tu nodejs: onUpdateQueue thuc hien onConnectedToChat

			ExternalInterface.addCallback("onConnectedToChat", onConnectedToChat);
			ExternalInterface.addCallback("onUpdateQueue", onUpdateQueue);
			//
			oCommunicator = RTMPCommunicator.getInstance();
			oCommunicator.configure(root.loaderInfo.parameters);
			//

			oCommunicator.addEventListener(RTMPCommunicatorEvent.CONNECTION_READY, onConnectionReady);
			oCommunicator.addEventListener(RTMPCommunicatorEvent.CONNECTION_CLOSED, onConnectionClosed);
			buildInterface();
		}

		private function buildInterface():void {
			//xay dung text connecting
			txtStatus = new TextField();
			txtStatus.antiAliasType = AntiAliasType.ADVANCED;
			txtStatus.embedFonts = true;
			txtStatus.defaultTextFormat = new TextFormat(new VAGRound().fontName, 40, 0x000000, false, false, false, null, null, TextFormatAlign.CENTER);
			txtStatus.selectable = false;
			txtStatus.width = nWidth;
			txtStatus.text = "Connecting to video server...";
			txtStatus.height = txtStatus.textHeight + 4;
			txtStatus.x = 0;
			txtStatus.y = (nHeight - txtStatus.height) / 2 - 100;
			addChild(txtStatus);//and text connect to video

			//thiet lap video thanh vien
			arVideos = new Array();

			var vid:VideoBox;
			vid = new VideoMain();
			addChild(vid);
			arVideos.push(vid);


			var nOffsetY:Number = vid.height;
			spQueue = new Sprite();
			spQueue.y = nOffsetY;
			addChild(spQueue);

			var i:int;
			for (i = 0; i < 4; i++ ) {
				vid = new VideoQueue();
				vid.x = i * vid.width;
				spQueue.addChild(vid);
				arVideos.push(vid);
         //   arVideos[i].btnReport.addEventListener(MouseEvent.MOUSE_UP,reportSpeaker(arVideos[i].user));
			}


			// goi ham load video xuong client nodejs
			externalOnLoaded();
		}

		// Events
		private function onConnectionReady(evt:RTMPCommunicatorEvent):void {
			externalOnConnected();
		}

		private function onConnectionClosed(evt:RTMPCommunicatorEvent):void {

		}


		// ExternalInterface id element -> Flash Calls
		// thuc thi ham onConnectedToChat  tu nodejs truyen vao curent user
		public function onConnectedToChat(oCurrentUser:Object):void {
			trace("oCurrentUser " + oCurrentUser.username);
			oCommunicator.connect(oCurrentUser);
         //listenEventUserChatConnected();
		}
      //listen event for userconnect chat
      public function listenEventUserChatConnected(){
         var i:Number;
         for (i = 0; i < arVideos.length; i++  ) {
            //ExternalInterface.call("console.log", "FLASH: arVideos.length="+arVideos.length);

               //ExternalInterface.call("console.log", "FLASH: arUsers[i].id="+arUsers[i].id);
               //if (arUsers[i].id == oCurrentUserInQueue.id) {
               //ExternalInterface.call("console.log", "FLASH: setTimekeeperValue");

                  arVideos[i].btnReport.addEventListener(MouseEvent.MOUSE_UP,reportSpeaker(arVideos[i].user));
               //}


         }
      }
		public function onUpdateQueue(arUsers:Array):void {
			trace("onUpdateQueue " + arUsers +" "+arUsers.length);
			if (arUsers.length) {
				txtStatus.text = "";
			}else {
				txtStatus.text = "Waiting for speakers...";
			}

			// publish
			var oCurrentUserInQueue:Object = null;
			var i:int;
			for (i = 0; i < arUsers.length; i++  ) {
				if (arUsers[i].id == oCommunicator.currentUser.id) {
					oCurrentUserInQueue = arUsers[i];
					//ExternalInterface.call("console.log", "FLASH: ");
				}
			}
			if (oCurrentUserInQueue) {
				//trace("Speaking: "+oCurrentUserInQueue.status);
				oCommunicator.publish(oCurrentUserInQueue.status == "speaking");

			}else {
				oCommunicator.unpublish();
			}

			//ExternalInterface.call("console.log", "FLASH Speaking: "+oCurrentUserInQueue.status);
			//ExternalInterface.call("console.log", "FLASH Speaking: "+oCurrentUserInQueue.status);
			//oCurrentUserInQueue.time = 99;
			for (i = 0; i < arVideos.length; i++  ) {
				//ExternalInterface.call("console.log", "FLASH: arVideos.length="+arVideos.length);
				if(arUsers[i]){
					//ExternalInterface.call("console.log", "FLASH: arUsers[i].id="+arUsers[i].id);
					//if (arUsers[i].id == oCurrentUserInQueue.id) {
					//ExternalInterface.call("console.log", "FLASH: setTimekeeperValue");
						arVideos[i].setTimekeeperValue=0;

					//}
				}

			}


			// subscribe
			for (i = arUsers.length; i < arVideos.length; i++  ) {
				arUsers.push(null);
			}

			var arId:Array = new Array();
			for (i = 0; i < arVideos.length; i++  ) {
				arVideos[i].user = arUsers[i];
				if (arUsers[i] && (oCurrentUserInQueue == null || arUsers[i].id != oCurrentUserInQueue.id)) {
					arId.push(arUsers[i].id);
				}
			}

			oCommunicator.clearExtraNsIn(arId);
		}

      /*********** Action listener button Report *************/


      private function reportSpeaker(videoSpeaker:Object ):Function{
         return function(e:MouseEvent):void{
            ExternalInterface.call("chat.onReportSpamFlash",videoSpeaker);
         }

      }

      /********************************************************/
		// thuc hien function: chat.onFlashLoaded cua nodejs
		private function externalOnLoaded():void {

			ExternalInterface.call("chat.onFlashLoaded");
		}
		// thuc hien function: chat.onFlashConnected cua nodejs
		private function externalOnConnected():void {
			ExternalInterface.call("chat.onFlashConnected");
		}
	}

}
