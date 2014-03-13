package display {
	import fl.transitions.easing.Regular;
	import fl.transitions.Tween;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	/**
	 * ...
	 * @author Adrian R
	 */
	public class ShapeButton extends Sprite {
		protected var nWidth:Number;
		protected var nHeight:Number;
		protected var sText:String;
		protected var nBorderThickness:Number;
		
		protected var spNormal:Sprite;
		protected var spHover:Sprite;
		protected var spDisabled:Sprite;
		
		private var oTweens:Object;
		private var bEnabled:Boolean;
		
		protected var sTextY:Number;
		
		public function ShapeButton(nWidth:Number, nHeight:Number, sText:String = null, 
									xNormalColor:*= 0, xNormalApha:*= 0, nNormalBorderColor:Number = 0x00417a, nNormalBorderAlpha:Number = 0, nNormalTextColor:Number = 0x00417a,
									xHoverColor:*= 0, xHoverAlpha:*= 0, nHoverBorderColor:Number = 0xffffff, nHoverBorderAlpha:Number = 0, nHoverTextColor:Number = 0xff0000 ) {
			
			//trace("XXX sTextY = " + sTextY);
			
			this.nWidth = nWidth;
			this.nHeight = nHeight;
			this.sText = sText;
			
			if (xNormalColor == null ) {
				xNormalColor = [0xffffff, 0xe0e0e0];
			}
			if (xNormalApha == null ) {
				xNormalApha = [1, 1];
			}
			if (xHoverColor == null ) {
				xHoverColor = [0x0170d1, 0x00417a];
			}
			if (xHoverAlpha == null ) {
				xHoverAlpha = [1, 1];
			}
			
			var oShape:Object = buildPath();
			
			var spBg:Sprite;
			var spBorder:Sprite;
			
			var oData:Object = {
				spNormal : {
					xColor: xNormalColor,
					xAlpha: xNormalApha,
					nBorderColor: nNormalBorderColor,
					nBorderAlpha: nNormalBorderAlpha,
					fmt: new TextFormat(new VAGRound().fontName, 12, nNormalTextColor, false, false, false, null, null, TextFormatAlign.CENTER)
				},
				spHover : {
					xColor: xHoverColor,
					xAlpha: xHoverAlpha,
					nBorderColor: nHoverBorderColor,
					nBorderAlpha: nHoverBorderAlpha,
					fmt: new TextFormat(new VAGRound().fontName, 12, nHoverTextColor, false, false, false, null, null, TextFormatAlign.CENTER)
				},
				spDisabled : {
					xColor: [0xffffff, 0x666666],
					xAlpha: [1, 1],
					nBorderColor: 0x00417a,
					nBorderAlpha: 0.6,
					fmt: new TextFormat(new VAGRound().fontName, 12, nNormalTextColor, false, false, false, null, null, TextFormatAlign.CENTER)
				}
			}
			
			var s:String;
			var sp:Sprite;
			var txt:TextField;
			for (s in oData) {
				sp = new Sprite();
				spBg = Utils.buildShape(nWidth, nHeight, oShape["arPath"], oShape["arRadius"],  oData[s]["xColor"], oData[s]["xAlpha"]);
				spBorder = Utils.buildShape(nWidth, nHeight, oShape["arBorderPath"], oShape["arBorderRadius"], oData[s]["nBorderColor"], oData[s]["nBorderAlpha"], oShape["arPath"], oShape["arRadius"] );
				sp.addChild(spBorder);
				sp.addChild(spBg);
				addChild(sp);
				
				if (sText) {
					txt = new TextField();
					txt.antiAliasType = AntiAliasType.ADVANCED;
					txt.embedFonts = true;
					txt.defaultTextFormat = oData[s]["fmt"];
					txt.width = nWidth;
					txt.text = sText;
					txt.height = txt.textHeight + 4;
					txt.x = 0;
					txt.y = (isNaN(sTextY)?(nHeight - txt.height) / 2:sTextY);
					sp.addChild(txt);
				}
				
				this[s] = sp;
			}
			
			Utils.blackAndWhite(spDisabled, true);
			
			bEnabled = true;
			
			mouseChildren = false;
			buttonMode = true;
			
			oTweens = new Object();
			spDisabled.visible = false;
			
			spHover.alpha = 0;
			addEventListener(MouseEvent.ROLL_OVER, onRollOver);
			addEventListener(MouseEvent.ROLL_OUT, onRollOut);
		}
		
		
			
		private function onRollOver(evt:MouseEvent = null):void {
			if (oTweens["spHover.alpha"] != null) {
				oTweens["spHover.alpha"].stop();
			}
			oTweens["spHover.alpha"] = new Tween(spHover, "alpha", Regular.easeOut, spHover.alpha, 1, 4);
			
			if (oTweens["spNormal.alpha"] != null) {
				oTweens["spNormal.alpha"].stop();
			}
			oTweens["spNormal.alpha"] = new Tween(spNormal, "alpha", Regular.easeOut, spNormal.alpha, 0, 4);
		}
		
		private function onRollOut(evt:MouseEvent = null):void {
			if (oTweens["spHover.alpha"] != null) {
				oTweens["spHover.alpha"].stop();
			}
			oTweens["spHover.alpha"] = new Tween(spHover, "alpha", Regular.easeOut, spHover.alpha, 0, 4);
			
			if (oTweens["spNormal.alpha"] != null) {
				oTweens["spNormal.alpha"].stop();
			}
			oTweens["spNormal.alpha"] = new Tween(spNormal, "alpha", Regular.easeOut, spNormal.alpha, 1, 4);
		}
		
		
		public function set enabled(bEnabled:Boolean):void {
			if (this.bEnabled == bEnabled) {
				return;
			}
			
			this.bEnabled = bEnabled;
			if (bEnabled) {
				buttonMode = true;
				mouseEnabled = true;
				spNormal.visible = spHover.visible = true;
				spDisabled.visible = false;
			}else {
				buttonMode = false;
				mouseEnabled = false;
				spNormal.visible = spHover.visible = false;
				spDisabled.visible = true;
			}
		}
		
		public function get enabled():Boolean {
			return bEnabled;
		}
		
		
		protected function buildPath():Object {
			nBorderThickness = 1;
			
			var oShape:Object = new Object();
			oShape["arPath"] = [	
									new Point(nBorderThickness, nBorderThickness), 
									new Point(nWidth - nBorderThickness, nBorderThickness), 
									new Point(nWidth - nBorderThickness, nHeight - nBorderThickness), 
									new Point(nBorderThickness, nHeight-nBorderThickness)
								];
			oShape["arRadius"] = [4, 4, 4, 4];
			oShape["arBorderPath"] = [new Point(0, 0), new Point(nWidth, 0), new Point(nWidth, nHeight), new Point(0, nHeight)];
			oShape["arBorderRadius"] = [5, 5, 5, 5];
			
			return oShape;
		}
		
	}

}