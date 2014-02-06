# eCSSential
## Making responsive CSS load the way it should.

- [c]2012 @scottjehl, Filament Group, Inc. 
- Licenses: MIT, GPLv2

### The Problem

Loading CSS in an optimized or prioritized fashion is very difficult. In order for a website to load cleanly, all CSS needed for rendering that page layout must be referenced in the `head` of a document. This is because stylesheets loaded in this way will block page rendering until they are loaded and ready to apply. If a stylesheet is referenced later in a document, or loaded dynamically via JS, users will often see a <abbr title="flash of unstyled content">FOUC</abbr> while that stylesheet loads concurrently with page rendering. 

Unfortunately, this limitation can make for a lot of overhead in responsive designs, particularly if a stylesheet contains a large amount of CSS for breakpoints that don't currently apply at a particular viewport size, or worse, CSS that won't ever apply on a particular device. More unfortunate, using separate `link` elements with `media` attributes to reference stylesheets with their intended breakpoints [doesn't prevent those stylesheets from downloading and blocking page rendering](http://scottjehl.github.com/CSS-Download-Tests/), even in environments where they don't currently or will never apply. 

Lastly, if for some reason a stylesheet takes a long time to load, most browsers will let it continue to block page  rendering for 30 seconds or more! 


### How eCSSential Helps

eCSSential is a JavaScript utility that is designed to make browsers download files in a faster, more responsible manner than they do by default. Technically speaking, it is a tiny bit of JavaScript that when placed in the `head` of a page, determines which of your stylesheets should be loaded immediately and block page rendering (any stylesheets intended for  mobile-first breakpoints that currently apply), which stylesheets should be deferred to load asynchronously (any stylesheets intended for breakpoints that don't currently apply to the current viewport size, but could apply later, given the device's screen size), and which stylesheets should never be loaded at all (any stylesheets intended for viewport dimensions that are larger than the device's screen). Once sorted, the essential (or eCSSential if you will) files are loaded in a way that ensures page rendering will be blocked until they're ready. The other less-essential files are loaded in a non-blocking way, letting the page render while they are fetched. 

In one further improvement to browsers' default loading behavior, stylesheets that are loaded in a blocking manner are given 8 seconds (by default) to load before they are refetched asynchonously, allowing the page to appear and be used. 


## Check out the demos

- [Default eCSSential Usage](http://scottjehl.github.com/eCSSential/examples/default)
- [eCSSential with concatenated CSS files](http://scottjehl.github.com/eCSSential/examples/concat)
- [eCSSential with IE-specific stylesheets](http://scottjehl.github.com/eCSSential/examples/oldIE-separate-CSS)
- [eCSSential with a media query polyfill](http://scottjehl.github.com/eCSSential/examples/oldIE)

### Seeing the Results

If you're in a desktop browser, you can pop open the demo page (try the [concatentated files demo](http://scottjehl.github.com/eCSSential/examples/concat) for the best performance) and check your developer console to see which stylesheets were loaded immediately and which were deferred; changing your viewport/window width and reloading the page will change where this loading split occurs.


## How To Use eCSSential

Using eCSSential is as easy as including the full source of eCSSential.min.js (find that in the `/dist` folder) inline in the head of your page, and then calling `eCSSential()`, passing each of the paths to your CSS files paired with a media query describing where they are intended to apply.
	
	<head>
	    ...
	    <script id="ecssential">
		    <!-- Add eCSSential.min.js inline here -->
		
		    eCSSential({
			    "all": "css/all.css",
			    "(min-width: 20em)": "css/min-20em.css",
			    "(min-width: 37.5em)": "css/min-37.5em.css",
			    "(min-width: 50em)": "css/min-50em.css",
			    "(min-width: 62.5em)": "css/min-62.5em.css"
			});
	    </script>
	</head>

From this, eCSSential will be able to sort which are important up-front, and which can be deferred, or never loaded at all, and inject `link` elements to load the files accordingly.

Because eCSSential requires JavaScript support to perform its optimizations, you might want to follow it with a `noscript` element containing references to any stylesheets you would prefer to load in non-JavaScript environments. If you don't do this, non-JavaScript users will simply receive an unstyled page, so it's up to you how you provide a fallback.

	<head>
	    ...
	    <script id="ecssential">
		    <!-- Add eCSSential.min.js inline here -->
		
		    eCSSential({
			    ....
			});
	    </script>
	    <!-- for non-JS users, load the first few breakpoints for a fallback layout -->
	    <noscript>
		    <link rel="stylesheet" href="css/all.css">
		    <link rel="stylesheet" href="css/min-37.5em.css">
		    <link rel="stylesheet" href="css/min-50em.css">
	    </noscript>
	</head>

That's it! With eCSSential in place, your pages will now  render much faster on many devices (particularly small screens).


## Setting configuration options

eCSSential comes with a number of defaults that can be overridden on a per-call basis. These options are configured by passing a second argument to the `eCSSential` function in the form of an object with one or more key/value pairs.

    eCSSential( {
        "all": "css/all.css",
        "(min-width: 20em)": "css/min-20em.css",
        [_...more files..._]
	},
	// SET CONFIGURATION OPTIONS HERE
	{ optionA: true, optionB: 500 } );

The following sections will reference configuration options that are defined in this manner.


## Optimizing Further with File Concatenation

By default, eCSSential creates individual `link` elements for each stylesheet it requests, which, depending on the number of CSS files you have, can make for a lot of HTTP requests. Reducing HTTP requests is one of the best ways to improve the performance of a site, so eCSSential is designed to work with concatenated files if you instruct it to do so.

Optionally, eCSSential can be configured to fetch all of your CSS via only 2 HTTP requests, of which the first request is immediate and blocking (synchronous), and the second is deferred and non-blocking (asynchronous). To use this feature, you'll need the help of a server-side concatenation tool, such as [QuickConcat](https://github.com/filamentgroup/quickconcat), or a build system that generates all static versions of your potential CSS file combinations. The `examples` directory contains a demo of this feature. You can also find it [here](http://scottjehl.github.com/eCSSential/examples/concat). The demo uses static generated combinations of the CSS files.

To configure eCSSential to fetch concatenated files via a single request, you'll need to define a configuration property of `concat` as a function. The only rules for that `concat` function is that it should accept an array and return a string. For example, if your concatenated CSS files have filenames that are a long joined name of the files they contain, separated by periods with their directories and extensions removed, you might define a `concat` option like this:

    eCSSential({
	    "all": "css/all.css",
	    "(min-width: 20em)": "css/min-20em.css",
	    [_...more files..._]
	},
	{
	    concat: function( files ){
		    return "combined/" + arr.join("").replace( /css\/?/gmi, "" ) + "css";
		}
	});

With that in place, a concatenated URL would end up somethign like this: `css/all.css.min-20em.css.min-37em.css`.

To use with a dynamic concatenator like [QuickConcat](https://github.com/filamentgroup/quickconcat), your concat function might prepend comma-joined CSS files with a `quickconcat.php?files=` path...

    eCSSential({
	    "all": "all.css",
	    "(min-width: 20em)": "min-20em.css",
	    [_...more files..._]
	},
	{
	    concat: function( files ){
		    return "quickconcat.php?files=" + files.join();
		}
	});

Because it's free-form, the `concat` option can work with any concatenation tool you'd like. Check out the `examples/concat/index.html` file for a working example of the `concat` option. 


## Supporting Older Versions of IE

Internet Explorer versions 6-8 have no CSS3 Media Query support. Because of this, you'll need to do a little extra work to get a mobile-first responsive design to render with a proper layout in these browsers. 

Generally, you can do that one of two ways:

- create a separate stylesheet to conditionally deliver layout fixes to these browsers
- use a media query polyfill like [Respond.js](https://github.com/scottjehl/Respond) to make the media queries work like they do in other browsers.

Regardless of your preferred approach, eCSSential has you covered.

### Delivering IE-specific stylesheets

To deliver stylesheets ONLY to specific versions of Internet Explorer, you can reference stylesheets using `IE6`, `IE7`, or `IE8` in place of a media query. You can use one or many of these too, depending on which versions you'd like a stylesheet to load. In the following example, the last stylesheet referenced load in IE 6-8:

    eCSSential({
	    "all": "all.css",
	    "(min-width: 20em)": "css/min-20em.css",
	    "(min-width: 37.5em)": "css/min-37.5em.css",
	    "(min-width: 50em)": "css/min-50em.css",
	    "(min-width: 62.5em)": "css/min-62.5em.css",
		"IE6 IE7 IE8": "css/iedesktopfixes.css"
	});

### Delivering all stylesheets to IE with intent to polyfill media query support

Alternatively, if you would like to load all of your stylesheets in IE 6-8 polyfill media query support to make them work, you can simply pass the configuration `oldIE` option, via the same mechanism used to define a `concat` option above.

    eCSSential({
	    "all": "all.css",
	    "(min-width: 20em)": "css/min-20em.css",
	    "(min-width: 37.5em)": "css/min-37.5em.css",
	    "(min-width: 50em)": "css/min-50em.css",
	    "(min-width: 62.5em)": "css/min-62.5em.css"
	}, { oldIE: true } );

When doing this, just be sure to add [Respond.js](https://github.com/scottjehl/Respond) or an equivalent workaround after the references to these CSS files. 


## Changing the maximum time rendering will block

By default, eCSSential will allow a blocking stylesheet to load for 8 seconds before refetching it and showing the page in whatever state it may be. If you'd like to change this timeout, just pass a different millisecond-based `patience` value in the configuration object, like so:

    eCSSential({
	    "all": "all.css",
	    "(min-width: 20em)": "css/min-20em.css",
	    "(min-width: 37.5em)": "css/min-37.5em.css",
	    "(min-width: 50em)": "css/min-50em.css",
	    "(min-width: 62.5em)": "css/min-62.5em.css"
	//set the max rendering timeout to 6 seconds instead of 8 
	}, { patience: 6000 } );


## Disabling the default deferred stylesheet qualifier

By default, eCSSential will not load stylesheets that are targeted at dimensions not possible on a particular device (based on its screen size). This ammounts to better performance on small screens by reducing HTTP requests, but it does have the potential drawback that if the browser window is moved to a different sized screen, it may not have all of the styles it needs optimize for that new screen. This is somewhat of an edge case, but if you'd like to make sure every non-applicable CSS file is loaded asynchonously, you can pass the `deferAll` option as true.

    eCSSential({
	    "all": "all.css",
	    "(min-width: 20em)": "css/min-20em.css",
	    "(min-width: 37.5em)": "css/min-37.5em.css",
	    "(min-width: 50em)": "css/min-50em.css",
	    "(min-width: 62.5em)": "css/min-62.5em.css"
	}, { deferAll: true } );


## Further notes

- eCSSential includes the `window.matchMedia` polyfill so that it can run CSS3 media queries via JavaScript in browsers that don't support matchMedia. If you don't need to include the `window.matchMedia` polyfill (if say, perhaps it's already in your page), just remove the reference to it in the `grunt.js` file and generate a new build.


## FAQ

### Are There Drawbacks to using eCSSential?

It will make your responsive websites load a lot faster on mobile devices. Oh wait, did you say drawbacks?



