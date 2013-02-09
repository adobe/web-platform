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
    function setup(){
        // Set up a 4x4 grid of content spans
        // Move the shape-outside float before the spans to have it affect content
        $div = $(
            '<div style=\'font: 10px/1 ahem; position: relative; width: 40px; height: 40px; word-wrap: break-word; overflow-wrap: break-word\'>' +
            '<span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span><span>x</span>' +
            '<div class=\'shape-outside\' style=\'float: left; width: 40px; height: 40px\'></div>' +
            '</div>'
        ).appendTo($('body'));
    }

    function teardown(){
        $div.remove();
    }

    function roughEqual(actual, expected, tolerance, message) {
        ok (Math.abs(actual - expected) < tolerance, message);
    }

    function testShapeLayout(name, shapeoutside, shapeinside, positions, tolerance) {
        test(name, function() {
            if (shapeoutside) {
                $('.shape-outside', $div).insertBefore($('span:first-child', $div));
                $('.shape-outside', $div).css('shape-outside', shapeoutside);
            }
            if (shapeinside)
                $div.css('shape-inside', shapeinside);
            //$div.html($div.html()); // hack to reset layout
            $('span', $div).each(function(index, element) {
                if (index >= positions.length)
                    return;
                var left = positions[index] % 4 * 10;
                var top = Math.floor(positions[index] / 4) * 10;
                //var position = element.position();
                if (tolerance) {
                    roughEqual(element.offsetLeft, left, tolerance, 'left should be ' + left + ' for child ' + index + ', was ' + element.offsetLeft);
                    roughEqual(element.offsetTop, top, tolerance, 'top should be ' + top + ' for child ' + index + ', was ' + element.offsetTop);
                } else {
                    equal(element.offsetLeft, left, 'left should be ' + left + ' for child ' + index + ', was ' + element.offsetLeft);
                    equal(element.offsetTop, top, 'top should be ' + top + ' for child ' + index + ', was ' + element.offsetTop);
                }
            })    
        })
    }

    function notImplemented(name) {
        test(name, function() {
            ok(false, name + ' is not yet implemented');
        })
    }

    function testShapeOutside() {
        module('4.4.1 shape-outside', { 'setup': setup, 'teardown': teardown });

        test('shape-outside default', function(){
            equal($div.css('shape-outside'), 'auto', 'Initial default value for shape-outside');
        })

        testShapeLayout('shape-outside rectangle', 'rectangle(0, 0, 30px, 20px)', null, [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeLayout('shape-outside circle', 'circle(10px, 10px, 10px)', null, [2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeLayout('shape-outside ellipse', 'ellipse(15px, 10px, 15px, 10px)', null, [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        testShapeLayout('shape-outside polygon', 'polygon(0 10px, 10px 0, 20px 0, 30px 10px, 20px 20px, 10px 20px', null, [3, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        notImplemented('shape-outside url(svg)');

        notImplemented('shape-outside url(img)');
    }

    function testShapeInside() {
        module('4.4.2 shape-inside', { 'setup': setup, 'teardown': teardown });

        test('shape-inside default', function() {
            equal($div.css('shape-inside'), 'outside-shape', 'Initial default value for shape-inside');
        });

        testShapeLayout('shape-inside rectangle', null, 'rectangle(10px, 10px, 20px, 20px)', [5, 6, 9, 10]);

        // create a circle that circumscribes the center 4 squares
        testShapeLayout('shape-inside circle', null, 'circle(20px, 20px, 14.14214px)', [5, 6, 9, 10], .1);

        testShapeLayout('shape-inside ellipse', null, 'ellipse(20px, 20px, 14.14214px, 14.14214px)', [5, 6, 9, 10], .1);

        testShapeLayout('shape-inside polygon', null, 'polygon(0 10px, 10px 0, 30px 0, 40px 10px, 40px 30px, 30px 40px, 10px 40px, 0 30px)', [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14]);

        notImplemented('shape-inside url(svg)');

        notImplemented('shape-inside url(img)');
    }

    function testShapeImageThreshold() {
        module('4.4.3 shape-image-threshold', { 'setup': setup, 'teardown': teardown });

        test('shape-image-threshold default', function(){
            equal($div.css('shape-inside-threshold'), '0.5', 'Initial default value for shape-inside-threshold');
        })

        notImplemented('shape-image-threshold 1');
    }

    function testShapeMargin() {
        module('4.4.4 shape-margin', { 'setup': setup, 'teardown': teardown });

        test('shape-margin default', function(){
            $div.css('float', 'left');
            equal($div.css('shape-margin'), '0', 'Initial default value for shape-margin');
        })
        
        notImplemented('shape-margin 10px');
    }

    function testShapePadding() {
        module('4.4.5 shape-padding', { 'setup': setup, 'teardown': teardown });

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
