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
    var filterProperty = "filter"; // Fallback value

    function setup() {
        var prefixedProperties = ['-webkit-filter', '-ms-filter', '-o-filter', '-moz-filter'];
        var customFilterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1)';
        $div = $('<div></div>').appendTo($('body'));

        for (var i = 0; i < prefixedProperties.length; ++i) {
            $div.css(prefixedProperties[i], customFilterValue);
            if ($div.css(prefixedProperties[i]) == customFilterValue)
                filterProperty = prefixedProperties[i];
        }
    }

    function testCustomFiltersInline() {
        module('CSS Custom Filters - Inline Syntax', { 'setup': setup });

        test('Inline Syntax', function() {
            equal($div.css(filterProperty), 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1)', 'Simple Inline Filter');
        })
    }

//    function testCustomFiltersAtRule() {
//        module('CSS Custom Filters - @filter syntax', { 'setup': setup });
//
//        // There's no real need to use a new setup method here.
//        test('Syntax', function() {
//            var $sheet = $('style');
//            $sheet.appendTo($('head'));
//
//            if (prova.styleSheet)
//                console.log('EVVAIIIIIII!!!!!!');
//            stylesheet.insertRule("@-webkit-filter test-filter {}", 0);
//            var cssRule = stylesheet.cssRules.item(0);
//            console.log('CSSRULE ==================== ' + cssRule);
//        })
//    }

    testCustomFiltersInline();
//    testCustomFiltersAtRule();
})   
