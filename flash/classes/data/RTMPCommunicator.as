package data {
	import events.CustomEvent;
	import events.RTMPCommunicatorEvent;
	import flash.events.AsyncErrorEvent;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.NetStatusEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.StatusEvent;
	import flash.media.Camera;
	import flash.media.Microphone;
	import flash.media.SoundCodec;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.utils.setTimeout;
	import flash.utils.clearTimeout;
	/**
	 * ...
	 * @author Adrian R
	 */
	public class RTMPCommunicator extends EventDispatcher {
		include "../trace_implementation.as";
		
		public static const ERROR_MSG:String = "ERROR: RTMPCommunicator already initialized";
		
		protected static var instance:RTMPCommunicator;
		
		private var camera:Camera;
		private var microphone:Microphone;
		
		private var oCurrentUser:Object = null;
		
		private var nc:NetConnection;
		private var nsOut:NetStream;
		private var bNsOutAudion:Boolean = false;
		private var oIn:Object;
		
		private var bUnpublishing:Boolean = false;
		private var nPublishTimeout:Number;
		
		private var oSettings:Object = {
				sRTMP: "rtmp://localhost/talkingheads",
				//sRTMP: "rtmp://www.talkingheads.tream.co.uk/talkingheads",
				nCamWidth: 640,
				nCamFps: 24,
				nCamKeyFrameInterval: 8,
				nCamQuality: 90,
				nCamBandwidth: 0,
				sSoundCodec: SoundCodec.SPEEX,
				nSoundEncodeQuality: 10,
				nSoundFramesPerPacket: 2,
				nSoundGain: 50,
				nSoundRate: 22,
				bSoundEchoSuppresion: true,
				bSoundLoopBack: false
			};
		
		
		public function RTMPCommunicator() {
			
			if (instance != null) {
				throw Error(ERROR_MSG);
			}
			
			nc = new NetConnection();
			
			nc.addEventListener(NetStatusEvent.NET_STATUS, handleNCStatus);
			nc.addEventListener(IOErrorEvent.IO_ERROR, handleError);
			nc.addEventListener(AsyncErrorEvent.ASYNC_ERROR, handleError);
			nc.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handleError);
			
			addNCCallbacks();
			
			oIn = new Object();
			
			instance = this;
		}
		
		public static function getInstance():RTMPCommunicator {
			if (instance == null) {
				instance = new RTMPCommunicator();
			}
			return instance;
		}
		
		public function configure(oParams:Object):void {
			var s:*;
			for (s in oSettings) {
				if (oParams.hasOwnProperty(s)) {
					oSettings[s] = oParams[s];
				}
			}
		}
		
		public function get currentUser():Object {
			return oCurrentUser;
		}
		
		public function set currentUser(oCurrentUser:Object):void {
			this.oCurrentUser = oCurrentUser;
		}
		
		public function get currentCamera():Camera {
			return camera;
		}
		
		public function getNsIn(sStreamInName:String):NetStream {
			trace("getNsIn " + sStreamInName + " " + oIn.hasOwnProperty(sStreamInName));
			if (!oIn.hasOwnProperty(sStreamInName) ) {
				var nsIn:NetStream = new NetStream(nc);
				nsIn.addEventListener(NetStatusEvent.NET_STATUS, handleNSInStatus);
				nsIn.bufferTime = 0;
				nsIn.play(sStreamInName);
				
				oIn[sStreamInName] = nsIn
			}
			
			return oIn[sStreamInName];
		}
		
		public function clearExtraNsIn(arId:Array):void {
			trace("clearExtraNsIn "+arId);
			var s:*;
			for (s in oIn) {
				if (arId.indexOf(s) == -1) {
					oIn[s].removeEventListener(NetStatusEvent.NET_STATUS, handleNSInStatus);
					oIn[s].close();
					delete oIn[s];
				}
			}
		}
		
		public function publish(bAudio:Boolean = false):void {
			trace("publish " + oCurrentUser.id + " " + bNsOutAudion +" "+  bAudio +" "+nsOut+" "+bUnpublishing);
			if (camera == null && !configureCamMic()) {
				return;
			}
			
			clearTimeout(nPublishTimeout);
			if (bUnpublishing) {
				nPublishTimeout = setTimeout(publish, 100, bAudio);
				return;
			}
			
			if (nsOut == null) {
				nsOut = new NetStream(nc);
				nsOut.addEventListener(NetStatusEvent.NET_STATUS, handleNSOutStatus);
				nsOut.attachCamera(camera);
				
				if (bAudio) {
					nsOut.attachAudio(microphone);
				}
				bNsOutAudion = bAudio;
				
				nsOut.publish(oCurrentUser.id);
				
			}else {
				/*
				if (bNsOutAudion != bAudio) {
					unpublish();
					publish(bAudio);
				}
				*/
				if (bAudio) {
					nsOut.attachAudio(microphone);
				}else {
					nsOut.attachAudio(null);
				}
				bNsOutAudion = bAudio;
			}
		}
		
		public function unpublish():void {
			trace("unpublish " + oCurrentUser.id + " " + bNsOutAudion +" " + nsOut);
			clearTimeout(nPublishTimeout);
			if (nsOut) {
				bUnpublishing = true;
				
				nsOut.close();
				//nsOut = null;
			}
		}
		
		private function unpublishComplete():void {
			nsOut.removeEventListener(NetStatusEvent.NET_STATUS, handleNSOutStatus);
			nsOut = null;
			bUnpublishing = false;
		}
		
		private function configureCamMic(): Boolean {
			trace("configureCamMic");
			camera = Camera.getCamera();
			if ( camera == null ) return false;
			camera.setMode(oSettings.nCamWidth, oSettings.nCamWidth*9/16, oSettings.nCamFps);
			camera.setQuality(oSettings.nCamBandwidth, oSettings.nCamQuality);
			camera.setKeyFrameInterval(oSettings.nCamKeyFrameInterval);
			
			microphone = Microphone.getMicrophone();
			if(microphone != null){
				microphone.codec = oSettings.sSoundCodec;
				microphone.encodeQuality = oSettings.nSoundEncodeQuality;
				microphone.framesPerPacket = oSettings.nSoundFramesPerPacket;
				microphone.gain = oSettings.nSoundGain;
				microphone.rate = oSettings.nSoundRate;
				microphone.setUseEchoSuppression(oSettings.bSoundEchoSuppresion);
				microphone.setLoopBack(oSettings.bSoundLoopBack);
			}
			
			return true;
		}
		
		// *** NC & NS Events ***
		private function handleNCStatus(evt:NetStatusEvent):void {
			trace("handleNCStatus\n evt.info.code: ***" + evt.info.code);
			for (var i in evt.info.application) {
				trace(i+" = "+evt.info.application[i]);
			}
			
			switch (evt.info.code) {
				case "NetConnection.Connect.Success":
					dispatchEvent(new RTMPCommunicatorEvent(RTMPCommunicatorEvent.CONNECTION_READY));
					break;
				case "NetConnection.Connect.Failed":
				case "NetConnection.Connect.AppShutdown":
				case "NetConnection.Connect.InvalidApp":
				case "NetConnection.Connect.Closed":
					dispatchEvent(new RTMPCommunicatorEvent(RTMPCommunicatorEvent.CONNECTION_CLOSED));
					break;
				case "NetConnection.Connect.Rejected":

					break;
			}
		}
		
		private function handleNSOutStatus(evt:NetStatusEvent):void {
			trace("NS Out Status\n evt.info.code: *** " + evt.info.code);
			for (var i in evt.info.application) {
				trace(i+" = "+evt.info.application[i]);
			}
			
			switch (evt.info.code) {
				case "NetStream.Unpublish.Success":
					unpublishComplete();
					break;
			}
			
		}
		
		private function handleNSInStatus(evt:NetStatusEvent):void {
			trace("NS In Status\n evt.info.code: *** " + evt.info.code);
			for (var i in evt.info.application) {
				trace(i+" = "+evt.info.application[i]);
			}
			
			switch (evt.info.code) {
				case "NetConnection.Connect.Success":
					
					break;
			}
			
		}
		
		
		private function handleError(evt:Event) {
			trace("handleError" + evt)
		}
		// END NC & NS Events ***
		
		
		
		// *** Server -> Client Calls ****
		private function addNCCallbacks():void {
			var oClient:Object = new Object();
			
			oClient.traceBack = function(sMsg):void {
				trace("traceBack: "+sMsg);
			}
			
			nc.client = oClient;
		}
		
		
		// END Server -> Client Calls ***
		
		public function connect(oCurrentUser:Object):void {
			currentUser = oCurrentUser;
			trace("connect: \nsRTMP = " + oSettings.sRTMP);
			nc.connect(oSettings.sRTMP);
		}
	}
}