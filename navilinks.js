
////////////////////////////////////////////////////////
// useful to test, to get GET params
function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}
var PARAMS = getSearchParameters();
////////////////////////////////////////////////////////


var W,H;
var PROXYURL = "proxy/miniProxy.php/";
var UIBLOCKED = false;
var BLACKLIST = false;
var BLACKLISTED = [
  "youtube\.com",
  "google\.com",
  "apple\.com",
  "facebook\.com",
  "twitter\.com",
  "amazon\.com",
  "yahoo\.com",
  "linkedin\.com",
  "vimeo\.com",
  "github\.com"
];


////////////////////////////////////////////////////////
// extract domain from url
function getdomain(url) {
  var doms = url.replace(/^https*:\/\//,"").toLowerCase().split("/");
  if(doms && doms.length>0) {
    var spl = doms[0].split(".");
    var ext = spl.pop();
    var dom = spl.pop();
    return dom+"."+ext;
  } else
    return "no-domain-?";
};

////////////////////////////////////////////////////////
// determine if we want the link
function isgoodlink(link) {
  var blcklisted = false;
  if(BLACKLIST) {
    BLACKLISTED.forEach(function(url,i) {
      var rxp = new RegExp(url,"i");
      blcklisted = blcklisted || rxp.test(link);
    })
    if(blcklisted)
      console.log("Blacklisted:",link);
  }
  return link && link.length>3 && /\./g.test(link) && !blcklisted;
};

////////////////////////////////////////////////////////
// get all the links from iframe
function getiframelinks() {
  var links = [];
  $("#iframe").contents().find('a').each( function(i,d) {
    var srgx = new RegExp("^.*"+PROXYURL,'i');
    var url = $(d).attr('href');
    if(url) url = url.replace(srgx,"");
    if(isgoodlink(url))
      links.push({
        url: url,
        proxy: PROXYURL+url,
        domain: getdomain(url),
        name: $(d).text().slice(0,30)
      });
  });
  return links;
};

////////////////////////////////////////////////////////
// triggerd to go to the next url
function navigateto(nexturl) {
  if(!UIBLOCKED) {
    UIBLOCKED = true;
    console.log("Navigating to nexturl:",nexturl)
    var proxyurl = PROXYURL+nexturl;
    $("#status #url").text(nexturl);
    $("#iframe").attr("src",proxyurl);
  } else {
    console.log("UIBLOCKED, doing nothing");
  }
};

////////////////////////////////////////////////////////
// get [0,1]-[0,1] position based on index, total, and ration wanted
function getPosition(k,total) {

  var RATIO = 1.5; //w/h
  var c = Math.ceil( Math.sqrt(total/RATIO) ); // number of cells to make a grid containing all
  var nw = RATIO*c; // nw is the horizontal number of cell 
  var nh = c;
  var cellW = (W/nw);
  var cellH = (H/nh)
  var col = k%nw;
  var row = Math.floor(k/nw);
  var g = 0.15; //gutter < 0.5 !
  var posx = cellW*col + cellW*(g+Math.random()*(1-g)) - 70;
  var posy = cellH*row + cellH*(g+Math.random()*(1-g)) - 20;

  // random pos (to test)
  //var posx = Math.random()*W;
  //var posy = Math.random()*H;
  return {x:posx,y:posy};
}

////////////////////////////////////////////////////////
//
function clicklink(nextlink) {
  console.log("clicked link:",nextlink);
  $('#links .active').removeClass("active").addClass("past");
  navigateto(nextlink);
};

////////////////////////////////////////////////////////
// will be called whenever the iframe is fully loaded
function frameloaded() {
  console.log("iFrame finished loading!");

  // make all present links to disapear
  $('#simplelist ul').empty();
  $('#links .past').remove();
  $('#links').append($("<div class='plan arriving'>"));

  // add the fresh new links
  var links = getiframelinks();
  console.log("Links:",links);

  links.forEach(function(l,i) {
    var newL = Handlebars.compile( $("#linkcloud-template").html() )(l);
    var div = $(newL);
    
    div.click(function(){
      clicklink(l.url);
    })
    
    //var x,y = getPosition(i,links.length);
    var pos = getPosition(i,links.length);
    div.css({
      left: pos.x,
      top: pos.y
    });

    // add galaxy
    $('#links .plan.arriving').append(div);
    
    // add in simple list
    var listelem = Handlebars.compile( $("#linklist-template").html() )(l);
    $('#simplelist ul').append($("<li>").html(listelem));

  });

  // at the end, make them appear
  setTimeout(function() {
    //console.log("now appearing.");
    $('#links .plan.arriving').addClass("active").removeClass("arriving"),
    1000
  })

  UIBLOCKED = false;
}


////////////////////////////////////////////////////////
// mouse position will pan vie, but throttled
function directPan(m) {
  console.log("now panning:",m);
  $("#links .plan.active").css({
    left: -m.x + W/2,
    top: -m.y + H/2
  })
};
var throttlePan = _.throttle(directPan,200);


////////////////////////////////////////////////////////
// INPUT CHANGES
$( document ).ready(function() {

  W = $(document).width();
  H = $(document).height();
  console.log("Window:",W,H);

  $("#input").keypress(function(event) {
    if(event.which==13) { // ENTER
      var url = $(this).val();
      console.log("Typed new url:",url);
      if(isgoodlink(url)) {
        navigateto(url);
      } else {
        console.log("bad url given");
      }
    }
  })
  // iframe toggle
  $("#iframe").toggle($('#toggleframe').is(":checked"));
  $('#toggleframe').change(function() { $("#iframe").toggle(); });

  // list toggle
  $("#simplelist").toggle($('#togglelist').is(":checked"));
  $('#togglelist').change(function() { $("#simplelist").toggle(); });
  $( "html" ).mousemove(function(event) {
    var m = {};
    m.x = event.clientX;
    m.y = event.clientY;
    //console.log("mouse:",mx,my);
    //directPan(m);
    //throttlePan(m);
  });

  // if set on GET, start with given url
  if(PARAMS.u) navigateto(PARAMS.u);

});



