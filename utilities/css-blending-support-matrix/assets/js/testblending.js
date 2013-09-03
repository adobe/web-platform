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
/////////
    var kModuleName_ManualTests = "CSS Blending rendering";

    var blendModes = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn",
                      "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];

    // Helper functions for separate blend mode

    var separateBlendmodes = ["normal", "multiply", "screen", "overlay",
                              "darken", "lighten", "colorDodge","colorBurn",
                              "hardLight", "softLight", "difference", "exclusion"];

    var separateBlendFunctions = {
        normal: function(b, s) {
            return s;
        },
        multiply: function(b, s) {
            return b * s;
        },
        screen: function(b, s) {
            return b + s - b * s;
        },
        overlay: function(b, s) {
            return separateBlendFunctions.hardLight(b, s);
        },
        darken: function(b, s) {
            return Math.min(b, s);
        },
        lighten: function(b, s) {
            return Math.max(b, s);
        },
        colorDodge: function(b, s) {
            if(b == 1)
                return 1;
            return Math.min(1, s / (1 - b));
        },
        colorBurn: function(b, s) {
            if(s == 0)
                return 0;
            return 1 - Math.min(1, (1 - b) / s);
        },
        hardLight: function(b, s) {
            if(s <= 0.5)
                return separateBlendFunctions.multiply(s, 2 * b);

            return separateBlendFunctions.screen(s, 2 * b - 1);
        },
        softLight: function(b, s) {
            var c = 0;
            if(b <= 0.25)
                c = ((16 * b - 12) * b + 4) * b;
            else
                c = Math.sqrt(b);

            if(s <= 0.5)
                return b - (1 - 2 * s) * b * (1 - b);

            return b + (2  * s - 1) * (c - b);
        },
        difference: function(b, s) {
            return Math.abs(b - s);
        },
        exclusion: function(b, s) {
            return s + b - 2 * b * s;
        }
    };

    function applyBlendMode(b, s, blendFunc) {
        var resultedColor = [0, 0, 0, 255];
        for (var i = 0; i < 3; ++i)
            resultedColor[i] = 255 * (s[3] * (1 - b[3]) * s[i] + b[3] * s[3] * blendFunc(b[i], s[i]) + (1 - s[3]) * b[3] * b[i]);
        return resultedColor;
    }


    // Helper functions for nonseparate blend modes

    var nonSeparateBlendModes = ["hue", "saturation", "color", "luminosity"];

    function luminosity(c) {
        return 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
    }

    function clipColor(c) {
        var l = luminosity(c);
        var n = Math.min(c[0], c[1], c[2]);
        var x = Math.max(c[0], c[1], c[2]);

        if (n < 0) {
            c[0] = l + (((c[0] - l) * l) / (l - n));
            c[1] = l + (((c[1] - l) * l) / (l - n));
            c[2] = l + (((c[1] - l) * l) / (l - n));
        }

        if (x > 1) {
            c[0] = l + (((c[0] - l) * (1 - l)) / (x - l));
            c[1] = l + (((c[1] - l) * (1 - l)) / (x - l));
            c[2] = l + (((c[2] - l) * (1 - l)) / (x - l));
        }

        return c;
    }

    function setLuminosity(c, l) {
        var d = l - luminosity(c);
        c[0] += d;
        c[1] += d;
        c[2] += d;
        return clipColor(c);
    }

    function saturation(c) {
        return Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]);
    }

    function setSaturation(c, s) {
        var max = Math.max(c[0], c[1], c[2]);
        var min = Math.min(c[0], c[1], c[2]);
        var index_max = -1;
        var index_min = -1;

        for (var i = 0; i < 3; ++i) {
            if (c[i] == min && index_min == -1) {
                index_min = i;
                continue;
            }
            if (c[i] == max && index_max == -1)
                index_max = i;
        }
        var index_mid = 3 - index_max - index_min;
        var mid = c[index_mid];


        if (max > min) {
            mid = (((mid - min) * s) / (max - min));
            max = s;
        } else {
            mid = 0;
            max = 0;
        }
        min = 0;

        var newColor = [0, 0, 0];

        newColor[index_min] = min;
        newColor[index_mid] = mid;
        newColor[index_max] = max;

        return newColor;
    }

    var nonSeparateBlendFunctions = {
        hue: function(b, s) {
            var bCopy = [b[0], b[1], b[2]];
            var sCopy = [s[0], s[1], s[2]];
            return setLuminosity(setSaturation(sCopy, saturation(bCopy)), luminosity(bCopy));
        },
        saturation: function(b, s) {
            var bCopy = [b[0], b[1], b[2]];
            var sCopy = [s[0], s[1], s[2]];
            return setLuminosity(setSaturation(bCopy, saturation(sCopy)), luminosity(bCopy));
        },
        color: function(b, s) {
            var bCopy = [b[0], b[1], b[2]];
            var sCopy = [s[0], s[1], s[2]];
            return setLuminosity(sCopy, luminosity(bCopy));
        },
        luminosity: function(b, s) {
            var bCopy = [b[0], b[1], b[2]];
            var sCopy = [s[0], s[1], s[2]];
            return setLuminosity(bCopy, luminosity(sCopy));
        }
    };

    // Helper functions for drawing in canvas tests

    function drawColorInContext(color, context) {
        context.fillStyle = color;
        context.fillRect(0, 0, 10, 10);
    }

    function drawBackdropColorInContext(context) {
        drawColorInContext("rgba(129, 255, 129, 1)", context);
    }

    function drawSourceColorInContext(context) {
        drawColorInContext("rgba(255, 129, 129, 1)", context);
    }

    function fillPathWithColorInContext(color, context) {
        context.fillStyle = color;
        context.lineTo(0, 10);
        context.lineTo(10, 10);
        context.lineTo(10, 0);
        context.lineTo(0, 0);
        context.fill();
    }

    function fillPathWithBackdropInContext(context) {
        fillPathWithColorInContext("rgba(129, 255, 129, 1)", context);
    }

    function fillPathWithSourceInContext(context) {
        fillPathWithColorInContext("rgba(255, 129, 129, 1)", context);
    }

    function applyTransformsToContext(context) {
        context.translate(1, 1);
        context.rotate(Math.PI / 2);
        context.scale(2, 2);
    }

    function drawBackdropColorWithShadowInContext(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'rgba(192, 192, 192, 1)';
        drawBackdropColorInContext(context);
        context.restore();
    }

    function drawSourceColorRectOverShadow(context) {
        context.fillStyle = "rgba(255, 129, 129, 1)";
        context.fillRect(0, 0, 12, 12);
    }

    function drawColorImageInContext(color, context, callback) {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");
        drawColorInContext(color, ctx);
        var imageURL = cvs.toDataURL();

        var backdropImage = new Image();
        backdropImage.onload = function() {
            context.drawImage(this, 0, 0);
            callback();
        }
        backdropImage.src = imageURL;
    }

    function drawBackdropColorImageInContext(context, callback) {
        drawColorImageInContext("rgba(129, 255, 129, 1)", context, callback);
    }

    function drawSourceColorImageInContext(context, callback) {
        drawColorImageInContext("rgba(255, 129, 129, 1)", context, callback);
    }

    function drawColorPatternInContext(color, context, callback) {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");
        drawColorInContext(color, ctx);
        var imageURL = cvs.toDataURL();

        var backdropImage = new Image();
        backdropImage.onload = function() {
        var pattern = context.createPattern(backdropImage, 'repeat');
            context.rect(0, 0, 10, 10);
            context.fillStyle = pattern;
            context.fill();
            callback();
        }
        backdropImage.src = imageURL;
    }

    function drawBackdropColorPatternInContext(context, callback) {
        drawColorPatternInContext("rgba(129, 255, 129, 1)", context, callback);
    }

    function drawSourceColorPatternInContext(context, callback) {
        drawColorPatternInContext("rgba(255, 129, 129, 1)", context, callback);
    }

    function drawGradientInContext(color1, context) {
        var grad = context.createLinearGradient(0, 0, 10, 10);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color1);
        context.fillStyle = grad;
        context.fillRect(0, 0, 10, 10);
    }

    function drawBackdropColorGradientInContext(context) {
        drawGradientInContext("rgba(129, 255, 129, 1)", context);
    }

    function drawSourceColorGradientInContext(context) {
        drawGradientInContext("rgba(255, 129, 129, 1)", context);
    }

    function blendColors(backdrop, source, blendModeIndex) {
        if (blendModeIndex < separateBlendmodes.length)
            return separateBlendColors(backdrop, source, blendModeIndex);
        return nonSeparateBlendColors(backdrop, source, blendModeIndex - separateBlendmodes.length);
    }

    function separateBlendColors(backdrop, source, blendModeIndex) {
        return applyBlendMode(backdrop, source, separateBlendFunctions[separateBlendmodes[blendModeIndex]]);
    }

    function nonSeparateBlendColors(backdrop, source, blendModeIndex) {
        var expectedColor = nonSeparateBlendFunctions[nonSeparateBlendModes[blendModeIndex]](backdrop, source);
        for (var i = 0; i < 3; ++i)
            expectedColor[i] = source[3] * (1 - backdrop[3]) * source[i] + source[3] * backdrop[3] * expectedColor[i] + (1 - source[3]) * backdrop[3] * backdrop[i];
        return [Math.round(255 * expectedColor[0]), Math.round(255 * expectedColor[1]), Math.round(255 * expectedColor[2]), 255];
    }


////////
    var TestType = {
        Background : "background",
        Element : "element"
        // ISOLATION : "isolate";
    };

    var Util = {
        prefixOM: function (name) {
            return PrefixFree.Prefix.toLowerCase() + name.replace(/^[a-z]/, function($0){ return $0.toUpperCase(); });
        },
        prefixMethod: function (obj, method) {
            if (obj[method]) {
                return obj[method].bind(obj);
            } else {
                var result = obj[Util.prefixOM(method)];
                return result ? result.bind(obj) : null;
            }
        },
        shouldBeCloseTo: function (_to_eval, _target, _tolerance, message)
        {
            var _result;
            _result = eval(_to_eval);
            if (Math.abs(_result - _target) <= _tolerance) 
                ok(true, message + ": actual " + _to_eval + ": expected " + _target);
            else
                ok(false, message + ": actual " + _to_eval + ": expected " + _target);
        },
        checkBlendModeResult: function (i, context, sigma, message) {
            var expectedColor = blendColors([129 / 255, 1, 129 / 255, 1], [1, 129 / 255, 129 / 255, 1], i);
            actualColor = context.getImageData(0, 0, 1, 1).data;
            Util.shouldBeCloseTo(actualColor[0], expectedColor[0], sigma, message);
            Util.shouldBeCloseTo(actualColor[1], expectedColor[1], sigma, message);
            Util.shouldBeCloseTo(actualColor[2], expectedColor[2], sigma, message);
            Util.shouldBeCloseTo(actualColor[3], expectedColor[3], sigma, message);
        },
        _cachedResults: {},
        // Determine using globals whether the test failed or passed. Call right
        // after the assert.
        cacheResult: function(testType, testedProperty) {
            var assertions = QUnit.config.current.assertions;
            if (!assertions || !assertions.length)
                return;

            var didPass = assertions[assertions.length-1].result;

            if (!this._cachedResults[testType])
                this._cachedResults[testType] = {};

            this._cachedResults[testType][testedProperty] = didPass;
        },
        isPropertyAndValueSupported: function(property, value) {
            if (this._cachedResults[property] && this._cachedResults[property][value])
                return true;

            return false;
        }
    };
    var $blended;
    // Sandbox a little the initial setup
    (function() {

        var $div = $('<div>&nbsp;</div>').appendTo($('body'));
        var $iframe = $('<iframe seamless="true" src="about:blank"/>');
        $iframe.load(function() {
            $blended = $div;
            $iframe.remove();
            runTests();
        }).appendTo($('body'));
    })();
    
    function runTests() {

        function testCSSBlendingBasics(){
            module("CSS Blending basics", { "setup": setup, "teardown": teardown });

            function setup(){
                $blended.css("background-blend-mode", "multiply");
            }
            function teardown(){
                $blended.remove();
            }
            test("Parsing - CSS background-blend-mode", function(){
            blendModes = ["normal", "multiply", "screen", "overlay", "darken", "lighten","color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]
            for( j=0; j<blendModes.length; j++ )
            {
                $blended.css("background-blend-mode", blendModes[j]);
                equal($blended.css("background-blend-mode"), blendModes[j], "Correct parsing for background-blend-mode: " + blendModes[j]);
                Util.cacheResult(TestType.Background, blendModes[j]);
        }
        });

        test("Parsing - CSS element blending", function(){
            blendModes = ["normal", "multiply", "screen", "overlay", "darken", "lighten","color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]
            for( j=0; j<blendModes.length; j++ )
            {
                $blended.css("mix-blend-mode", blendModes[j]);
                equal($blended.css("mix-blend-mode"), blendModes[j], "Correct parsing for element blending: " + blendModes[j]);
                Util.cacheResult(TestType.Element, blendModes[j]);
            }
        });

        test("Rendering - CSS canvas blend-mode", function(){
            $canvas = $('<canvas></canvas>').appendTo($('body'));
            $ctx = $canvas[0].getContext('2d');

            blendModes = ["normal", "multiply", "screen", "overlay", "darken", "lighten","color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]
            
            for( j=0; j<blendModes.length; j++ )
            {
                $ctx.globalCompositeOperation = blendModes[j];
                if ( blendModes[j] == "normal" )
                    equal($ctx.globalCompositeOperation, "source-over", "Correct parsing for canvas blend-mode: " + blendModes[j]);
                else
                    equal($ctx.globalCompositeOperation, blendModes[j], "Correct parsing for canvas blend-mode: " + blendModes[j]);
            }
        });

        test("Parsing - CSS isolation ", function(){
            isolate = ["auto", "isolate"];

            for( j=0; j<isolate.length; j++ )
            {
                $blended.css("isolation-mode", isolate[j]);
                    equal($blended.css("isolation-mode"), isolate[j], "Correct parsing for isolation: "+ isolate[j]);
            }
        });

        }

        function testCSSCanvasBlending(){
            module("CSS Canvas Blending", { "setup": setup, "teardown": teardown });

            var $canvas;
            var $context;
            var sigma = 5;

            function setup(){
                $canvas = $('<canvas></canvas>').appendTo($('body'));
                $canvas.width = 10;
                $canvas.height = 10;
                $context = $canvas[0].getContext('2d');
                $context.clearRect(0, 0, 10, 10);
                $context.save();
                drawBackdropColorInContext($context);
            }

            function teardown(){
                $canvas.remove();
            }
        
            for (var i = 0; i < blendModes.length; i++) (function(i){
                var blendmode = blendModes[i];
                test("Rendering - CSS canvas blend-mode - " + blendmode, function () {
                    $context.globalCompositeOperation = blendmode;
                    drawSourceColorInContext($context);
                    Util.checkBlendModeResult(i, $context, sigma, blendmode);
                });
            })(i);
        }
        
        function runManualTests() {
            module(kModuleName_ManualTests, { "teardown": teardown});
            var blendModesExpected = ["Normal", "Multiply", "Screen", "Overlay", "Darken", "Lighten", "Color-dodge", "Color-burn",
                      "Hard-light", "Soft-light", "Difference", "Exclusion", "Hue", "Saturation", "Color", "Luminosity"];
            function teardown() {
                // Clear the manual test panel
                $("#manual-tests").empty();
            }
    
            function getBlendingAsyncTest(blendModeIndex, testType) {
                return function(){
                    var blendMode = blendModes[blendModeIndex];

                    if (!Util.isPropertyAndValueSupported(testType, blendMode)) {
                        ok(false, "Parsing test already failed.");
                        start();
                        return;
                    }

                    var blendModeExpected = blendModesExpected[blendModeIndex] +".png"
                    var title = blendMode + " rendering (" + (+blendModeIndex + 1) + "/" + blendModes.length + ")";
                    var manualTest = new ManualTest(title, "assets/img/expected/" + blendModeExpected);

                    switch(testType) {
                        case TestType.Background:
                            manualTest.asBackgroundBlendingTest(blendMode,  "assets/img/blendedCircles.png");
                            break;
                        case TestType.Element:
                            manualTest.asElementBlendingTest(blendMode, "assets/img/blendedCircles.png");
                            break;
                        default:
                            console.log("Unknown test type: " + testType);
                    }

                    manualTest.element.appendTo("#manual-tests");
                    var clickHandler = function(event) {
                        QUnit.equal($(event.target).text(), manualTest.btnYes.text(), "Did the images match for "+blendModes[blendModeIndex]+" blending?");
                        start();
                    }
                    manualTest.btnYes.click(clickHandler);
                    manualTest.btnNo.click(clickHandler);

                    var timeoutNotice = $('<div/>').appendTo("#manual-tests");
                    timeoutNotice.text("This test will timeout (and fail) after " + 
                                QUnit.config.testTimeout/1000 + " seconds.");
                    timeoutNotice.css("text-align", "center");
                }
            }

            // add an async test for each blend mode;
            for (var i in blendModes) {
                asyncTest("Rendering - CSS background blending - " + blendModes[i],
                    getBlendingAsyncTest(i, TestType.Background));
            }

            for (var i in blendModes) {
                asyncTest("Rendering - CSS element blending - " + blendModes[i],
                    getBlendingAsyncTest(i, TestType.Element));
            }
        }
    
        window.kModuleName_ManualTests = kModuleName_ManualTests;

        testCSSBlendingBasics();
        testCSSCanvasBlending();
        runManualTests();
    }
})   