function checkBrowserVersion() {
    return (navigator && navigator.userAgent.indexOf("Chrome/20.0.1123.0") != -1
            && document && document.body && document.body.style.webkitAlphaCompositing !== undefined);
}

function detectOsName() {
    var os = "Unknown";
    if (navigator.platform.indexOf("Win") != -1)
        os = "Windows";
    if (navigator.platform.indexOf("Mac") != -1)
        os = "Mac";
    if (navigator.userAgent.indexOf("iPhone") != -1)
        os = "iPhone";
    return os;
}

function addBrowserVersionWarning() {
    var downloadUrls = {
        "Windows": "https://github.com/downloads/adobe/webkit/PrototypeEnhancementsForChromiumWin-may2012-f2f.zip",
        "Mac": "https://github.com/downloads/adobe/webkit/PrototypeEnhancementsForChromiumMac-may2012-f2f.zip"
    };
    var os = detectOsName();
    var downloadLink = !!downloadUrls[os]
                        ? ("Please click <a href='" + downloadUrls[os] + "'>here</a> to download a WebKit based prototype from Adobe.") 
                        : "Your platform does not support the WebKit based prototype from Adobe.";
    var customBuildNote = document.getElementById("custom-build-note");
    var usePlural = customBuildNote ? (customBuildNote.className + "").indexOf("use-plural") != -1 : false;
    var text = (usePlural ? "These samples require" : "This sample requires") + " a prototype browser implementation! " + downloadLink +
            " For more information visit the <a href='https://github.com/adobe/webkit/tree/may2012-f2f-prototype'>project page</a> on GitHub.";
    var div = document.createElement("div");
    div.innerHTML = text;
    div.className = "BrowserDetectorNote";
    if (!customBuildNote) {
        var s = div.style;
        s.background = "lemonchiffon";
        s.color = "black";
        s.padding = "10px";
        s.paddingRight = "120px";
        s.borderBottom = "1px solid darkgray";
        s.fontSize = "14px";
    }
    var insertionPoint = customBuildNote || document.body;
    if (insertionPoint.firstChild)
        insertionPoint.insertBefore(div, insertionPoint.firstChild);
    else
        insertionPoint.appendChild(div);
}

if (!window.addEventListener)
    window.onload = addBrowserVersionWarning;
else {
    window.addEventListener("load", function() {
        if (!checkBrowserVersion())
            addBrowserVersionWarning();
    }, false);
}

