package display.VideoBox {
	import data.RTMPCommunicator;
	import display.LibraryButton;
	import display.ShapeButton;
	import flash.display.Sprite;
	import flash.media.Video;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	/**
	 * ...
	 * @author Adrian R
	 */
	public class VideoBox extends Sprite {

		
		protected static var arBlockedIDs:Array = new Array();
		
		//Biến sử dụng video
		protected var nWidth:Number;
		protected var nHeight:Number;
		protected var oUser:Object;
		protected var vid:Video;

		// Thiết lập màu bg video và border
		protected var spVideoBg:Sprite;
		protected var spBorder:Sprite;
		
		//Khai báo text User và Nút Report
		protected var txtUsername:TextField;
		protected var btnReport:ShapeButton;
		// Khai báo nút hiển thị video và không hiển thị
		protected var btnShowVideo:LibraryButton;
		protected var btnBlockVideo:LibraryButton;
		
		//Thiết lập video
		public function VideoBox(nWidth:Number, nHeight:Number) {

			this.nWidth = nWidth;
			this.nHeight = nHeight;
			
			graphics.beginFill(0xffffff);
			graphics.drawRect(0, 0, nWidth, nHeight);
			graphics.endFill();
			
			txtUsername = new TextField();
			txtUsername.antiAliasType = AntiAliasType.ADVANCED;
			txtUsername.embedFonts = true;
			txtUsername.defaultTextFormat = new TextFormat(new VAGRound().fontName, 14, 0x000000, false, false, false, null, null, TextFormatAlign.CENTER);
			txtUsername.selectable = false;
			txtUsername.width = nWidth - 4;
			txtUsername.text = "Username";
			txtUsername.height = txtUsername.textHeight + 4;
			txtUsername.x = 2;
			txtUsername.y = (20 - txtUsername.height) / 2;
			addChild(txtUsername);//Add
			
			btnReport = new ShapeButton(50, 18, "Report");
			btnReport.x = nWidth - btnReport.width - 2;
			btnReport.y = (20 - btnReport.height) / 2;
			//addChild(btnReport);//add
			
			buildInterface();
			
			spBorder = new Sprite();
			spBorder.graphics.beginFill(0xcccccc);
			spBorder.graphics.drawRect(0, 0, nWidth, nHeight);
			spBorder.graphics.drawRect(1, 1, nWidth - 2, nHeight - 2);
			spBorder.graphics.endFill();
			addChild(spBorder);
			
			this.visible = false;
		}
		
		protected function buildInterface():void {
			//trace("VideoBox buildInterface");
			buidVideo(0, 0, nWidth, nHeight);
		}
		
		protected function buidVideo(nX:Number, nY:Number, nVideoWidth:Number, nVideoHeight:Number):void {
			vid = new Video(nVideoWidth, nVideoHeight);
			
			
			spVideoBg = new Sprite();
			spVideoBg.graphics.beginFill(0x000000);
			spVideoBg.graphics.drawRect(0, 0, nVideoWidth, nVideoHeight);
			spVideoBg.graphics.endFill();
			
			spVideoBg.x = vid.x = nX;
			spVideoBg.y = vid.y = nY;
			
			addChild(spVideoBg);
			addChild(vid);
		}
		public function set setTimekeeperValue(num:Number):void{
			
		}
		public function set user(oUser:Object):void {
			if (oUser) {
				this.visible = true;
				if (this.oUser && this.oUser.id == oUser.id) {
					
				}else {
					
					txtUsername.text = oUser.username;
					
					if(oUser.id == RTMPCommunicator.getInstance().currentUser.id){
						vid.attachCamera(RTMPCommunicator.getInstance().currentCamera);
					}else if(arBlockedIDs.indexOf(oUser.id) != -1){
						vid.attachNetStream(null);
					}else {
						vid.attachNetStream(RTMPCommunicator.getInstance().getNsIn(oUser.id));
					}
				}
			}else {
				this.visible = false;
				vid.attachNetStream(null);
			}
			
			this.oUser = oUser;
		}
		
		public function get user():Object {
			return oUser;
		}
		
		
		
		protected function showVideo(bShow:Boolean):void {
			var nBlockIndex = arBlockedIDs.indexOf(oUser.id);
			
			if (bShow) {
				if (nBlockIndex != -1) {
					arBlockedIDs.splice(nBlockIndex, 1);
				}
				
				vid.attachNetStream(RTMPCommunicator.getInstance().getNsIn(oUser.id));
			}else {
				if (nBlockIndex != -1) {
					arBlockedIDs.push(oUser.id);
				}
				
				vid.attachNetStream(null);
			}
		}
		
	}

}