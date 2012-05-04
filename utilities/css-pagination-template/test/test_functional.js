module("Functional tests") 

function setup(url){ 
    var iframe = document.createElement("iframe")
    iframe.style = "width: 100%; height: 100%"
    iframe.src = url;
    iframe.id = "testframe"
    
    document.body.appendChild(iframe)
}                                   

function teardown(){
    var iframe = document.querySelector("#testframe")
    iframe.parentNode.removeChild(iframe)
}

asyncTest("Apply one template - smoke test", function(){ 
      
    setup("cases/one-template.html")      
    var iframe = document.querySelector("#testframe")
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements()     
        var template = pagedEls["body"][0].machine.templates[0];
        var slot = template.cache.querySelector("[data-slot]") 
        
        start()  
        
        // paged element widget
        ok(pagedEls["body"], "Body is paged")
        ok(pagedEls["body"][0].container, "Body has paged widget")
        ok(pagedEls["body"][0].pages.length, "Body has at least one page")
        equal(pagedEls["body"][0].isVertical, false, "Body is paged horizontaly")
        equal(pagedEls["body"][0].machine.templates.length, 1, "Body has one template") 

        // template
        ok(template.cache, "Template is cached")
        ok(template.cache.querySelectorAll("[data-template]").length, "Template has template data attribute")
        equal(template.cache.querySelectorAll("[data-slot]").length, 1, "Template has one slot")     

        // slot
        equal(slot.style['-webkit-flow-from'], "article-flow", "Slot flows content from article-flow")
        equal(slot.style['width'], "100px", "Slot is 100px wide")
        equal(slot.style['height'], "100px", "Slot is 100px high")
        equal(slot.style['background'], "green", "Slot green")      
        
        teardown();
    }) 
})

asyncTest("Cascade template rules", function(){ 
      
    setup("cases/one-template-cascade.html")      
    var iframe = document.querySelector("#testframe")
    
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements() 
        var pagedEl = pagedEls["body"][0] 
        var template = pagedEls["body"][0].machine.templates[0];
        var slots = template.cache.querySelectorAll("[data-slot]")
        slots =  Array.prototype.slice.call(slots)    
        
        start()   
        
        equal(pagedEl.machine.templates.length, 1, "Using one template")  
        equal(slots.length, 2, "Template has two slots")     

        equal(slots[0].style['-webkit-flow-from'], "article-flow", "Slot flows content from article-flow")
        equal(slots[0].style['width'], "100px", "Slot is 100px wide")
        equal(slots[0].style['height'], "80px", "Slot is 80px high after cascade")
        equal(slots[0].style['background'], "green", "Slot green")  
        // equal(slots[1].getAttribute("data-slot"), "header", "Second slot identified as header")
        
        teardown() 
    }) 
}) 


asyncTest("Select default template", function(){ 
      
    setup("cases/default-template.html")      
    var iframe = document.querySelector("#testframe")
    
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements() 
        var pagedEl = pagedEls["body"][0]   
        
        start()  
        
        /*
            When there's no other rules defined, the last declared template should be used as the default
        */
        equal(pagedEl.machine.templates.length, 1, "Using one template")
        equal(pagedEl.machine.templates[0].name, "default", "Using the last declared template")
        
        teardown()
    }) 
})

asyncTest("Select first-page template", function(){ 
      
    setup("cases/first-page.html")      
    var iframe = document.querySelector("#testframe")
    
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements() 
        var pagedEl = pagedEls["body"][0] 
        
        start()  
        
        /*
            When there's no other rules defined, the last declared template should be used as the default
        */
        equal(pagedEl.machine.templates.length, 1, "Using one template")
        equal(pagedEl.pages.length, 2, "Generated two pages")  
         
        var firstPageTemplate = pagedEl.pages[0].box.querySelector('[data-template]')       
        var secondPageTemplate = pagedEl.pages[1].box.querySelector('[data-template]')
        var computedStylesFirst = window.getComputedStyle(firstPageTemplate, null)["background-color"] 
        var computedStylesSecond = window.getComputedStyle(secondPageTemplate, null)["background-color"]   
        
        ok(computedStylesFirst !== computedStylesSecond, "First page has a diffrent bg color")
        
        teardown()
    }) 
})


asyncTest("Select one template with template-set", function(){ 
      
    setup("cases/template-set-single.html")      
    var iframe = document.querySelector("#testframe")
    
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements() 
        var pagedEl = pagedEls["body"][0]   
        
        start() 
        
        equal(pagedEl.machine.templates.length, 1, "Using one template")
        equal(pagedEl.machine.templates[0].name, "first", "Using the 'first' template")

        teardown() 
    }) 
})

asyncTest("Select multiple templates with template-set", function(){ 
      
    setup("cases/template-set-multiple.html")
    var iframe = document.querySelector("#testframe")
    
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements() 
        var pagedEl = pagedEls["body"][0]   
        
        start() 

        /*
            Given a template-set property, 
            the matched templates should be used in the order defined in the CSS file, 
            not in the template-set property value.
        */
        equal(pagedEl.machine.templates.length, 2, "Using two templates")
        equal(pagedEl.machine.templates[0].name, "first", "Using the templates in their CSS rule order")
        equal(pagedEl.machine.templates[1].name, "second", "Second template")

        teardown() 
    }) 
})


asyncTest("Select template with required-flow", function(){ 
      
    setup("cases/required-flow.html")      
    var iframe = document.querySelector("#testframe")
    
    iframe.addEventListener("load", function(e){ 
        
        var doc = iframe.contentWindow.document
        var pagedEls = doc.CSSPageTemplate.getPagedElements() 
        var pagedEl = pagedEls["body"][0]  
        var firstPage = pagedEl.pages[0].box
        var firstPageTemplate = firstPage.querySelector("[data-template]")   
        
        
        start() 

        /*
            Given a 'template-set' property which matches templates with 'required-flow': 
            - the matched templates should be used in the order defined in the CSS file;
            - the 'required-flow' templates take precedence over templates without 'required-flow';
            - the template with 'required-flow' is used as many instances as necessary to fully layout the named flow it serves;
            
            When the named flow is fully laid out using the template with 'required-flow', other matching templates may be used.
            
            If a template satisfies multiple flows at the same time, it should take precedence 
            over templates which sever only one of the flows.
             
        */
        equal(pagedEl.machine.templates.length, 3, "Using three templates") 
        equal(firstPageTemplate.getAttribute("data-template"), "required", "Using template with required flow first")
            
        teardown() 
    }) 
})