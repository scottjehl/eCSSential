/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
window.matchMedia=window.matchMedia||function(a,b){var c,d=a.documentElement,e=d.firstElementChild||d.firstChild,f=a.createElement("body"),g=a.createElement("div");return g.id="mq-test-1",g.style.cssText="position:absolute;top:-100em",f.style.background="none",f.appendChild(g),function(a){return g.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',d.insertBefore(f,e),c=g.offsetWidth==42,d.removeChild(f),{matches:c,media:a}}}(document)

/*! eCSSential.js: An experiment in optimized loading of mobile-first responsive CSS. [c]2012 @scottjehl, MIT/GPLv2 */
window.eCSSential = function( css, oldIE, concat ){
	"use strict";
	var load = [],
		defer = [],
		w = window,
		d = w.document,
		insLoc = d.getElementsByTagName( "script" )[0];
	
	for( var mq in css ){					
		if( css.hasOwnProperty( mq ) ){
			// if stylesheet will apply at current viewport width, 
			// or browser is IE lte version 8 and you're intending to polyfill media query support for it,
			// queue for blocking load
			if( ( oldIE && /*!@cc_on!@*/0 && w.navigator.appVersion.match( /MSIE [678]\./ ) ) || w.matchMedia( mq ).matches ){
				load.push( css[ mq ] );
			}
			// otherwise, queue it for deferred load, as long as it could potentially apply, by checking the same query against device-width
			else if( w.matchMedia( mq.replace( /(min|max)(\-width)/, "$1-device$2" ) ).matches ) {
				defer.push( css[ mq ] );
			}
		}
	}
	
	// Make link elements (or one concat'd link) from an array of Stylesheets
	// first argument is array of urls, second argument is bool for inserting meta element marker (only used in block)
	function makeLinks( arr ){
		var marker = arr === load ? '<meta id="eCSS">' : '',
			start = '<link rel="stylesheet" href="',
			end = '">';
		// if the concat option is specified (recommended), pass the array through it and dump the resulting string into a single stylesheet url
		if( concat ){
			return '<link rel="stylesheet" href="' + o.concat( arr ) + '>' + marker;
		}
		// otherwise, make separate link elements
		else {
			return start + arr.join( end + start ) + end + marker;
		}
	}
	
	// document.write the stylesheet that should block
	if( load.length ){
		d.write( makeLinks( load ) );
		insLoc = d.getElementById( "eCSS" );
	}
	
	// defer the load of the stylesheet that could later apply
	if( defer.length ){
		var div = d.createElement( "div" );
		div.innerHTML = makeLinks( defer );
		insLoc.parentNode.insertBefore( div, insLoc );
	}
};