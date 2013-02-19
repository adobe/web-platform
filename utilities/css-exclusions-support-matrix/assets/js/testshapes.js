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
    function setupFloatShapeOutside() {
        // Set up a 4x4 grid of content spans
        $div = $(
            '<div style=\'font: 10px/1 Ahem, ahem-wf; position: relative; width: 40px; height: 40px; word-wrap: break-word; overflow-wrap: break-word\'>' +
            '<div class=\'shape-outside\' style=\'float: left; width: 40px; height: 40px\'></div>' +
            '<span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span>' +
            '</div>'
        ).appendTo($('body'));
    }

    function setupExclusionShapeOutside() {
        // Set up a 4x4 grid of content spans
        $div = $(
            '<div style=\'font: 10px/1 Ahem, ahem; position: relative; width: 40px; height: 40px; word-wrap: break-word; overflow-wrap: break-word\'>' +
            '<div class=\'shape-outside\' style=\'position:absolute; top:0; left: 0; width: 40px; height: 40px; wrap-flow: end\'></div>' +
            '<span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span>' +
            '</div>'
        ).appendTo($('body'));
    }

    function setupShapeInside(){
        // Set up a 4x4 grid of content spans
        $div = $(
            '<div style=\'font: 10px/1 Ahem, ahem; position: relative; width: 40px; height: 40px; word-wrap: break-word; overflow-wrap: break-word\'>' +
            '<span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span>' +
            '</div>'
        ).appendTo($('body'));
    }

    function teardown(){
        $div.remove();
    }

    function roughEqual(actual, expected, tolerance, message) {
        ok (Math.abs(actual - expected) < tolerance, message);
    }

    function testLayoutPositions(positions, tolerance) {
        $('span', $div).each(function(index, element) {
            if (index >= positions.length)
                return;
            var left = positions[index] % 4 * 10;
            var top = Math.floor(positions[index] / 4) * 10;
            if (tolerance) {
                roughEqual(element.offsetLeft, left, tolerance, 'left should be ' + left + ' for child ' + index + ', was ' + element.offsetLeft);
                roughEqual(element.offsetTop, top, tolerance, 'top should be ' + top + ' for child ' + index + ', was ' + element.offsetTop);
            } else {
                equal(element.offsetLeft, left, 'left should be ' + left + ' for child ' + index + ', was ' + element.offsetLeft);
                equal(element.offsetTop, top, 'top should be ' + top + ' for child ' + index + ', was ' + element.offsetTop);
            }
        })
    }

    function testShapeOutsideLayout(name, shapeoutside, positions, tolerance) {
        test(name, function() {
            $div.css('shape-outside', shapeoutside);
            testLayoutPositions(positions, tolerance);
        })
    }

    function testShapeInsideLayout(name, shapeinside, positions, tolerance) {
        test(name, function() {
            $div.css('shape-inside', shapeinside);
            testLayoutPositions(positions, tolerance);
        })
    }

    function notImplemented(name) {
        test(name, function() {
            ok(false, name + ' is not yet implemented');
        })
    }

    function testShapeOutside() {
        module('4.4.1 float shape-outside', { 'setup': setupFloatShapeOutside, 'teardown': teardown });

        test('float shape-outside default', function(){
            equal($div.css('shape-outside'), 'auto', 'Initial default value for shape-outside');
        })

        testShapeOutsideLayout('float shape-outside rectangle', 'rectangle(0, 0, 30px, 20px)', [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeOutsideLayout('float shape-outside circle', 'circle(10px, 10px, 10px)', [2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeOutsideLayout('float shape-outside ellipse', 'ellipse(15px, 10px, 15px, 10px)', [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeOutsideLayout('float shape-outside polygon', 'polygon(0 10px, 10px 0, 20px 0, 30px 10px, 20px 20px, 10px 20px', [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        notImplemented('float shape-outside url(svg)');

        notImplemented('float shape-outside url(img)');

        module('4.4.1 exclusion shape-outside', { 'setup': setupExclusionShapeOutside, 'teardown': teardown });
        
        test('exclusion shape-outside default', function(){
            equal($div.css('shape-outside'), 'auto', 'Initial default value for shape-outside');
        })

        testShapeOutsideLayout('exclusion shape-outside rectangle', 'rectangle(0, 0, 30px, 20px)', [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeOutsideLayout('exclusion shape-outside circle', 'circle(10px, 10px, 10px)', [2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeOutsideLayout('exclusion shape-outside ellipse', 'ellipse(15px, 10px, 15px, 10px)', [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeOutsideLayout('exclusion shape-outside polygon', 'polygon(0 10px, 10px 0, 20px 0, 30px 10px, 20px 20px, 10px 20px', [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        notImplemented('exclusion shape-outside url(svg)');

        notImplemented('exclusion shape-outside url(img)');
    }

    function testShapeInside() {
        module('4.4.2 shape-inside', { 'setup': setupShapeInside, 'teardown': teardown });

        test('shape-inside default', function() {
            equal($div.css('shape-inside'), 'outside-shape', 'Initial default value for shape-inside');
        });

        testShapeInsideLayout('shape-inside rectangle', 'rectangle(10px, 10px, 20px, 20px)', [5, 6, 9, 10]);

        // create a circle that circumscribes a plus shape in the upper left
        testShapeInsideLayout('shape-inside circle', 'circle(15px, 15px, 15.812px)', [1, 4, 5, 6, 9], .1);

        testShapeInsideLayout('shape-inside ellipse', 'ellipse(15px, 15px, 15.812px, 15.812px)', [1, 4, 5, 6, 9], .1);

        testShapeInsideLayout('shape-inside polygon', 'polygon(0 10px, 10px 0, 30px 0, 40px 10px, 40px 30px, 30px 40px, 10px 40px, 0 30px)', [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14]);

        notImplemented('shape-inside url(svg)');

        notImplemented('shape-inside url(img)');
    }

    function testShapeImageThreshold() {
        module('4.4.3 shape-image-threshold', { 'setup': setupShapeInside, 'teardown': teardown });

        test('shape-image-threshold default', function(){
            equal($div.css('shape-inside-threshold'), '0.5', 'Initial default value for shape-inside-threshold');
        })

        notImplemented('shape-image-threshold 1');
    }

    function testShapeMargin() {
        module('4.4.4 shape-margin', { 'setup': setupShapeInside, 'teardown': teardown });

        test('shape-margin default', function(){
            $div.css('float', 'left');
            equal($div.css('shape-margin'), '0', 'Initial default value for shape-margin');
        })
        
        notImplemented('shape-margin 10px');
    }

    function testShapePadding() {
        module('4.4.5 shape-padding', { 'setup': setupShapeInside, 'teardown': teardown });

        test('shape-padding default', function(){
            equal($div.css('shape-padding'), '0', 'Initial default value for shape-padding');
        })
        
        notImplemented('shape-padding 10px');
    }

    testShapeOutside();
    testShapeInside();
    testShapeImageThreshold();
    testShapeMargin();
    testShapePadding();
})
