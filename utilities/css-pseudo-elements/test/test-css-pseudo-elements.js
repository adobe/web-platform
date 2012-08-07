function createPseudoElements(cssString){
    var style = document.createElement('style')
        style.type = "text/experimental-css"
        style.id = "style"
        style.textContent = cssString
        
    var temp = document.createElement('div')
        temp.id = 'host'        
        
    document.querySelector('head').appendChild(style)    
    document.body.appendChild(temp)
} 

function removePseudoElements(){
    var elements = document.querySelectorAll("#style, #host")
    Array.prototype.forEach.call(elements, function(el){
        el.parentNode.removeChild(el)
    })
}                                                            

function setup(cssString) { return createPseudoElements.call(this, cssString) } 
function teardown() {return removePseudoElements.call(this) }

module("Parse CSS Pseudo-elements")  

test("Parser exists", function(){       
    ok(window.CSSParser, "The parser is available")
})   

test("Parse basic pseudo-element", function(){
    var parser = new CSSParser()
    parser.parse("body::before(1){ content: 'test'} ") 
                        
    equal(parser.cssRules.length, 1, "Parse one rule");
    equal(parser.cssRules[0].selectorText, "body::before(1)", "Parse selector");
})

test("Parse ::pseudo-element cascade", function(){
    var parser = new CSSParser()
    parser.parse("body::before(2){ content: 'test'}; body::before(2){  color: red } ") 
    parser.cascade()
                        
    equal(parser.cssRules.length, 1, "Parse one rule");
    equal(parser.cssRules[0].style.color, "red" , "Parse two rules");
})

module("Create CSS Pseudo-elements", {
    setup: function(){
        createPseudoElements('\
            #host::before{content: "test"; color: green} \
            #host::before(1){ content: "before1"}\
            #host::before(2){ content: "before2"}\
            #host::after{ content: "test"; color: green}\
            #host::after(1){ content: "after1"}\
            #host::after(2){ content: "after2"}\
         ')
        
        CSSPseudoElementsPolyfill.init() 
    },
    
    teardown: function(){
        removePseudoElements()
    }
})

test("Create pseudo elements", function(){
    var host = document.querySelector("#host")
    var pseudos = host.querySelectorAll("[data-pseudo-element]")
    
    ok(pseudos, "Host should have pseudo-elements")    
    equal(pseudos.length, 4, "Host should have 4 pseudo-elements")
})

test("Pseudo-elements type", function(){
    var host = document.querySelector("#host")
    var pseudos = host.querySelectorAll("[data-pseudo-element]")
    
    equal(pseudos[0].getAttribute('data-type'), "before", "First pseudo-element should be of type 'before'")
    equal(pseudos[pseudos.length-1].getAttribute('data-type'), "after", "Last pseudo-element should be of type 'after'")
}) 

test("Pseudo-elements ordinal", function(){
    var host = document.querySelector("#host")
    var pseudos = host.querySelectorAll("[data-pseudo-element]")

    equal(pseudos[0].getAttribute('data-ordinal'), "2", "First 'before' pseudo-element should have ordinal 2")
    equal(pseudos[1].getAttribute('data-ordinal'), "1", "Second 'before' pseudo-element should have ordinal 1")
    equal(pseudos[2].getAttribute('data-ordinal'), "1", "First 'after' pseudo-element should have ordinal 1")
    equal(pseudos[3].getAttribute('data-ordinal'), "2", "Second 'after' pseudo-element should have ordinal 2")

    teardown()
})

test("CSS Cascade with native pseudo-elements", function(){
    var host = document.querySelector("#host")
    var pseudos = host.querySelectorAll("[data-pseudo-element]")
    
    equal(pseudos[1].innerHTML, "before1", "First 'before' pseudo-element should overwrite native ::before content with 'before1")
    equal(pseudos[1].style["color"], "green", "First 'before' pseudo-element should have green color")

    teardown()
})

module("Pseudo-elements with ::nth-pseudo", {
    setup: function(){
        createPseudoElements('\
            #host::before(1){ content: "before1"}\
            #host::before(2){ content: "before2"}\
            #host::after(1){ content: "after1"}\
            #host::after(2){ content: "after2"}\
            \
            #host::nth-pseudo(before, 1){ color: yellow }\
            #host::nth-pseudo(before, 2){ color: blue }\
            #host::nth-pseudo(after, 1){ color: blue }\
            #host::nth-pseudo(after, 2){ color: yellow }\
            \
            #host::nth-pseudo(before, even){ background-color: lime }\
            #host::nth-pseudo(after, even){ background-color: lime }\
            \
            #host::nth-pseudo(before, odd){ background-color: red }\
            #host::nth-pseudo(after, odd){ background-color: red }\
         ')
        
        CSSPseudoElementsPolyfill.init() 
    },
    
    teardown: function(){
        removePseudoElements()
    }
})

test("Get index by query formula", function(){
                                 
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("2n").call(this, 0) , 0, "2n")
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("2n").call(this, 1) , 2, "2n") 
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("2n").call(this, 2) , 4, "2n") 

    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("2n+1").call(this, 0) , 1, "2n+1")
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("2n+1").call(this, 1) , 3, "2n+1")
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("2n+1").call(this, 2) , 5, "2n+1")

    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("3n+5").call(this, 1) , 8, "3n+5")

    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("0n+0").call(this, 1) , 0, "0n+0 with 1") 
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("0n+1").call(this, 1) , 1, "0n+1 with 1") 
                                                                 
    // riding over 2n and 2n+1
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("odd").call(this, 0) , 1, "odd") 
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("odd").call(this, 1) , 3, "odd") 
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("odd").call(this, 2) , 5, "odd") 

    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("even").call(this, 0) , 0, "even") 
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("even").call(this, 1) , 2, "even") 

    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("0").call(this, 0) , 0, "index with 0")
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("1").call(this, 1) , 1, "index with 1")
    equal(CSSPseudoElementsPolyfill.getIndexQueryFunction("3").call(this, 3) , 3, "index with 3")

}) 

test("::nth-pseudo with index", function(){
    var host = document.querySelector("#host")
    var pseudos = host.querySelectorAll("[data-pseudo-element]")
    
    equal(pseudos[0].style.color, "blue", "Second 'before' pseudo-element should have color blue")
    equal(pseudos[1].style.color, "yellow", "First 'before' pseudo-element should have color yellow")
    equal(pseudos[2].style.color, "blue", "First 'after' pseudo-element should have color blue")
    equal(pseudos[3].style.color, "yellow", "Second 'after' pseudo-element should have color yellow")
})

test("::nth-pseudo with odd/even", function(){
    var host = document.querySelector("#host")
    var pseudos = host.querySelectorAll("[data-pseudo-element]") 
    
    equal(pseudos[0].style['background-color'], "lime", "Second 'before' pseudo-element should have lime background")
    equal(pseudos[1].style['background-color'], "red", "First 'before' pseudo-element should have red background")
    equal(pseudos[2].style['background-color'], "red", "First 'after' pseudo-element should have red background")
    equal(pseudos[3].style['background-color'], "lime", "Second 'after' pseudo-element should have lime background")
})


module("Pseudo-elements CSS OM", {
    setup: function(){
        createPseudoElements('#host::before(1){ content: "test"}')
        CSSPseudoElementsPolyfill.init() 
    },
       
    teardown: function(){
        removePseudoElements()
    }
}) 

test("CSSPseudoElementList", function(){
    var host = document.querySelector("#host")
    var pseudos = window.getPseudoElements(host, "before")
               
    ok(pseudos instanceof CSSPseudoElementList, "window.getPseudoElements() should return a CSSPseudoElementList")
    equal(pseudos.length, 1, "CSSPseudoElementList should have a single item")

    equal(typeof pseudos.item, 'function', "CSSPseudoElementList should have item() method")
    ok(pseudos.item(0) instanceof CSSPseudoElement, "CSSPseudoElementList.item(0) should be a CSSPseudoElement")
    
    equal(typeof pseudos.getByOrdinalAndType, 'function', "CSSPseudoElementList should have getByOrdinalAndType() method")
    ok(pseudos.getByOrdinalAndType(1, 'before') instanceof CSSPseudoElement, "CSSPseudoElementList.getByOrdinalAndType(ordinal, type) should be a CSSPseudoElement")
})

test("window.getPseudoElements()", function(){
    equal(typeof window.getPseudoElements, "function", "window.getPseudoElements() should be a function")

    var host = document.querySelector("#host")
    var pseudos = window.getPseudoElements(host, "before") 
    
    ok(pseudos instanceof CSSPseudoElementList, "window.getPseudoElements() should return a CSSPseudoElementList")
})   