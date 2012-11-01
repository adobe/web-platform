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
                equal($region.css("region-overflow"), "auto", "Initial default value for region-overflow");
                
                $region.css("region-overflow", "break");
                equal($region.css("region-overflow"), "break", "Correct parsing for region-overflow CSS property");
            })

            test("CSS region auto-width", function() {
                setFlowContents("This is a<br>two line text.");
                $region.css("width", "auto");
                notEqual($region.width(), 0, "Regions auto-width support");
            })

            test("CSS region auto-height", function() {
                setFlowContents("This is a<br>two line text.");
                $region.css("height", "auto");
                notEqual($region.height(), 0, "Regions auto-height support");
            })
        }
        
        function testCSSOM() {
            module("CSS OM", { "setup": setup, "teardown": teardown });

            var getNamedFlowsMethod = Util.prefixMethod(document, "getNamedFlows");            

            test("JS document.getNamedFlows()", function() {
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported");
                    return;
                }
                var flowsCollection = getNamedFlowsMethod();

                ok(flowsCollection, "getFlowByName() returns an object"); 
                equal(flowsCollection.length, 1, "NamedFlowCollection.length");
                ok(flowsCollection[0], "NamedFlowCollection indexable by number");
                ok(flowsCollection["article"], "NamedFlowCollection indexable by name");
            })
            
            test("JS NamedFlow.overset", function(){
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }
                ok(getNamedFlowsMethod()["article"].overset === false,
                    "Initial value for NamedFlow.overset");
                //FIXME Add test for other values, too.
            })
            
            test("JS NamedFlow.name", function(){
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }
                ok(getNamedFlowsMethod()["article"].name === "article",
                    "NamedFlow.name returns the name of the flow");
            })

            test("JS NamedFlow.getContent()", function() {
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }

                var namedFlow = getNamedFlowsMethod()["article"];
                ok(namedFlow.getContent instanceof Function, "NamedFlow.getContent() is a function");
                //very shallow duck-typing inference :)
                equal(namedFlow.getContent().length, 1, "NamedFlow.getContent() returns a NodeList");
            })

            test("JS NamedFlow.getRegionsByContent()", function() {
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }

                var namedFlow = getNamedFlowsMethod()["article"];
                ok(namedFlow.getRegionsByContent instanceof Function, "NamedFlow.getRegionsByContent() is a function");
                
                setFlowContents("Foo");
                var theRegions = namedFlow.getRegionsByContent($flow[0]);
                equal(theRegions.length, 1, "One region for the content");
                equal(theRegions[0], $region.get(0), "Same region is returned");
            })

            test("JS NamedFlow.getRegions()", function() {
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }

                var namedFlow = getNamedFlowsMethod()["article"];
                ok(namedFlow.getRegions instanceof Function, "NamedFlow.getRegions() is a function");
                
                setFlowContents("Foo");
                var theRegions = namedFlow.getRegions($flow[0]);
                equal(theRegions.length, 1, "One region for the content");
                equal(theRegions[0], $region.get(0), "Same region is returned");
            })

            test("JS NamedFlow.firstEmptyRegionIndex", function(){
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }
                var namedFlow = getNamedFlowsMethod()["article"];
                
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
            
            test("JS Element.regionOverset", function(){
                $region.css(
                    {
                        "width": "20px",
                        "height": "20px"
                    }
                );
                
                // lots of content, expect overflow
                setFlowContents("Long text Long text Long text Long text ");
                equal($region[0][Util.prefixOM("regionOverset")], "overset", "regionOverset is 'overset'");
            
                // less content, expect fit
                setFlowContents("x");
                equal($region[0][Util.prefixOM("regionOverset")], "fit", "regionOverset is 'fit'"); 
                
                // no content, expect empty
                setFlowContents("");
                equal($region[0][Util.prefixOM("regionOverset")], "empty", "regionOverset is 'empty'");
            })

            test("JS element.getRegionFlowRanges()", function() {
                $region.css(
                    {
                        "width": "50px",
                        "height": "50px"
                    }
                );
                setFlowContents("Just some text here");

                var regionFlowRangeSupported = !!Util.prefixMethod($region[0], "getRegionFlowRanges");
                ok(regionFlowRangeSupported, "getRegionFlowRanges() method on Element");
                if (!regionFlowRangeSupported) {
                    return;
                }

                var ranges = Util.prefixMethod($region[0], "getRegionFlowRanges")();
                ok(ranges instanceof Array, "getRegionFlowRanges() actually returns an Array")
                ok(ranges[0] instanceof Range, "the returned Array contains Range objects")
            })

            asyncTest("JS regionLayoutUpdate event", function(){
                if (!getNamedFlowsMethod) {
                    ok(false, "getNamedFlows() not supported, cannot retrieve NamedFlow");
                    return;
                }

                var namedFlow = getNamedFlowsMethod()["article"];
                
                function handler(ev) {
                    equal(ev.target, namedFlow, "Event.target points to the named flow");
                    namedFlow.removeEventListener(Util.prefixOM("regionLayoutUpdate"), handler);
                    start();     
                }

                $region.css(
                    {
                        "width": "20px",
                        "height": "20px"
                    }
                );    
                
                setFlowContents("M");

                //Must also check that NamedFlow is an EventTarget
                ok(namedFlow.addEventListener, "NamedFlow should be an EventTarget");
                if (!namedFlow.addEventListener) {
                    //We break here - the test will timeout
                    return;
                }

                namedFlow.addEventListener(Util.prefixOM("regionLayoutUpdate"), handler);
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