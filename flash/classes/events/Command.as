package events {
	public class Command extends CustomEvent{
		public static const INIT:String = "init";
		public static const CONNECT:String = "connect";
		public static const DISCONNECT:String = "disconnect";
		
		public function Command(type:String, oArguments:Object=null) {
			super(type, oArguments);
		}
		
	}

}