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
        $div = $('<div>&nbsp;</div>').appendTo($('body'));
    }

    function teardown(){
        $div.remove();
    }

    function testCSSExclusionBasics() {
        module('CSS Exclusions basic', { 'setup': setup, 'teardown': teardown });

        test('CSS wrap-flow', function(){
            equal($div.css('wrap-flow'), 'auto', 'Initial default value for wrap-flow');

            $div.css('wrap-flow', 'both')
            equal($div.css('wrap-flow'), 'both', 'Correct parsing for wrap-flow CSS property with both value');

            $div.css('wrap-flow', 'start')
            equal($div.css('wrap-flow'), 'start', 'Correct parsing for wrap-flow CSS property with start value');

            $div.css('wrap-flow', 'end')
            equal($div.css('wrap-flow'), 'end', 'Correct parsing for wrap-flow CSS property with end value');

            $div.css('wrap-flow', 'minimum')
            equal($div.css('wrap-flow'), 'minimum', 'Correct parsing for wrap-flow CSS property with minimum value');

            $div.css('wrap-flow', 'maximum')
            equal($div.css('wrap-flow'), 'maximum', 'Correct parsing for wrap-flow CSS property with maximum value');

            $div.css('wrap-flow', 'clear')
            equal($div.css('wrap-flow'), 'clear', 'Correct parsing for wrap-flow CSS property with clear value');
        })
            
        test('CSS wrap-through', function(){
            equal($div.css('wrap-through'), 'wrap', 'Initial default value for wrap-through');

            $div.css('wrap-through', 'none');
            equal($div.css('wrap-through'), 'none', 'Correct parsing for wrap-through CSS property');
        })

        test('CSS shape-outside', function(){
            equal($div.css('shape-outside'), 'auto', 'Initial default value for shape-outside');

            $div.css('shape-outside', 'rectangle(10px, 20px, 30px, 40px)');
            equal($div.css("shape-outside"), "rectangle(10px, 20px, 30px, 40px)", "Correct parsing for shape-outside CSS property with a shape");
        })

        test('CSS shape-inside', function(){
            equal($div.css('shape-inside'), 'outside-shape', 'Initial default value for shape-inside');

            $div.css('shape-inside', 'auto');
            equal($div.css('shape-inside'), 'auto', 'Correct parsing for shape-inside CSS property with auto value');

            $div.css('shape-inside', 'rectangle(10px, 20px, 30px, 40px)');
            equal($div.css("shape-outside"), "rectangle(10px, 20px, 30px, 40px)", "Correct parsing for shape-inside CSS property with a shape");
        })

        test('CSS shape-image-threshold', function(){
            equal($div.css('shape-inside-threshold'), '0.5', 'Initial default value for shape-inside-threshold');
        })

        test('CSS shape-margin', function(){
            $div.css('float', 'left');
            equal($div.css('shape-margin'), '0', 'Initial default value for shape-margin');

        })

        test('CSS shape-padding', function(){
            equal($div.css('shape-padding'), '0', 'Initial default value for shape-padding');
        })
    }

    function runSimpleLayoutTest(width, height, fontSize, shape, positions, finalHeight) {
        $div.css('font', fontSize + '/1 ahem')
        .css('shape-inside', shape)
        .css('width', width)
        .css('height', height)
        .css('word-wrap', 'break-word')
        .css('position', 'relative')
        .html('');
        for (var i = 0; i < positions.length; i++) {
            var span = $('<span>X</span>');
            $div.append(span);
            var position = span.position();
            equal(positions[i].left, position.left, 'Character position left delta: ' + (position.left - positions[i].left));
            equal(positions[i].top, position.top, 'Character position top delta: ' + (position.top - positions[i].top));
        }
    }

    function testShapeInsideLayoutSimple() {
        module('Shape Inside layout', { 'setup': setup, 'teardown': teardown });

        test('Rectangle shape inside', function(){
            runSimpleLayoutTest('200px', 'auto', '50px', 'rectangle(50px, 50px, 50px, 50px)', { left: 50, top: 50 }, '100px');
        })

        test('Rounded rectangle shape inside', function(){
            var positions = [
                { left: 50, top: 0 }
                , { left: 0, top: 50 }
                , { left: 50, top: 50 }
                , { left: 100, top: 50 }
                , { left: 50, top: 100 }
            ];
            runSimpleLayoutTest('200px', 'auto', '50px', 'rectangle(0, 0, 150px, 150px, 50px, 50px)', positions, '150px');
        })

        test('Circle shape inside', function(){
            ok(false, 'Circle test is unimplemented');
        })

        test('Ellipse shape inside', function(){
            ok(false, 'Ellipse test is unimplemented');
        })

        test('Polygon shape inside', function() {
            runSimpleLayoutTest('200px', 'auto', '50px', 'polygon(50px 50px, 100px 50px, 100px 100px, 50px 100px)', [{ left: 50, top: 50 }], '100px');
        })
    }

    testCSSExclusionBasics();
    testShapeInsideLayoutSimple();
})
