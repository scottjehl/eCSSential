/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
window.matchMedia=window.matchMedia||function(a,b){var c,d=a.documentElement,e=d.firstElementChild||d.firstChild,f=a.createElement("body"),g=a.createElement("div");return g.id="mq-test-1",g.style.cssText="position:absolute;top:-100em",f.style.background="none",f.appendChild(g),function(a){return g.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',d.insertBefore(f,e),c=g.offsetWidth==42,d.removeChild(f),{matches:c,media:a}}}(document)

/*! eCSSential.js: An experiment in optimized loading of mobile-first responsive CSS. [c]2012 @scottjehl, MIT/GPLv2 */
window.eCSSential = function( css, okayIElte8 ){
	var load = [], defer = [], w = window, d = w.document;

	for( var mq in css ){					
		if( css.hasOwnProperty( mq ) ){
			// if stylesheet will apply at current viewport width, 
			// or browser is lteIE8 and you're intending to polyfill mq support for it,
			// queue for blocking load
			if( w.matchMedia( mq ).matches || ( okayIElte8 && /*@cc_on!@*/0 && w.navigator.appVersion.match( /MSIE [678]\./ ) ) ) {
				load.push( css[ mq ] );
			}
			// otherwise, queue it for deferred load, as long as it could potentially apply, by checking the same query against device-width
			else if( w.matchMedia( mq.replace( /(min)(\-width)/, "$1-device$2" ) ).matches ) {
				defer.push( css[ mq ] );
			}
		}
	}
	
	// document.write the stylesheet that should block
	if( load.length ){
		d.write( '<link rel="stylesheet" href="' + load.join( "," ) + '=concat">' );
	}
	
	// defer the load of the stylesheet that could later apply
	if( defer.length ){
		var link = d.createElement( "link" ),
			head = d.getElementsByTagName( "head" )[0];
		link.rel = "stylesheet";
		link.href = defer.join( "," ) + "=concat";
		setTimeout(function(){
			head.appendChild( link );
		}, 0 );
	}
};