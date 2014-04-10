// Gói event 
package events{
    import flash.events.Event;

    public class CustomEvent extends Event {
		public static const CUSTOM_EVENT:String = "CustomEvent";
        public var Arguments:Object;
		
        // Public constructor.
        public function CustomEvent(type:String, 
            oArguments:Object=null) {
                // Call the constructor of the superclass.
                super(type);
				
                // Set the new property.
                this.Arguments = oArguments;
        }
		
		
        override public function clone():Event {
            return new CustomEvent(type, Arguments);
        }
    }
}
