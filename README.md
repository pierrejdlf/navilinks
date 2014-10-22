navilinks
=========
## use
- you will need PHP 5 activated for the [miniProxy](https://github.com/joshdick/miniProxy)
- just open the `http://localhost/navilinks` page on your own webserver. 
- `http://localhost/navilinks/?u=www.wikipedia.org` to set starting link
- `http://localhost/navilinks/?h=1` to hide same-domain links

## donelist
- removed duplicates (only keep last link when same href)
- updated blacklist !
- colored css classes to distinguish internal(blue) links from external(white)
- sort by external, internal


## todolist
- algorithm to truncate / extract link titles or content to always display human-friendly strings within galaxy
  - remove too shorts/long link titles ?
- entering a new url should stop all the process and load the new page (aka do not BLOCKUI)
- test without animation for arriving links (only css)
- allow clicking any zone (heavy because we need to loop all links positions / mouse position)
- get links dynamically while page loads, not only at the end
- zoom on x/y of clicked link, not always on center, aka js code to also "css-transform-translate"
- auto reload last page (with re-ordered list of links) when no links found or error
- auto mode: after X seconds, click a (random) link near the center of the screen
- increase font-size/decrease z-transform to keep font quality when zooming