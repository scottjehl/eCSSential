# eCSSential
## An experiment in optimized loading of mobile-first responsive CSS.

- [c]2012 @scottjehl
- License MIT/GPLv2

### Demo link

[http://scottjehl.com/eCSSential/](http://scottjehl.com/eCSSential/)

### Explanation

Loading CSS in an optimized or prioritized fashion is very difficult. In order for a website to load cleanly, all CSS needed for rendering that page layout must be referenced in the `head` of a document. This is because stylesheets loaded in this way will block page rendering until they are loaded and ready to apply. If a stylesheet is referenced later in a document, or even loaded dynamically via JS, users will often see a <abbr title="flash of unstyled content">FOUC</abbr> while that stylesheet loads concurrently with page rendering. Unfortunately, working within this limitation can make for overhead in large-scale responsive designs, particularly if a stylesheet contains a large amount of CSS for breakpoints that don't currently apply at a particular viewport size, or worse, CSS that won't ever apply on a particular device. More unfortunate, using separate `link` elements with `media` attributes to reference stylesheets with their intended breakpoints doesn't prevent those stylesheets from downloading or blocking page rendering, even in environments where they don't currently or will never apply, and it also creates more HTTP requests.
		
This experiment uses a teeny bit of inline JavaScript to determine which of a set of stylesheets should be loaded immediately to allow for clean rendering (any stylesheets intended for  mobile-first breakpoints that currently apply), which stylesheets should be deferred to load asynchronously (any breakpoints that don't currently apply to the current viewport size, but could apply later, given the device's screen size), and which stylesheets should never be loaded at all. Once sorted, the CSS payload is delivered in 2 concatenated requests (with the help of quickconcat.php): the first request is immediate and blocking (synchronous), and the second, deferred and non-blocking (asynchronous).
		
If you're in a desktop browser, you can pop open the demo page and check the developer console to see which stylesheets were loaded immediately and which were deferred; changing your viewport/window width and reloading the page will change where this split occurs.
		
In non-JS environments, this optimized loading won't apply, but nonetheless, all available stylesheets will load via a single concatenated request (which is a current best-practice approach to loading CSS, anyway).
