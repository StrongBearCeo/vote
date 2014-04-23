package display.VideoBox {
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	/**
	 * ...a
	 * @author Adrian R
	 */
	public class VideoQueue extends VideoBox {

		public function VideoQueue() {
			super(160, 110);
		}

		override protected function buildInterface():void {
			txtUsername.defaultTextFormat = new TextFormat(new VAGRound().fontName, 14, 0x000000, false, false, false, null, null, TextFormatAlign.LEFT);
			txtUsername.text = "Username";
			buidVideo(0, 20, nWidth, 90);
		}

	}

}
