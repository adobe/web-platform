(function() {
	if (window.navigator.userAgent.match(/msie 10/i)) {
		return;
	}
	//Create <link/> element
	var cssElem = document.createElement("link");
	cssElem.setAttribute("rel", "stylesheet");
	cssElem.setAttribute("type", "text/css");
	cssElem.setAttribute("href", "assets/iechecker.css");
	document.getElementsByTagName("head")[0].appendChild(cssElem);

	//Create button
	var container = document.createElement("div");
	container.id = "warning";
	container.innerHTML = "You don't appear to be running IE10. This sample was specifically designed to test CSS Regions in IE10."

	document.body.appendChild(container);
})();