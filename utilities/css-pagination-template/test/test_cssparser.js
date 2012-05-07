module("Parser")  

test("Parser exists", function(){       
    ok(window.CSSParser, "The parser is available")
})   

test("Clear parser", function(){
    var parser = new CSSParser()
    parser.parse("body { background: red }") 
                        
    equal(parser.cssRules.length, 1, "Parse one rule");
    parser.clear();                                             
    
    equal(parser.cssRules.length, 0, "Parser cleared. No rules available")
})   

test("Parse single property", function(){   
    var parser = new CSSParser()
    parser.parse("body { width: 100px }")
    
    equal(parser.cssRules[0].selectorText, "body", "Parse selector")
    equal(parser.cssRules[0].style["width"], "100px", "Parse mixed char property")
})      

test("Parse multiple properties", function(){   
    var parser = new CSSParser()
    parser.parse("body { width: 100px; background: red; -webkit-flow-into: myFlow; }")
    
    equal(parser.cssRules[0].selectorText, "body", "Parse selector")
    equal(parser.cssRules[0].style["width"], "100px", "Parse mixed char property")
    equal(parser.cssRules[0].style["background"], "red", "Parse string property") 
    equal(parser.cssRules[0].style["-webkit-flow-into"], "myFlow", "Parse prefixed property")
})   

test("Parse multiple blocks", function(){   
    var parser = new CSSParser()
    parser.parse("body { width: 100px } div{ background: red }")    
    
    equal(parser.cssRules[0].style["width"], "100px", "Parse first css block property")
    equal(parser.cssRules[1].style["background"], "red", "Parse second css block property")
}) 

test("Parse non-stanard property", function(){   
    var parser = new CSSParser()
    parser.parse("body { fake: bogus }")
    
    equal(parser.cssRules[0].style["fake"], "bogus", "Parse non-standard property")
})    

test("Parse bogus css text", function(){   
    var cssText = "{ this is not css : of course not! }"
    var parser = new CSSParser()
    parser.parse(cssText)
    
    equal(parser.cssRules.length, 0, "Do not parse bogus text")
})  

test("Parse one template rule", function(){   
    var cssText = "@template templateName{ }"
    var parser = new CSSParser()
    parser.parse(cssText)
    
    equal(parser.cssRules[0].type, "template", "Parse template rule type")
    equal(parser.cssRules[0].identifier, "templateName", "Parse template indentifier") 
})  

test("Parse multiple template rules", function(){   
    var cssText = "@template templateName{ @slot name{ } } @template { }"
    var parser = new CSSParser()
    parser.parse(cssText)
    
    equal(parser.cssRules[0].type, "template", "Parse template rule type")
    equal(parser.cssRules[0].identifier, "templateName", "Parse template indentifier") 
    equal(parser.cssRules[1].type, "template", "Parse anonymous template type") 
    equal(parser.cssRules[1].identifier, "auto", "Parse anonymous template indentifier") 
})

test("Parse rules before and after nested rules", function(){   
    var cssText = "body{ color:red} @template templateName{ @slot name{ } } div{ color: green }"
    var parser = new CSSParser()
    parser.parse(cssText)
    
    equal(parser.cssRules[0].selectorText, "body", "Parse rule before template declaration")
    equal(parser.cssRules[1].type, "template", "Parse template declaration")
    equal(parser.cssRules[2].selectorText, "div", "Parse rule after template declaration")
})     

test("Basic template rule parsing with one slot", function(){   
    var parser = new CSSParser()
    parser.parse("@template templateName{ @slot name{ } }")
    
    equal(parser.cssRules[0].type, "template", "Parse template rule type")
    equal(parser.cssRules[0].identifier, "templateName", "Parse template indentifier")   
    equal(parser.cssRules[0].cssRules.length, 1, "Parse one slot under template") 
    equal(parser.cssRules[0].cssRules[0].type, "slot", "Parse slot rule type") 
    equal(parser.cssRules[0].cssRules[0].identifier, "name", "Parse slot rule indentifier")  
})

test("Real-life template rule parsing", function(){   
    var parser = new CSSParser()     
    var cssText = '@template { \
                      \
                      background: lime; \
                      \
                      @slot header{ \
                          width: 100%; \
                          height: 50px; \
                      } \
                      \
                      @slot body{ \
                          background: red; \
                      } \
                     }'    

      parser.parse(cssText) 

      equal(parser.cssRules[0].type, "template", "Parse template rule type")
      equal(parser.cssRules[0].cssRules.length, 2, "Parse multiple slots")    
      ok(parser.cssRules[0].style, "Template can have both nested rules with properties and their own properties")    
      equal(parser.cssRules[0].style["background"], "lime", "Parse mixed cssRules and css properties for a template")    

      equal(parser.cssRules[0].cssRules[0].type, "slot", "Parse first slot rule type")
      equal(parser.cssRules[0].cssRules[0].identifier, "header", "Parse first slot rule identifier")    
      ok(parser.cssRules[0].cssRules[0].style, "Slots can have properties")    
      equal(parser.cssRules[0].cssRules[0].style["width"], "100%", "Parse slot percentage property")    
      equal(parser.cssRules[0].cssRules[0].style["height"], "50px", "Parse slot pixel property")    
            
      equal(parser.cssRules[0].cssRules[1].type, "slot", "Parse second slot rule type")    
      equal(parser.cssRules[0].cssRules[1].identifier, "body", "Parse second slot rule identifier")    
      equal(parser.cssRules[0].cssRules[1].style["background"], "red", "Parse second slot property")    
})     

test("Parse nested slots", function(){   
    var parser = new CSSParser()     
    var cssText = '@template { \
                      @slot header{ \
                          width: 100%; \
                          @slot title{ \
                                font-size: 2em; \
                            } \
                      } \
                     }'    

      parser.parse(cssText) 

      equal(parser.cssRules[0].cssRules[0].identifier, "header", "Parse first level slot")    
      equal(parser.cssRules[0].cssRules[0].style["width"], "100%", "Parse property of first level slot")    
      equal(parser.cssRules[0].cssRules[0].cssRules[0].identifier, "title", "Parse second level of slot")    
      equal(parser.cssRules[0].cssRules[0].cssRules[0].style["font-size"], "2em", "Parse property of first level slot")    
})

test("Parse template names", function(){   
    var parser = new CSSParser()
    parser.parse("@template article-name{ }")
    
    equal(parser.cssRules[0].identifier, "article-name", "Parse template with dash in name should work")
    
    parser.clear()
    parser.parse("@template article_name{ }")
    
    equal(parser.cssRules[0].identifier, "article_name", "Parse template with underscore in name should work")
    
    parser.clear()
    parser.parse("@template name { }")
    
    equal(parser.cssRules[0].identifier, "name", "Parse template identifier followed by whitespace")
    
    parser.clear()
    parser.parse("@template           name            { }")
    
    equal(parser.cssRules[0].identifier, "name", "Parse template identifier bordered by lots of whitespace")
})

test("Parse overflow-style", function(){   
    var cssText = "body{ overflow-style: paged-x; } div{ overflow-style: paged-y }"
    var parser = new CSSParser()
    parser.parse(cssText)              
    
    equal(parser.cssRules[0].style["overflow-style"], "paged-x", "Parse overflow-style x")
    equal(parser.cssRules[1].style["overflow-style"], "paged-y", "Parse overflow-style y")
})  

test("Parse required-flow", function(){   
    var parser = new CSSParser()
    parser.parse("@template { required-flow: myFlow }")              
    
    equal(parser.cssRules[0].style["required-flow"], "myFlow", "Parse required flow property")
})      

module("Cascade")

test("Simple cascade", function(){   
    var parser = new CSSParser()
    parser.parse(" div{ background: red } div{ height: 100px; background: green }")              
    
    equal(parser.cssRules[0].style["background"], "red", "Parse property before cascade")
    equal(parser.cssRules[1].style["height"], "100px", "Parse property before cascade")
    
    parser.cascade()
    
    equal(parser.cssRules.length, 1, "Compress tree after cascade")
    equal(parser.cssRules[0].style["height"], "100px", "New property after cascade")
    equal(parser.cssRules[0].style["background"], "green", "Replace property value after cascade")
})  


test("Nested cascade", function(){   
    var parser = new CSSParser()
    parser.parse(" @template{ background: red } @template{ @slot{  } }")              
    
    equal(parser.cssRules[0].cssRules.length, 0, "Template has no slots before cascade")
    equal(parser.cssRules[0].style["background"], "red", "Template has red background before cascade")
    
    parser.cascade()
    
    equal(parser.cssRules.length, 1, "Compress tree after cascade")
    equal(parser.cssRules[0].cssRules.length, 1, "Template has one slot after cascade")
    equal(parser.cssRules[0].style["background"], "red", "Template has red background after cascade")
})  

test("Nested cascade with multiple same-level anonymous slots", function(){   
    var parser = new CSSParser()
    parser.parse(" @template{ @slot{ background: red } @slot{ background: green } }") 
    
    equal(parser.cssRules[0].cssRules.length, 2, "Template has two anonymous slots before cascade") 
    
    parser.cascade()
    
    equal(parser.cssRules[0].cssRules.length, 1, "Template has one anonymous slot after cascade")     
    equal(parser.cssRules[0].cssRules[0].style["background"], "green", "Slot is green")     
    
    parser.clear()       
    
    parser.parse(" @template{ @slot{ background: red } @slot{ background: yellow } } @template{ @slot{ background: red } @slot{ background: green } }") 
    
    parser.cascade()
    
    equal(parser.cssRules.length, 1, "One anonymous template after cascade")     
    equal(parser.cssRules[0].cssRules.length, 1, "One anonymous slot after cascade")     
    equal(parser.cssRules[0].cssRules[0].style["background"], "green", "Slot is green")     
})
 

test("Nested cascade with named slots", function(){   
    var parser = new CSSParser()
    parser.parse(" @template { @slot header{ background:red } } @template { @slot header{ background: green; width: 100px; } @slot footer{ } }")              
    
    equal(parser.cssRules[0].cssRules.length, 1, "Template has one slot before cascade")
    equal(parser.cssRules[0].cssRules[0].identifier, "header", "First slot is named 'header'")
    equal(parser.cssRules[0].cssRules[0].style["background"], "red", "First slot is red")
    
    parser.cascade()

    equal(parser.cssRules[0].cssRules.length, 2, "Template has two slots after cascade")
    equal(parser.cssRules[0].cssRules[0].style["background"], "green", "First slot is green")
    equal(parser.cssRules[0].cssRules[0].style["width"], "100px", "First slot is green")
    equal(parser.cssRules[0].cssRules[1].identifier, "footer", "Second slot is named 'footer'")
})   

test("Nested object extend", function(){
    var parser = new CSSParser() 
    
    var obj1 = {
        background: "red",
        nest: {
            background: "red"
        }
    }                    
    
    var obj2 = {
        background: "green",
        nest: {
            background: "green"
        }
    }    
    
    var obj3 = parser.doExtend({}, obj1, obj2)
    equal(obj1.background, "red", "First object background should be red")
    equal(obj2.background, "green", "Second object background should be green")
    equal(obj3.background, "green", "Extended object background should be green")  
    
    equal(obj1.nest.background, "red", "Nested first object background should be green") 
    equal(obj2.nest.background, "green", "Nested second object background should be green") 
    equal(obj3.nest.background, "green", "Nested extended object background should be green") 
})
