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
        module('CSS Custom Filters - Inline Syntax', { 'setup': setup, 'teardown': teardown });

        test('custom() - fragment shader with alpha-compositing and blend mode', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Minimal shader with mix');
        })

        test('custom() - fragment shader with no alpha-compositing or blend mode', function() {
            filterValue = 'custom(none url(http://www.example.com/), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Minimal shader with no mix');
        })

        /*** ALPHA-COMPOSITING MODES ***/

        test('alpha-compositing - clear', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal clear), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Clear alpha-compositing');
        })

        test('alpha-compositing - copy', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal copy), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Copy alpha-compositing');
        })

        test('alpha-compositing - darker', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal darker), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Darker alpha-compositing');
        })

        test('alpha-compositing - destination-atop', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-atop alpha-compositing');
        })

        test('alpha-compositing - destination-in', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-in), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-in alpha-compositing');
        })

        test('alpha-compositing - destination-out', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-out), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-out alpha-compositing');
        })

        test('alpha-compositing - destination-over', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal destination-over), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Destination-over alpha-compositing');
        })

        test('alpha-compositing - lighter', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal lighter), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Lighter alpha-compositing');
        })

        test('alpha-compositing - source-in', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-in), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Source-in alpha-compositing');
        })

        test('alpha-compositing - source-out', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-out), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Source-out alpha-compositing');
        })

        test('alpha-compositing - source-over', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-over), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Source-over alpha-compositing');
        })

        test('alpha-compositing - XOR', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal xor), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'XOR alpha-compositing');
        })

        /*** BLEND MODES ***/

        test('blend mode - color', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) color source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color blend-mode');
        })

        test('blend mode - color-burn', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) color-burn source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color-burn blend-mode');
        })

        test('blend mode - color-dodge', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) color-dodge source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color-dodge blend-mode');
        })

        test('blend mode - darken', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) darken source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Darken blend-mode');
        })

        test('blend mode - difference', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) difference source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Difference blend-mode');
        })

        test('blend mode - exclusion', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) exclusion source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Exclusion blend-mode');
        })

        test('blend mode - hard-light', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) hard-light source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Hard-light blend-mode');
        })

        test('blend mode - hue', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) hue source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Hue blend-mode');
        })

        test('blend mode - lighten', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) lighten source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Lighten blend-mode');
        })

        test('blend mode - luminosity', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) luminosity source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Luminosity blend-mode');
        })

        test('blend mode - multiply', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) multiply source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Multiply blend-mode');
        })

        test('blend mode - overlay', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) overlay source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Overlay blend-mode');
        })

        test('blend mode - saturation', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) saturation source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Saturation blend-mode');
        })

        test('blend mode - screen', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) screen source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Screen blend-mode');
        })

        test('blend mode - soft-light', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) soft-light source-atop), 1 1)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Soft-light blend-mode');
        })

        /*** PARAMETERS ***/

        test('parameter - array()', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, testArray array(1, 2, 3))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Array');
        })

        test('parameter - color', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, c rgb(0, 128, 0))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Color parameter');
        })

        test('parameter - mat2()', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test mat2(1, 2, 3, 4))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'mat2()');
        })

        test('parameter - mat3()', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test mat3(1, 2, 3, 4, 5, 6, 7, 8, 9))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'mat3()');
        })

        test('parameter - mat4()', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, test mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'mat4()');
        })

        test('parameter - number', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, number 1 2 3)';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), filterValue, 'Number parameter');
        })

        test('parameter - transform', function() {
            filterValue = 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, t rotate(0deg))';
            $div.css(filterProperty, filterValue);
            equal($div.css(filterProperty), 'custom(none mix(url(http://www.example.com/) normal source-atop), 1 1, t matrix(1, 0, 0, 1, 0, 0))', 'Transform parameter');
        })
    }

    /*
     * Returns a boolean indicating wether the *FilterRule is supported.
     */
    function addFilterRule() {
        var filterRuleString = "@" + filterProperty + " test-filter {}";
        var docStyleSheets = document.styleSheets;
        var index_lastStyleSheet = docStyleSheets.length - 1;
        var lastStyleSheet = docStyleSheets.item(index_lastStyleSheet);
        var sheetRules = lastStyleSheet.cssRules ? lastStyleSheet.cssRules : lastStyleSheet.rules;

        var index_lastCssRule = sheetRules.length - 1;
        var retValue;
        try { retValue = lastStyleSheet.insertRule(filterRuleString, index_lastCssRule); }
        catch (ex) { return false; }

        // We check whether the rule has been correctly added and that the type is 17.
        var filterRule = sheetRules.item(retValue);
        var filterType = filterRule.type;
        return retValue == index_lastCssRule && filterType == 17;
    }

    function testCustomFiltersAtRule() {
        module('CSS Custom Filters - @filter Syntax', { 'setup': setup, 'teardown': teardown });

        /*
         * This test is currently failing because of the current status of @filter syntax implementation
         * in UAs.
         */
        test('at-rule syntax', function() { ok(addFilterRule(), 'at-rule syntax'); })
    }

    testCustomFiltersInline();
    testCustomFiltersAtRule();
})   
