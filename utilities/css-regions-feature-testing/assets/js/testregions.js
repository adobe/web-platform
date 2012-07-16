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
    function prefixOM(name) {
        return PrefixFree.Prefix.toLowerCase() + name.replace(/^[a-z]/, function($0){ return $0.toUpperCase(); });
    }
    function prefixMethod(obj, method) {
        if (obj[method]) {
            return obj[method].bind(obj);
        } else {
            return obj[prefixOM(method)].bind(obj);
        }
    }
    
    var $flow, $region;  
    
    function setup(){
        $flow = $('<div />').css("flow-into", "article");
        $region = $('<div />').css("flow-from", "article"); 

        $("body").append($flow, $region)    
    }   
    
    function teardown(){
        $flow.remove();
        $region.remove();
    }  
    
    module("CSS Regions basic", { "setup": setup, "teardown": teardown });
    
    test("Named flow - content should be pulled to a flow", function(){ 
        ok($flow.css("flow-into") == "article");
    })
    
    test("Region - should consume from flow", function(){
        ok($region.css("flow-from") == "article");
    })

    test("Region properties - region-overflow property", function() {
        equal($region.css('region-overflow'), 'auto', 'Initial default value for region-overflow');
        
        $region.css('region-overflow', 'break');
        equal($region.css('region-overflow'), 'break', 'region-overflow: break');
    })

    //TODO Rework and re-enable tests once we get a resolution on intended test & current
    // implementation behavior.
    
    module("CSS OM", { "setup": setup, "teardown": teardown });
    
    test("Document should return a flow by name", function(){ 
        ok(prefixMethod(document, "getFlowByName")("article"));
    }) 
    
    test("NamedFlow should have overset property", function(){ 
        ok(prefixMethod(document, "getFlowByName")("article").overset === false);
    })
    
    test("NamedFlow should have name property", function(){
        ok(prefixMethod(document, "getFlowByName")("article").name === "article");
    })

    test("NamedFlow should have getContent() function", function() {
        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        equal(typeof(namedFlow.getContent), "function", "NamedFlow.getContent is a function");
    })
    
    test("NamedFlow getContent() should return NodeList", function() {
        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        equal(namedFlow.getContent().length, 1, "NamedFlow.getContent() has one node");
    })

    test("NamedFlow should have getRegionsByContent() function", function() {
        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        equal(typeof(namedFlow.getRegionsByContent), "function", "NamedFlow.getRegionsByContent is a function");
    })
    test("NamedFlow getRegionsByContent() should return NodeList", function() {
        $flow.html('Foo');
        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        var theRegions = namedFlow.getRegionsByContent($flow.contents()[0]);

        equal(theRegions.length, 1, "One region for the content");
        equal(theRegions[0], $region.get(0), "Same region is returned");
    })
    test("NamedFlow should have firstEmptyRegionIndex property", function(){
        var namedFlow = prefixMethod(document, "getFlowByName")("article");
        
        // no regions - but namedFlow still exists because we have content
        $region.css("flow-from", "none");
        equal(namedFlow.firstEmptyRegionIndex, "-1", "Region chain has no regions");

        // one region, no content
        $region.css("flow-from", "article");
        $flow.html('');
        equal(namedFlow.firstEmptyRegionIndex, "0", "Region chain contains one region with no content");
        
        // one region with content
        $flow.html('Foo');
        equal(namedFlow.firstEmptyRegionIndex, "-1", "All the regions in the region chain are filled by content");
        
        var $otherRegion = $('<div />').css("flow-from", "article"); 
        $("body").append($otherRegion);
        $region.css(
            {
                "width": "20px",
                "height": "20px"
            }
        );
        $flow.html('x');
        
        // two regions, content flows only into first one
        equal(namedFlow.firstEmptyRegionIndex, "1", "Content fills first region, second region remains empty");
        $otherRegion.remove();    
        
    })
    
    test("Element should have regionOverflow property", function(){   
        $region.css(
            {
                "width": "20px",
                "height": "20px"
            }
        );
        
        // lots of content, expect overflow
        $flow.html("Long text Long text Long text Long text ");
        ok($region[0][prefixOM("regionOverflow")] == "overflow"); 

        // less content, expect fit
        $flow.html("x");
        ok($region[0][prefixOM("regionOverflow")] == "fit"); 
        
        // no content, expect empty
        $flow.html("");
        ok($region[0][prefixOM("regionOverflow")] == "empty");
    })

    //TODO Write tests for getRegionFlowRanges() once this gets implemented
    asyncTest("regionLayoutUpdate event is thrown", function(){

        function handler(ev) {
            equal(ev.target, $region[0], "Event.target points to the region");
            $region.unbind(prefixOM("regionLayoutUpdate"), handler);
            start();
        }

        $region.css(
            {
                "width": "20px",
                "height": "20px"
            }
        );
        $flow.html("M");
        $region.bind(prefixOM("regionLayoutUpdate"), handler);
        $flow.html("Long text long text long text long long long longer very longe text");
    })

    module("Region styling");

    test("Basic @region rule support", function() {
        for (var prop in window) {
            if (window.hasOwnProperty(prop) && prop.indexOf("CSSRegionRule") != -1) {
                ok(prop, "Found CSSRegionRule constructor, @region rules seem to be supported")
                return;
            }
        }
        ok(false, "Couldn't find CSSRegionRule constructor on document.");
    });
})   