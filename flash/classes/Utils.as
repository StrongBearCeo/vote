package {
	import flash.display.DisplayObject;
	import flash.display.GradientType;
	import flash.display.Graphics;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.filters.ColorMatrixFilter;
	import flash.filters.GlowFilter;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.system.Capabilities;
	/**
	 * ...
	 * @author Adrian R
	 */
	public class Utils{
		
		public function Utils() {
			
		}
		
		public static function flipHorizontal(dsp:DisplayObject):void {
			var matrix:Matrix = dsp.transform.matrix;
			
			matrix.transformPoint(new Point(0, 0));
			var p:Point = new Point(dsp.x, dsp.y);
			matrix.scale( -1, 1);
			matrix.tx = p.x;
			matrix.ty = p.y;
			dsp.transform.matrix=matrix;
		}
		
		public static function flipVertical(dsp:DisplayObject):void{
			var matrix:Matrix = dsp.transform.matrix;
			matrix.transformPoint(new Point(0, 0));
			var p:Point = new Point(dsp.x, dsp.y);
			matrix.scale( 1, -1);
			matrix.tx = p.x;
			matrix.ty = p.y;
			dsp.transform.matrix=matrix;
		}
		
		public static function scaleAroundPoint(object:DisplayObject, offsetX:Number, offsetY:Number, absScaleX:Number, absScaleY:Number ):void {
			var relScaleX:Number = absScaleX / object.scaleX;
			var relScaleY:Number = absScaleY / object.scaleY;
			var AC:Point = new Point( offsetX, offsetY );
			AC = object.localToGlobal( AC );
			AC = object.parent.globalToLocal( AC );
			var AB:Point = new Point( object.x, object.y );
			var CB:Point = AB.subtract( AC );
			CB.x *= relScaleX;
			CB.y *= relScaleY;
			AB = AC.add( CB );
			object.scaleX *= relScaleX;
			object.scaleY *= relScaleY;
			object.x = AB.x;
			object.y = AB.y;
		}
		
		public static function randomizeArray(srcArray : Array, bZeroMatches:Boolean = false) : Array {
			var returnArray : Array = new Array();
			var orgArray : Array = srcArray.slice();
			while (orgArray.length > 0) {
				var r : uint = Math.floor(Math.random() * orgArray.length);
				if (bZeroMatches) {
					if (srcArray[returnArray.length] == orgArray[r] ) {
						r = (r + 1) % orgArray.length;
					}
				}
				
				returnArray.push(orgArray.splice(r, 1)[0]);
			}
			return returnArray;
		}
		
		public static function duplicateDisplayObject(target:DisplayObject):DisplayObject {
			var targetClass:Class = Object(target).constructor;
			var duplicate:DisplayObject = new targetClass() as DisplayObject;
			
			// duplicate properties
			duplicate.transform = target.transform;
			duplicate.filters = target.filters;
			duplicate.cacheAsBitmap = target.cacheAsBitmap;
			duplicate.opaqueBackground = target.opaqueBackground;
			if (target.scale9Grid) {
				var rect:Rectangle = target.scale9Grid;
				
				if (Capabilities.version.split(" ")[1] == "9,0,16,0"){
					// Flash 9 bug where returned scale9Grid as twips
					rect.x /= 20, rect.y /= 20, rect.width /= 20, rect.height /= 20;
				}
				
				duplicate.scale9Grid = rect;
			}
			
			return duplicate;
		}

		
		public static function traceObject(sTraceMsg:String = "traceObject", oToTrace:Object = null, nTabCount:uint = 0 ):void {
			var i:*;
			var sTabString:String = "";
			for (i = 0; i < nTabCount; i++ ) {
				sTabString += "\t";
			}
			trace(sTraceMsg);
			sTabString += "\t";
			for (i in oToTrace) {
				if (typeof oToTrace[i] == "object" ) {
					traceObject(sTabString+i+" -> ", oToTrace[i], nTabCount+3);
				}else {
					trace(sTabString+i+" : "+oToTrace[i]);
				}
			}
		}
		
		public static function drawSolidArc (grTarget:Graphics, centerX:Number, centerY:Number, innerRadius:Number, outerRadius:Number, startAngle:Number, arcAngle:Number, steps:Number) {
			//
			// Used to convert angles to radians.
			var twoPI = 2 * Math.PI;
			//
			// How much to rotate for each point along the arc.
			var angleStep = arcAngle/steps;
			//
			// Variables set later.
			var angle, i, endAngle;
			//
			// Find the coordinates of the first point on the inner arc.
			var xx = centerX + Math.cos(startAngle * twoPI) * innerRadius;
			var yy = centerY + Math.sin(startAngle * twoPI) * innerRadius;
			//
			// Store the coordiantes in an object.
			var startPoint = { x:xx, y:yy };
			//
			// Move to the first point on the inner arc.
			grTarget.moveTo(xx, yy);
			//
			// Draw all of the other points along the inner arc.
			for(i=1; i<=steps; i++){
				angle = (startAngle + i * angleStep) * twoPI;
				xx = centerX + Math.cos(angle) * innerRadius;
				yy = centerY + Math.sin(angle) * innerRadius;
				grTarget.lineTo(xx, yy);
			}
			//
			// Determine the ending angle of the arc so you can
			// rotate around the outer arc in the opposite direction.
			endAngle = startAngle + arcAngle;
			//
			// Start drawing all points on the outer arc.
			for(i=0; i<=steps; i++){
				//
				// To go the opposite direction, we subtract rather than add.
				angle = (endAngle - i * angleStep) * twoPI;
				xx = centerX + Math.cos(angle) * outerRadius;
				yy = centerY + Math.sin(angle) * outerRadius;
				grTarget.lineTo(xx, yy);
			}
			//
			// Close the shape by drawing a straight
			// line back to the inner arc.
			grTarget.lineTo(startPoint.x, startPoint.y);
		}
		
		public static function buildShape(nWidth:Number, nHeight:Number, arPath:Array, arRadius:Array, nBgColor:* = 0xff0000, nBgAlpha:* = 1, arInnerPath:Array = null, arInnerRadius:Array = null):Sprite {
			var sp:Sprite = new Sprite();
			
			//trace(arRadius);
			if(typeof nBgColor == "number"){
				sp.graphics.beginFill(nBgColor, nBgAlpha);
			}else{
				var m1:Matrix = new Matrix();
				m1.createGradientBox(nWidth, nHeight, Math.PI / 2, 0, 0);
				sp.graphics.beginGradientFill(GradientType.LINEAR, nBgColor, nBgAlpha, new Array(0, 255), m1);
				
			}
			
			Utils.drawRoundPath(sp.graphics, arPath, arRadius, true);
			if(arInnerPath){
				Utils.drawRoundPath(sp.graphics, arInnerPath, arInnerRadius, true);
			}
			sp.graphics.endFill();
			
			return sp;
		}
		
		static public function drawRoundPath(g:Graphics, points:Array, radius:Array, closePath:Boolean = false):void  {  
			var count:int = points.length;  
			if (count < 2) {
				return;  
			}
			if (closePath && count < 3) {
				return;  
			}
		  
			var p0:Point = points[0];  
			var p1:Point = points[1];  
			var p2:Point;  
			var pp0:Point;  
			var pp2:Point;  
		  
			var last:Point;  
			if (!closePath)  {  
				g.moveTo(p0.x, p0.y);  
				last = points[count - 1];  
			}  
		  
			var n:int = (closePath) ? count + 1 : count - 1;  
		  
			for (var i:int = 1; i < n; i++)  {  
				p2 = points[(i + 1) % count];  
		  
				var v0:Point = p0.subtract(p1);  
				var v2:Point = p2.subtract(p1);  
				var r:Number = Math.max(1, Math.min(radius[(i + 1) % count]));  
				v0.normalize(r);  
				v2.normalize(r);  
				pp0 = p1.add(v0);  
				pp2 = p1.add(v2);  
		  
				if (i == 1 && closePath)  {  
					g.moveTo(pp0.x, pp0.y);  
					last = pp0;  
				} else {
					g.lineTo(pp0.x, pp0.y);  
				}
		  
				g.curveTo(p1.x, p1.y, pp2.x, pp2.y);  
				p0 = p1;  
				p1 = p2;  
			}  
		  
			g.lineTo(last.x, last.y);  
		} 
		
		public static function blackAndWhite(oTarget:DisplayObject, bEnabled:Boolean):void {
			if (bEnabled) {
				var rc:Number = 1/3;
				var gc:Number = 1/3;
				var bc:Number = 1/3;
				var cmf:ColorMatrixFilter = new ColorMatrixFilter([rc, gc, bc, 0, 0, rc, gc, bc, 0, 0, rc, gc, bc, 0, 0, 0, 0, 0, 1, 0]);
				oTarget.filters = [cmf];
			} else {
				oTarget.filters = [];
			}
		}
		
		public static function customTrace(_s:String):void{
			trace(_s);// this will call the original flash trace() function
//			ExternalInterface.call("console.log", "FLASH: "+_s);// to get traces outside of flash IDE
				/*implement what you want here*/
		}
	}

}