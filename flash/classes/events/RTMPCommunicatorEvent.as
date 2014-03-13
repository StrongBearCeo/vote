package events {
	public class RTMPCommunicatorEvent extends CustomEvent{
		public static const CONNECTION_READY:String = "EventConnectionReady";
		public static const CONNECTION_CLOSED:String = "EventConnectionClosed";
		public static const CONNECTION_REJECTED:String = "EventConnectionRejected";
		public static const PUBLISH_STARTED:String = "EventPublishStarted";
		public static const PUBLISH_FAILED:String = "EventPublishFailed";
		public static const SHOW_SETTINGS_PANEL:String = "EventShowSettingsPanel";
		public static const NOTIFY_SPEAKER_PRESENT:String = "EventNotifySpeakerPresent";
		
		public function RTMPCommunicatorEvent(type:String, oArguments:Object=null) {
			super(type, oArguments);
		}
		
	}

}