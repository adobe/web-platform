/*
Copyright (C) 2012 Adobe Systems, Incorporated. All rights reserved.

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
    var $div;

    function setup() {
        $div = $(
            '<div style=\'font: 10px/1 ahem; position: relative; width: 40px; height: 40px; word-break: break-word\'>' +
                '<div class=\'exclusion\' style=\'position: absolute; top: 10px; right: 10px; width: 10px; height: 10px\'></div>' +
                '<div class=\'exclusion\' style=\'position: absolute; bottom: 10px; left: 10px; width: 10px; height: 10px\'></div>' +
                '<span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span>' +
                '<span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span>' +
            '</div>'
        ).appendTo($('body'));
    }

    function teardown(){
        $div.remove();
    }

    function testWrapFlowLayout(value, positions) {
        testExclusionLayout('wrap-flow ' + value, value, null, positions);
    }

    function testExclusionLayout(name, wrapflow, wrapthrough, positions) {
        // See 3.1.1 Example 1
        // Set up a 4x4 grid with exclusions at (2, 1) and (1, 2)
        test(name, function() {
            if (wrapflow)
                $('.exclusion', $div).css('wrap-flow', wrapflow);
            if (wrapthrough)
                $div.css('wrap-through', wrapthrough);
            $('span', $div).each(function(index, element) {
                if (index >= positions.length)
                    return;
                var left = (positions[index]) % 4 * 10;
                var top = Math.floor(positions[index] / 4) * 10;
                // var position = element.position();
                equal(element.offsetLeft, left, 'left should be ' + left + ' for child ' + index + ', was ' + element.offsetLeft);
                equal(element.offsetTop, top, 'top should be ' + top + ' for child ' + index + ', was ' + element.offsetTop);
            })
        })
    }

    function testWrapFlow() {
        module('3.1.1 wrap-flow property', { 'setup': setup, 'teardown': teardown });

        test('wrap-flow default', function() {
            equal($div.css('wrap-flow'), 'auto', 'Initial default value for wrap-flow');
        })
        
        testWrapFlowLayout('auto', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testWrapFlowLayout('both', [0, 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14, 15]);

        testWrapFlowLayout('start', [0, 1, 2, 3, 4, 5, 8, 12, 13, 14, 15]);

        testWrapFlowLayout('end', [0, 1, 2, 3, 7, 10, 11, 12, 13, 14, 15]);

        testWrapFlowLayout('minimum', [0, 1, 2, 3, 7, 8, 12, 13, 14, 15]);

        testWrapFlowLayout('maximum', [0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15]);

        testWrapFlowLayout('clear', [0, 1, 2, 3, 12, 13, 14, 15]);
    }

    function testWrapThrough() {
        module('3.3.1 wrap-through property', { 'setup': setup, 'teardown': teardown });
            
        test('wrap-through default', function(){
            equal($div.css('wrap-through'), 'wrap', 'Initial default value for wrap-through');
        })

        testExclusionLayout('wrap-through wrap', 'both', 'wrap', [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15]);

        testExclusionLayout('wrap-through none', 'both', 'none', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    }

    testWrapFlow();
    testWrapThrough();
})
