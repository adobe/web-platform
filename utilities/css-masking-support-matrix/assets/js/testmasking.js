/*
Copyright (C) 2014 Adobe Systems, Incorporated. All rights reserved.

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
    var kModuleName_ManualTests = "CSS Masking rendering";
    var kSVGNS = "http://www.w3.org/2000/svg";
    var kXLINKNS =  "http://www.w3.org/1999/xlink";

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

    var TestType = {
        MaskParsing: "mask",
        MaskBoxParsing: "mask-box",
        ClipPathParsing: "clip-path",
        ClipParsing: "clip",
        MaskImage: "mask-image",
        MaskType: "mask-type",
        MaskRepeat: "mask-repeat",
        MaskPosition: "mask-position",
        MaskClip: "mask-clip",
        MaskOrigin: "mask-origin",
        MaskSize: "mask-size",
        MaskSourceType: "mask-source-type",
        Mask : "mask",
        MaskBoxSource: "mask-box-source",
        MaskBoxSlice: "mask-box-slice",
        MaskBoxWidth: "mask-box-width",
        MaskBoxOutset: "mask-box-outset",
        MaskBotRepeat: "mask-box-repeat",
        MaskBox : "mask-box",
        ClipPath : "clip-path",
        Clip : "clip"
    };

    // Template for the initial setup
    var $masked;
    (function() {
        var $div = $('<div>&nbsp;</div>').appendTo($('body'));
        var $iframe = $('<iframe seamless="true" src="about:blank"/>');
        $iframe.load(function() {
            $masked = $div;
            $iframe.remove();
            runTests();
        }).appendTo($('body'));
    })();

    function setup() {
        $masked = $('<div>&nbsp;</div>').appendTo($('body'));
    }
    function teardown() {
        $masked.remove();
    }

    function testPropertyParsing(type, propertyName, propertyValues) {
        for(var j = 0; j < propertyValues.length; j++) {
            var parsedValue, expectedValue;
            if (typeof propertyValues[j] === "string") {
                parsedValue = propertyValues[j];
                expectedValue = propertyValues[j];
            } else {
                parsedValue = propertyValues[j][0];
                expectedValue = propertyValues[j][1];
            }
            $masked.css(propertyName, parsedValue);
            equal($masked.css(propertyName), expectedValue, "Property value '" + parsedValue + "' for property '" + propertyName + "' should parse and be serialized to: '" + expectedValue + "'.");
            Util.cacheResult(type, propertyName + ": " + expectedValue);
            $masked.css(propertyName, "initial");
        }
    }
////////

    function runTests() {

        // First run the basic parsing and serialization tests.
        function runCSSMaskBasicTests() {
            module("CSS mask basics", { "setup": setup, "teardown": teardown });

            test("Parsing - CSS mask-image", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-image", ["none", "linear-gradient(red, green)"]);
            });
            test("Parsing - CSS mask-type", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-type", ["luminance", "alpha", "auto"]);
            });
            test("Parsing - CSS mask-repeat", function() {
                var maskRepeats = ["repeat-x", "repeat-y", "repeat", "space", "round", "no-repeat", "repeat space", "repeat round", "space repeat", "space round", "space no-repeat", "round repeat", "round space", "round no-repeat", "no-repeat space", "no-repeat round"];
                testPropertyParsing(TestType.MaskParsing, "mask-repeat", maskRepeats);
            });
            test("Parsing - CSS mask-position", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-position", ["50% 0%", "0% 50%", "50% 50px", "50px 50%"]);
            });
            test("Parsing - CSS mask-clip", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-clip", ["content-box", "padding-box", "border-box", "margin-box", "no-clip"]);
            });
            test("Parsing - CSS mask-origin", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-origin", ["content-box", "padding-box", "border-box", "margin-box"/*, "bounding-box"*/]);
            });
            test("Parsing - CSS mask-size", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-size", ["cover", "contain", "auto", "50%", "50px", "auto 50px"]);
            });
            test("Parsing - CSS mask-source-type", function() {
                testPropertyParsing(TestType.MaskParsing, "mask-type", ["luminance", "alpha"]);
            });
        };

        function runCSSMaskBoxBasicTests() {
            // TODO: Add tests.
        };

        function runCSSClipPathBasicTests() {
            module("CSS clip-path basics", { "setup": setup, "teardown": teardown });

            // Test polygon()
            test("Parsing - CSS clip-path", function() {
                var shapes = [
                    "none",
                    "url(document.svg)",
                    "polygon(20px 20px)",
                    "polygon(10% 10%, 40% 40%)",
                    "polygon(10% 10px, 50px 40%)",
                    "polygon(500px -450px, 68px 20px)",
                    "polygon(10px 10px, 100px 100px, 200px 200px, 400% 500%, 20px 20px)",
                    "polygon(evenodd, 20px 20px)",
                    ["polygon(nonzero, 20px 20px)", "polygon(20px 20px)"],
                    "inset(20px)",
                    "inset(20%)",
                    "inset(20px 20%)",
                    "inset(20% 20% 20px)",
                    "inset(20px 20% 20% 20px)",
                    "inset(20% 20px 20px 20%)",
                    "inset(0px round 20px)",
                    "inset(0px round 20px 20%)",
                    "inset(0px round 20px 20px 20%)",
                    "inset(0px round 20px 20px 20% 20px)",
                    "inset(0px round 20% 20px 20% 20px / 20px)",
                    "inset(0px round 20% 20% 20% 20px / 20px 20%)",
                    "inset(0px round 20% 20px 20px / 20px 20%)",
                    "inset(0px round 20px / 20px 20px 20%)",
                    "inset(0px round 20% 20px 20% 20px / 20px 20px 20% 20px)",
                    "inset(0px round 20% / 20px 20px 20% 20px)",
                    "inset(0px round 20% / 20%)",
                    "inset(20px 20% 20% 20px round 20% 20px 20% 20px / 20px 20px 20% 20px)",
                    ["circle()", "circle(at 50% 50%)"],
                    ["circle(closest-side)", "circle(at 50% 50%)"],
                    ["circle(farthest-side)", "circle(farthest-side at 50% 50%)"],
                    ["circle(20%)", "circle(20% at 50% 50%)"],
                    ["circle(50px)", "circle(50px at 50% 50%)"],
                    ["circle(200px)", "circle(200px at 50% 50%)"],
                    ["circle(at top)", "circle(at 50% 0%)"],
                    ["circle(at right)", "circle(at 100% 50%)"],
                    ["circle(at bottom)", "circle(at 50% 100%)"],
                    ["circle(at left)", "circle(at 0% 50%)"],
                    ["circle(at 50% top)", "circle(at 50% 0%)"],
                    ["circle(at left 50%)", "circle(at 0% 50%)"],
                    ["circle(at top left)", "circle(at 0% 0%)"],
                    ["circle(at bottom right)", "circle(at 100% 100%)"],
                    ["circle(at bottom 50px right 50%)", "circle(at right 50% bottom 50px)"],
                    ["circle(at left top 50px)", "circle(at left 0% top 50px)"],
                    ["circle(at left bottom 50%)", "circle(at 0% 50%)"],
                    ["circle(at center 50% top)", "circle(at 0% 0%)"],
                    "circle(at left 50px bottom 50px)",
                    ["circle(farthest-side at center)", "circle(farthest-side at 50% 50%"],
                    ["circle(farthest-side at 50px top)", "circle(farthest-side at 50px 0%)"],
                    ["circle(farthest-side at left bottom 50px)", "circle(farthest-side at left 0% bottom 50px)"],
                    ["circle(farthest-side at center center)", "circle(farthest-side at 50% 50%)"],
                    ["circle(closest-side at center top 50%)", "circle(at 50% -50%)"],
                    ["circle(closest-side at 50%)", "circle(at 50% 50%)"],
                    ["ellipse()", "ellipse(at 50% 50%)"],
                    ["ellipse(closest-side)", "ellipse(at 50% 50%)"],
                    ["ellipse(farthest-side)", "ellipse(farthest-side at 50% 50%)"],
                    ["ellipse(20% farthest-side)", "ellipse(20% farthest-side at 50% 50%)"],
                    ["ellipse(50px closest-side)", "ellipse(50px closest-side at 50% 50%)"],
                    ["ellipse(closest-side 200px)", "ellipse(closest-side 200px at 50% 50%)"],
                    ["ellipse(closest-side farthest-side)", "ellipse(closest-side farthest-side at 50% 50%)"],
                    ["ellipse(at top)", "ellipse(at 50% 0%)"],
                    ["ellipse(at right)", "ellipse(at 100% 50%)"],
                    ["ellipse(at bottom)", "ellipse(at 50% 100%)"],
                    ["ellipse(at left)", "ellipse(at 0% 50%)"],
                    ["ellipse(at 50% top)", "ellipse(at 50% 0%)"],
                    ["ellipse(at top left)", "ellipse(at 0% 0%)"],
                    ["ellipse(at bottom right)", "ellipse(at 100% 100%)"],
                    ["ellipse(at bottom 50px right 50%)", "ellipse(at right 50% bottom 50px)"],
                    ["ellipse(at left top 50px)", "ellipse(at left 0% top 50px)"],
                    ["ellipse(at left bottom 50%)", "ellipse(at 0% 50%)"],
                    ["ellipse(at center bottom 50%)", "ellipse(at 50% 50%)"],
                    "ellipse(at left 50px bottom 50px)",
                    ["ellipse(farthest-side at center)", "ellipse(farthest-side at 50% 50%)"],
                    ["ellipse(farthest-side at top 50px)", "none"],
                    ["ellipse(farthest-side at left bottom 50px)", "ellipse(farthest-side at left 0% bottom 50px)"],
                    ["ellipse(farthest-side farthest-side at center center)", "ellipse(farthest-side at 50% 50%)"],
                    ["ellipse(closest-side at center 50% top 50%)", "none"],
                    ["ellipse(farthest-side closest-side at center 50% left 50%)", "none"],
                    ["ellipse(closest-side farthest-side at 50%)", "ellipse(closest-side farthest-side at 50% 50%)"],
                    ["circle() content-box", "circle(at 50% 50%) content-box"],
                    ["circle() padding-box", "circle(at 50% 50%) padding-box"],
                    ["circle() border-box", "circle(at 50% 50%) border-box"],
                    ["circle() margin-box", "circle(at 50% 50%) margin-box"],
                    ["fill ellipse()", "ellipse(at 50% 50%) fill"],
                    ["stroke inset(20px)", "inset(20px) stroke"],
                    "polygon(20px 20px) view-box"];
                // WebKit supports clip-path prefixed and unprefixed. Prefixfree can't handle this.
                var clipPathPropertyName = $masked[0].style.webkitClipPath === undefined ?  "clip-path" : "-webkit-clip-path";
                testPropertyParsing(TestType.ClipPathParsing, clipPathPropertyName, shapes);
            });
        };

        function runCSSClipBasicTests() {
            module("CSS clip basics", { "setup": setup, "teardown": teardown });


            function teardown() {
                // Clear the manual test panel
                $("#manual-tests").empty();
            }

            test("Parsing - CSS clip", function() {
                var clips = [
                    "auto",
                    "rect(100px, 100px, 100px, 100px)"]
                testPropertyParsing(TestType.ClipParsing, "clip", clips);
            });
        };

        function runSVGClipPathTests() {
            module("SVG &lt;clipPath>");

            test("Generic SVG support", function() {
                ok(!!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
            });

            test("SVG Basic shapes are supported", function() {
                var elements = ["rect","circle","path","ellipse","text","polygon","polyline","line"];
                for (var j = 0; j < elements.length; ++j) {
                    var svgElement = document.createElementNS(kSVGNS, elements[j]);
                    var s = String(svgElement).toUpperCase();
                    equal(s, String("[object SVG" + elements[j] + "Element]").toUpperCase());
                }
            });

            test("SVG ClipPath element supported", function() {
                var svgElement = document.createElementNS(kSVGNS, "clipPath");
                var s = String(svgElement).toUpperCase();
                equal(s, String("[object SVGClipPathElement]").toUpperCase());
            });

        }

        function runSVGMaskTest() {
            module("SVG &lt;mask>");

            test("SVG Mask element supported", function() {
                var svgElement = document.createElementNS(kSVGNS, "mask");
                var s = String(svgElement).toUpperCase();
                equal(s, String("[object SVGMaskElement]").toUpperCase());
            });
        }

        function runManualMaskingTests() {
            module(kModuleName_ManualTests, {"teardown": teardown });
            var clipPathTests = [
                "clip-path-shape-circle",
                "clip-path-shape-inset",
                "clip-path-shape-polygon",
                "clip-path-reference",
                "clip-path-svg",
                "clip-path-svg-shape-circle"
            ];
            var maskTests = [
                "mask-reference",
                "mask-image"
            ];

            function teardown() {
                // Clear the manual test panel
                $("#manual-tests").empty();
            }

            function getMaskingAsyncTest(clipPathTest) {
                return function(){

                    // if (!Util.isPropertyAndValueSupported(testType, blendMode)) {
                    //     ok(false, "Parsing test already failed.");
                    //     start();
                    //     return;
                    // }

                    var title = "Test " + clipPathTest;
                    var manualTest = new ManualTest(title, "assets/tests/" + clipPathTest, "193px");


                    manualTest.element.appendTo("#manual-tests");

                    var clickHandler = function(event) {
                        QUnit.equal($(event.target).text(), manualTest.btnYes.text(), "Do left and right result match?");
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

            // add an async test for each clip-path, clip and mask;
            for (var i in clipPathTests) {
                asyncTest("Rendering - clip-path - " + clipPathTests[i],
                    getMaskingAsyncTest(clipPathTests[i]));
            }

            // add an async test for clip
            asyncTest("Rendering - clip - " + "clip",
                    getMaskingAsyncTest("clip"));


            for (var i in maskTests) {
                asyncTest("Rendering - mask - " + maskTests[i],
                    getMaskingAsyncTest(maskTests[i]));
            }
        }

        // FIXME: Add manual tests for rendering results in a separate step.
        window.kModuleName_ManualTests = kModuleName_ManualTests

        runCSSMaskBasicTests();
        runCSSMaskBoxBasicTests();
        runCSSClipPathBasicTests();
        runCSSClipBasicTests();
        runSVGClipPathTests();
        runSVGMaskTest();
        runManualMaskingTests();
    }
})