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
    var Util = {
        canBeFlow: function($element) {
            var result = false;
            $element.css('flow-into', 'test-flow');
            result = ($element.css('flow-into') == 'test-flow');
            var bRect = $element[0].getBoundingClientRect();

            return result && (bRect.top == 0 || bRect.left == 0 || bRect.bottom == 0 || bRect.right == 0);
        },
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
        }
    };

    var setFlowContents;
    var $flow, $region;
    function setup(){
        setFlowContents("");
        $flow.css("flow-into", "article");

        $region = $('<div />').css("flow-from", "article").appendTo($('body')); 
    }
    function teardown(){
        setFlowContents("");
        $region.remove();
    }

    // Sandbox a little the initial setup
    (function() {
        var $spacer = $('<p>&nbsp;</p>').appendTo($('body')); // Used to make sure the subsequent iframe gets offset from the top-left corner
        var $div = $('<div>&nbsp;</div>').appendTo($('body'));
        var $iframe = $('<iframe seamless="true" src="about:blank"/>');
        $iframe.load(function() {
            var iframeSupported, divSupported;
            iframeFlowSupported = Util.canBeFlow($iframe);
            divSupported = Util.canBeFlow($div);

            $spacer.remove();

            if (divSupported) {
                $flow = $div;
                $iframe.remove();
                setFlowContents = function(contents) {
                    $flow.html(contents);
                }
            } else if (iframeSupported) {
                $flow = $iframe;
                $div.remove();
                setFlowContents = function(contents) {
                    $flow[0].contentWindow.document.body.innerHTML = contents;
                }
            } else {
                //Neither one is supported. Still provide some functionality, maybe something's there afterall
                $flow = $div;
                $iframe.remove();
                setFlowContents = function(contents) {
                    $flow.html(contents);
                }
            }
            runTests();
        }).appendTo($('body'));
    })();
    
    function runTests() {
        function testCSSBasics() {
            module("CSS Regions basic", { "setup": setup, "teardown": teardown });
            
            test("CSS flow-into", function(){
                setFlowContents("Foo");
                equal($flow.css("flow-into"), "article", "Correct parsing for flow-into CSS property");
            })
            
            test("CSS flow-from", function(){
                equal($region.css("flow-from"), "article", "Correct parsing for flow-from CSS property");
            })

            test("CSS region-overflow", function() {
                equal($region.css('region-overflow'), 'auto', 'Initial default value for region-overflow');
                
                $region.css('region-overflow', 'break');
                equal($region.css('region-overflow'), 'break', 'Correct parsing for region-overflow CSS property');
            })
        }
        
        function testCSSOM() {
            module("CSS OM", { "setup": setup, "teardown": teardown });
            var flowByNameSupported = true;
            
            test("JS document.getFlowByName()", function(){
                flowByNameSupported =  !!Util.prefixMethod(document, "getFlowByName");
                if (!flowByNameSupported) {
                    ok(false, "getFlowByName() not present, cannot retrieve NamedFlow");
                    return;
                }

                ok(Util.prefixMethod(document, "getFlowByName")("article"), "getFlowByName() returns an object");
            }) 
            
            test("JS NamedFlow.overset", function(){
                if (!flowByNameSupported) {
                    ok(false, "getFlowByName() not present, cannot retrieve NamedFlow");
                    return;
                }
                ok(Util.prefixMethod(document, "getFlowByName")("article").overset === false,
                    "Initial value for NamedFlow.overset");
            })
            
            test("JS NamedFlow.name", function(){
                if (!flowByNameSupported) {
                    ok(false, "getFlowByName() not present, cannot retrieve NamedFlow");
                    return;
                }
                ok(Util.prefixMethod(document, "getFlowByName")("article").name === "article",
                    "NamedFlow.name returns the name of the flow");
            })

            test("JS NamedFlow.getContent()", function() {
                if (!flowByNameSupported) {
                    ok(false, "getFlowByName() not present, cannot retrieve NamedFlow");
                    return;
                }

                var namedFlow = Util.prefixMethod(document, "getFlowByName")("article");
                equal(typeof(namedFlow.getContent), "function", "NamedFlow.getContent() is a function");
                //very shallow duck-typing inference :)
                equal(namedFlow.getContent().length, 1, "NamedFlow.getContent() returns a NodeList");
            })

            test("JS NamedFlow.getRegionsByContent()", function() {
                if (!flowByNameSupported) {
                    ok(false, "getFlowByName() not present, cannot retrieve NamedFlow");
                    return;
                }

                var namedFlow = Util.prefixMethod(document, "getFlowByName")("article");
                equal(typeof(namedFlow.getRegionsByContent), "function", "NamedFlow.getRegionsByContent() is a function");
                
                setFlowContents("Foo");
                var theRegions = namedFlow.getRegionsByContent($flow[0]);
                equal(theRegions.length, 1, "One region for the content");
                equal(theRegions[0], $region.get(0), "Same region is returned");
            })

            test("JS NamedFlow.firstEmptyRegionIndex", function(){
                if (!flowByNameSupported) {
                    ok(false, "getFlowByName() not present, cannot retrieve NamedFlow");
                    return;
                }
                var namedFlow = Util.prefixMethod(document, "getFlowByName")("article");
                
                // no regions - but namedFlow still exists because we have content
                $region.css("flow-from", "none");
                equal(namedFlow.firstEmptyRegionIndex, "-1", "Region chain has no regions");

                // one region, no content
                $region.css("flow-from", "article");
                setFlowContents("");
                equal(namedFlow.firstEmptyRegionIndex, "0", "Region chain contains one region with no content");
                
                // one region with content
                setFlowContents("Foo");
                equal(namedFlow.firstEmptyRegionIndex, "-1", "All the regions in the region chain are filled by content");
                
                var $otherRegion = $('<div />').css("flow-from", "article"); 
                $("body").append($otherRegion);
                $region.css(
                    {
                        "width": "20px",
                        "height": "20px"
                    }
                );
                setFlowContents("x");
                
                // two regions, content flows only into first one
                equal(namedFlow.firstEmptyRegionIndex, "1", "Content fills first region, second region remains empty");
                $otherRegion.remove();        
            })
            
            test("JS Element.regionOverflow", function(){   
                $region.css(
                    {
                        "width": "20px",
                        "height": "20px"
                    }
                );
                
                // lots of content, expect overflow
                setFlowContents("Long text Long text Long text Long text ");
                ok($region[0][Util.prefixOM("regionOverflow")] == "overflow", "regionOverflow is 'overflow'");

                // less content, expect fit
                setFlowContents("x");
                ok($region[0][Util.prefixOM("regionOverflow")] == "fit", "regionOverflow is 'fit'"); 
                
                // no content, expect empty
                setFlowContents("");
                ok($region[0][Util.prefixOM("regionOverflow")] == "empty", "regionOverflow is 'empty'");
            })

            asyncTest("JS regionLayoutUpdate event", function(){
                function handler(ev) {
                    equal(ev.target, $region[0], "Event.target points to the region");
                    $region.unbind(Util.prefixOM("regionLayoutUpdate"), handler);
                    start();
                }

                $region.css(
                    {
                        "width": "20px",
                        "height": "20px"
                    }
                );
                setFlowContents("M");
                $region.bind(Util.prefixOM("regionLayoutUpdate"), handler);
                setFlowContents("Long text long text long text long long long longer very longe text");
            })
        }

        function testRegionStyling() {
            module("Region styling");

            //FIXME Really Really really change this to something meaningful, ASAP!
            test("Basic @region rule support", function() {
                for (var prop in window) {
                    if (window.hasOwnProperty(prop) && prop.indexOf("CSSRegionRule") != -1) {
                        ok(prop, "Found CSSRegionRule constructor, @region rules seem to be supported")
                        return;
                    }
                }
                ok(false, "Couldn't find CSSRegionRule constructor on document.");
            });
        }

        testCSSBasics();
        testCSSOM();
        testRegionStyling();
    }
})   