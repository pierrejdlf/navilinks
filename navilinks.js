
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



var PROXYURL = "proxy/miniProxy.php/";
var UIBLOCKED = false;



////////////////////////////////////////////////////////
// extract domain from url
function getdomain(url) {
  var doms = url.replace(/^https*:\/\//,"").split("/");
  if(doms && doms.length>0) {
    var spl = doms[0].split(".");
    spl.shift();
    return spl.join(".").toLowerCase();
  } else
    return "no-domain-?";
};

////////////////////////////////////////////////////////
// determine if we want the link
function isgoodlink(link) {
  return link && link.length>3 && /\./g.test(link);
};

////////////////////////////////////////////////////////
// get all the links from iframe
function getiframelinks() {
  var links = [];
  $("#iframe").contents().find('a').each( function(i,d) {
    var url = $(d).attr('href');
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
// will be called whenever the iframe is fully loaded
function frameloaded() {
  console.log("iFrame finished loading!");

  // make all present links to disapear
  $('#links past').remove();
  $('#links active').removeClass("active").addClass("past");

  // add the fresh new links
  var links = getiframelinks();

  links.forEach(function(i,l) {
    var newL = Handlebars.compile( $("#link-template").html() )(l);
    var div = $(newL);
    div.click(function(){
      console.log("clicked link:",l);
      navigateto(l.url);
    })
    $('#links').append(div);
  });

  UIBLOCKED = false;
}


////////////////////////////////////////////////////////
// INPUT CHANGES
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
$('#toggleframe').change(function() {
  console.log("Toggling iframe.");
  //$(this).is(":checked")
  $("#iframe").toggle();
});

