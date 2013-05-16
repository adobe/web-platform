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
    var filterValue;

    function setup() {
        var prefixedProperties = ['-webkit-filter', '-ms-filter', '-o-filter', '-moz-filter'];
        var customFilterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 10 20)';
        $div = $('<div></div>').appendTo($('body'));

        for (var i = 0; i < prefixedProperties.length; ++i) {
            $div.css(prefixedProperties[i], customFilterValue);
            if ($div.css(prefixedProperties[i]) == customFilterValue)
                filterProperty = prefixedProperties[i];
        }
        $div.css(filterProperty, '');
    }

    function teardown() {
        $div.remove();
    }


    function testCustomFiltersInline() {
        module('CSS Custom Filters', { 'setup': setup, 'teardown': teardown });

        test('Minimal with mix()', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Minimal shader with mix');
        })

        test('Minimal with no mix()', function() {
            filterValue = 'custom(none url(http://www.example.com/), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Minimal shader with no mix');
        })

        test('array parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, testArray array(1, 2, 3))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Array');
        })

        test('Number parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, number 1 2 3)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Number parameter');
        })

        test('Transform parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, t rotate(0deg))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, t matrix(1, 0, 0, 1, 0, 0))', 'Transform parameter');
        })

        test('Color parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, c rgb(0, 128, 0))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color parameter');
        })

        test('Multiply blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) multiply source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Multiply blend-mode');
        })

        test('Screen blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) screen source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Screen blend-mode');
        })

        test('Overlay blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) overlay source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Overlay blend-mode');
        })

        test('Darken blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) darken source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Darken blend-mode');
        })

        test('Lighten blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) lighten source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Lighten blend-mode');
        })

        test('Color-dodge blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) color-dodge source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color-dodge blend-mode');
        })

        test('Color-burn blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) color-burn source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color-burn blend-mode');
        })

        test('Hard-light blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) hard-light source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Hard-light blend-mode');
        })

        test('Soft-light blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) soft-light source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Soft-light blend-mode');
        })

        test('Difference blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) difference source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Difference blend-mode');
        })

        test('Exclusion blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) exclusion source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Exclusion blend-mode');
        })

        test('Color blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) color source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color blend-mode');
        })

        test('Hue blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) hue source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Hue blend-mode');
        })

        test('Saturation blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) saturation source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Saturation blend-mode');
        })

        test('Luminosity blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) luminosity source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Luminosity blend-mode');
        })

        test('XOR alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal xor), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'XOR alpha-compositing');
        })

        test('Clear alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal clear), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Clear alpha-compositing');
        })

        test('Copy alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal copy), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Copy alpha-compositing');
        })

        test('Source-over alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-over), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Source-over alpha-compositing');
        })

        test('Destination-over alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-over), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-over alpha-compositing');
        })

        test('Source-in alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-in), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Source-in alpha-compositing');
        })

        test('Destination-in alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-in), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-in alpha-compositing');
        })

        test('Source-out alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-out), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Source-out alpha-compositing');
        })

        test('Destination-out alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-out), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-out alpha-compositing');
        })

        test('Destination-atop alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-atop alpha-compositing');
        })

        test('Lighter alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal lighter), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Lighter alpha-compositing');
        })

        test('Darker alpha-compositing', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal darker), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Darker alpha-compositing');
        })

        test('mat2() parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test mat2(1, 2, 3, 4))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'mat2()');
        })

        test('mat3() parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test mat3(1, 2, 3, 4, 5, 6, 7, 8, 9))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'mat3()');
        })

        test('mat4() parameter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'mat4()');
        })

//        test('Number parameter', function() {
//            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test (1, 2, 3, 4, 5, 6, 7, 8, 9))';
//            $div.css(filterProperty, filterValue);
//            equal($div.css(filterProperty), filterValue, 'mat3()');
//        })

    }

//    function testCustomFiltersAtRule() {
//        module('CSS Custom Filters - @filter syntax', { 'setup': setup });
//
        // There's no real need to use a new setup method here.
//        test('Syntax', function() {
//            var filterRuleString = "@" + filterProperty + " test-filter {}";
//            var docStyleSheets = document.styleSheets;
//            var lastStyleSheet = docStyleSheets.length - 1;
//            var lastCssRule = docStyleSheets.item(lastStyleSheet).cssRules.length - 1;
//            var refSheet = docStyleSheets.item(lastStyleSheet);
//
//            test('@filter syntax', function() {
//                equal(refSheet.insertRule(filterRuleString, lastCssRule), lastCssRule, 'Simple @filter');
//            })
//        })
//    }

    testCustomFiltersInline();
    //testCustomFiltersAtRule();
})   
