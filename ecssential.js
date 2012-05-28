/*! eCSSential.js: An experiment in optimized loading of mobile-first responsive CSS. [c]2012 @scottjehl, MIT/GPLv2 */
window.ecssential = function( css ){
	var load = [], defer = [], sw = Math.max( screen.width, screen.height );
		
	for( var i in css ){
		if( css.hasOwnProperty( i ) ){
			var inum = parseFloat( i );
			// if stylesheet will apply at current viewport width, queue for blocking load
			if( window.innerWidth >= inum ) {
				load.push( css[ i ] );
			}
			// otherwise, queue it for deferred load, as long as it could potentially apply
			else if( sw >= inum ){
				defer.push( css[ i ] );
			}
		}
	}
	
	// document.write the stylesheet that should block
	if( load.length ){
		document.write( '<link rel="stylesheet" href="' + load.join( "," ) + '=concat">' );
	}
	
	// defer the load of the stylesheet that could later apply
	if( defer.length ){
		var link = document.createElement( "link" ),
			head = document.getElementsByTagName( "head" )[0];
		link.rel = "stylesheet";
		link.href = defer.join( "," ) + "=concat";
		setTimeout(function(){
			head.appendChild( link );
		}, 100 );
	}
};