/* this file is for logging data in the example pages. Nothing fancy here; look away. */
(function(){
	var data = document.getElementById( "data" );
	if( data && loadCSS ){
		var info = [],
			loaded = [];
		
		// available css info
		info.push( "<p>Available StyleSheets</p><ul>" );
		if( loadCSS.css ){
			for( var i in loadCSS.css ){
				if( loadCSS.css.hasOwnProperty( i ) ){
					info.push( "<li>"+ loadCSS.css[ i ] + " <em>(media=\"" + i + "\")</em></li>" );
				}
			}
		}
		else {
			info.push("<li>None specified</li>");
		}
		info.push("</ul>");
		
		// blocking css info
		info.push( "<p>StyleSheets that loaded immediately (these blocked page rendering)</p><ul>" );
		if( loadCSS.block.length ){
			for( var i = 0, il = loadCSS.block.length; i < il; i++ ){
				info.push( "<li>" + loadCSS.block[ i ].href  + " <em>(media=\"" + loadCSS.block[ i ].mq + "\")</em></li>" );
				loaded.push(loadCSS.block[ i ].href);
			}
		}
		else {
			info.push("<li>None</li>");
		}
		info.push("</ul>");
		
		// deferred css info
		info.push( "<p>StyleSheets that loaded lazily (these did not block page rendering)</p><ul>" );
		if( loadCSS.defer.length ){
			for( var i = 0, il = loadCSS.defer.length; i < il; i++ ){
				info.push( "<li>" + loadCSS.defer[ i ].href + " <em>(media=\"" + loadCSS.defer[ i ].mq + "\")</em></li>" );
				loaded.push(loadCSS.defer[ i ].href);
			}
		}
		else {
			info.push("<li>None</li>");
		}
		info.push("</ul>");
		
		// no load css info
		info.push( "<p>StyleSheets that were excluded from loading at all (often only applies to small screens)</p><ul>" );
		var numexc = 0;
		if( loadCSS.css ){
			for( var i in loadCSS.css ){
				if( loadCSS.css.hasOwnProperty( i ) ){
					var inarr = false;
					for( var j = 0, jl = loaded.length; j < jl; j++ ){
						if( loaded[ j ] === loadCSS.css[ i ] ){
							inarr = true;
						}
					}
					if(!inarr){
						info.push( "<li>"+ loadCSS.css[ i ] + " <em>(media=\"" + i + "\")</em></li>" );
						numexc++;
					}
				}
			}
		}
		if( !numexc ) {
			info.push("<li>None.</li>");
		}
		info.push("</ul>");
		
		// General Stats
		info.push( "<p>General information</p>" );
		info.push("<dl>");
		
		var numlinks = document.getElementsByTagName( "link" ).length;
		
		info.push("<dt>Total number of CSS requests</dt><dd>"+ numlinks +"</dd>");
		info.push("<dt>Total number of blocking CSS requests</dt><dd>"+ (loadCSS.config && loadCSS.config.concat && loadCSS.block.length ? 1 : loadCSS.block.length ) +"</dd>");
		info.push("<dt>Total number of non-blocking CSS requests</dt><dd>"+ (loadCSS.config && loadCSS.config.concat && loadCSS.defer.length ? 1 : loadCSS.defer.length)  +"</dd>");
		info.push("<dt>Initial viewport dimensions</dt><dd>Width: "+ window.innerWidth +", Height: "+ window.innerHeight +"</dd>");
		info.push("<dt>Initial screen dimensions</dt><dd>Width: "+ screen.width +", Height: "+ screen.height +"</dd>");
		info.push("</dl>");

		info.push( "<p><strong>NOTE:</strong> Try resizing your browser and refreshing to see what changes.</p>" );
		
		// write!
		data.innerHTML = info.join("");
	}
}());