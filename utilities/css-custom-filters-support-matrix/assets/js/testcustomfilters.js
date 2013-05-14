/*
Copyright (C) 2013 Adobe Systems, Incorporated. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
$(function () {

    function removeBaseURL(src) {
        var urlRegexp = /url\(([^\)]*)\)/g;
        return src.replace(urlRegexp, function(match, url) {
            return "url(" + url.substr(url.lastIndexOf("/") + 1) + ")";
        });
    }

    var $div;
    var filterProperty = "BOHBOH"; // Fallback value - TODO: This must be "filter"

    function setup() {
        var prefixedProperties = ['-webkit-filter', '-moz-filter', '-ms-filter', '-o-filter'];
        var customFilterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop))';
        $div = $('<div></div>').appendTo($('body'));

        for (var i = 0; i < prefixedProperties.length; ++i)
            if ($div.css(prefixedProperties[i], customFilterValue).css(prefixedProperties[i]) == customFilterValue)
                filterProperty = prefixedProperties[i];
    }

    function testCustomFiltersInline() {
        module('CSS Custom Filters', { 'setup': setup });

        test('Inline Syntax', function() {
            equal($div.css(filterProperty), 'custom(none mix(url(http://www.example.com/) normal source-atop))', 'Simple Inline Filter');
            console.log('---- Stiamo usando: ' + filterProperty);
        })
    }

    testCustomFiltersInline();
})   
