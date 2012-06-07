<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>eCSSential | Test Template</title>
		<script>
			<!-- INLINE ECSSENTIAL TO PREVENT REQUEST -->
			<? include( "../../dist/eCSSential.min.js" ); ?>				
			eCSSential({ 
				"all": "css/all.css",
				"(min-width: 20em)": "css/min-20em.css",
				"(min-width: 37.5em)": "css/min-37.5em.css",
				"(min-width: 50em)": "css/min-50em.css",
				"(min-width: 62.5em)": "css/min-62.5em.css"
			}, {
				// Set concat option to return the format quickConcat.php uses
				concat: function( arr ){
					return "quickconcat.php?files=" + arr.join();
				}
			} );
		</script>
		<!-- no JS? Put fallback CSS link here. -->
		<noscript><link href="quickconcat.php?files=css/all.css,css/min-20em.css,css/min-37.5em.css,css/min-50em.css,css/min-62.5em.css" rel="stylesheet"></noscript>
		<!-- /CSS -->
		</head>
	<body>
		<h1> eCSSential</h1>
		<p>An experiment in optimized loading of mobile-first responsive CSS.</p>
		<p>[c]2012 @scottjehl, MIT/GPLv2</p>
	
		<p class="explain">Each stylesheet will add a line of text below to announce its presence and whether its intended breakpoint is currently active. Note that this script is merely concerned with improving stylesheet loading performance, but how and where those loaded stylesheets apply is still controlled by CSS media queries.</p>
		
		<!-- just some example elements for the various CSS files to populate and make their presence/visibility known -->
		<p class="a"></p>
		<p class="b"></p>
		<p class="c"></p>
		<p class="d"></p>
		<p class="e"></p>
	</body>
</html>
