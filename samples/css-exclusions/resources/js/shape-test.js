/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/
!function(){
    var isEnabled = function() {
        var el = document.createElement('div');
        if (!el)
            return;

        // intentional bias towards -webkit because the prototype uses 
        // code under prefixed notation that is still being debated in the W3C
        el.style.setProperty("-webkit-shape-inside", "rectangle(0, 0, 100%, 100%)");
        return (el.style.getPropertyValue("-webkit-shape-inside") != null);
    }

    var checkSupport = function() {
        if (isEnabled())
            return;
        createWarning();
    }

    var createWarning = function() {
        var warning = document.createElement('div');
        warning.setAttribute('class', 'error');

        var content = [];
        content.push('<p>');
        content.push('<strong>Warning:</strong> You need to use the Chrome Canary browser with experimental WebKit features enabled to see this example working correctly. See <a href="http://adobe.github.com/web-platform/samples/css-exclusions/index.html#browser-support">here</a> for more info.')
        content.push('</p>');
        warning.innerHTML = content.join('');
        document.body.insertBefore(warning, document.body.children[0]);
    }

    document.addEventListener("DOMContentLoaded", checkSupport)
}()
