
function checkSupportForCustomFilter() {
    var properties = ["", "-webkit-filter", "-moz-filter", "-ms-filter", "-o-filter"];
    var value = "custom(none mix(url(http://www.example.com/)))";
    var div = $("<div/>");

    for (var i = 0; i < properties.length; ++i)
        if (div.css(properties[i], value).css(properties[i]) == value)
            return true;

    return false;
}

function addBrowserVersionWarning() {
    var text = "Your browser does not implement Custom Filters using Shaders yet, please download <a href=\"https://tools.google.com/dlpage/chromesxs\">Chrome Canary</a> or a <a href=\"https://www.google.com/chrome/eula.html?extra=devchannel\">Chrome Dev Build</a> and enable <a href=\"http://blogs.adobe.com/cantrell/archives/2012/07/all-about-chrome-flags.html\">CSS Shaders flag</a>, or download the latest <a href=\"http://nightly.webkit.org/\">WebKit Nightly Build</a> to see this sample in action.";
    var div = document.createElement("div");
    div.innerHTML = text;
    div.className = "BrowserDetectorNote";
    var s = div.style;
    s.background = "lemonchiffon";
    s.color = "black";
    s.padding = "10px";
    s.paddingRight = "120px";
    s.borderBottom = "1px solid darkgray";
    s.fontSize = "14px";
    var insertionPoint =  document.body;
    if (insertionPoint.firstChild)
        insertionPoint.insertBefore(div, insertionPoint.firstChild);
    else
        insertionPoint.appendChild(div);
}

if (!window.addEventListener)
    window.onload = addBrowserVersionWarning;
else {
    window.addEventListener("load", function() {
        if (!checkSupportForCustomFilter())
            addBrowserVersionWarning();
    }, false);
}

