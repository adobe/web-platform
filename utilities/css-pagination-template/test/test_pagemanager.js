module("PageManager") 

test("PageManager exists", function(){       
    ok(window.PageManager, "The page manager is available")
})   


test("Setup scaffolding", function(){
    var el = document.createElement("div")
        el.id = "wrapper"                  
    var pm = new PageManager(el)     
    
    ok(pm, "PageManager instance created") 
    ok(pm.container, "PageManager has a container")
    equal(el.id, pm.container.parentNode.id, "PageManager created under host element")
    equal(typeof pm.pages.slice, 'function', "PageManager has pages array")
    equal(pm.pages.length, 0, "PageManager has no pages")
    equal(pm.currentPage, null, "PageManager has no current page")
})        


test("Inherit dimensions from element", function(){
    var el = document.createElement("div")
        el.style.width = "100px";
        el.style.height = "200px";
    document.body.appendChild(el);
    
    var pm = new PageManager(el) 
    var computedStyle = window.getComputedStyle(pm.container, null)    
    
    equal(computedStyle.width, el.style.width, "Inherits width")
    equal(computedStyle.height, el.style.height, "Inherits height")
             
    // cleanup
    el.parentNode.removeChild(el)
    delete pm
})   

test("Create default page", function(){
    var el = document.createElement("div")
    document.body.appendChild(el);
    
    var pm = new PageManager(el) 
    pm.addPage() 
    ok(pm.currentPage.box, "Default page created")  
    equal(pm.currentPage.box.tagName.toLowerCase(), "div", "Default page is a div")  
    equal(pm.currentPage.box.className, "page", "Default page has page className")  
    
    // cleanup
    el.parentNode.removeChild(el)
    delete pm
})    

test("Create default page with content", function(){
    var el = document.createElement("div")
    document.body.appendChild(el);
    
    var pm = new PageManager(el) 
    var template = document.createElement("p")
        template.innerHTML = "text"
        
    pm.addPage(null, template) 
    ok(pm.currentPage.box.firstChild, "Default box created with content")  
    equal(pm.currentPage.box.firstChild.tagName.toLowerCase(), "p", "Content is a paragraph")  
    equal(pm.currentPage.box.firstChild.innerHTML, template.innerHTML, "Content is a paragraph")  
    
    // cleanup
    el.parentNode.removeChild(el)
    delete pm
})      

test("Create page from existing element", function(){
    var el = document.createElement("div")
    document.body.appendChild(el);
    
    var pm = new PageManager(el) 
    var hijack = document.createElement("div")
        hijack.id = "hijack"
        hijack.className = "bogus"  
        
    document.body.appendChild(hijack)
        
    pm.addPage(hijack) 

    ok(pm.currentPage.box, "Create page from element")  
    equal(pm.currentPage.box.id, hijack.id, "Decorate element as page")

    // cleanup
    el.parentNode.removeChild(el)
    delete pm
})

test("Single-page navigation", function(){
    var el = document.createElement("div")
        el.style.width = "100px";
        el.style.height = "200px";
    document.body.appendChild(el);
    
    var pm = new PageManager(el) 
    pm.addPage()
    
    equal(pm.pages.length, 1, "Element has one page")
    ok(pm.currentPage.box, "Current page is not null")
    equal(pm.currentPage.index, 0, "First page index is zero")
    
    pm.nextPage()
    equal(pm.currentPage.index, 0, "First page after nextPage")      
    
    pm.prevPage()
    equal(pm.currentPage.index, 0, "First page after prevPage")
    
    // cleanup    
    el.parentNode.removeChild(el)
    delete pm
})  

test("Multi-page navigation", function(){
    var el = document.createElement("div")
        el.style.width = "100px";
        el.style.height = "200px";
    document.body.appendChild(el);
    
    var pm = new PageManager(el) 
    pm.addPage()
    pm.addPage()
    pm.addPage()
    
    equal(pm.pages.length, 3, "Element has three pages")
    ok(pm.currentPage.box, "Current page is not null")
    equal(pm.currentPage.index, 0, "First page index is zero")
    
    pm.nextPage()
    equal(pm.currentPage.index, 1, "Get second page after nextPage")      
    
    pm.prevPage()
    equal(pm.currentPage.index, 0, "First page after prevPage")
    
    equal(pm.getPage(99), undefined, "Page does not exist")
    
    // cleanup    
    el.parentNode.removeChild(el)
    delete pm
})

test("PageManager with content for page", function(){
    var el = document.createElement("div")
        el.style.width = "100px";
        el.style.height = "200px";
    document.body.appendChild(el);
    
    var pm = new PageManager(el)      
    var template = document.createElement("div")          
    template.id = "template"
    template.style.width = "50px"
    template.style.height = "100px"
    template.style.color = "red"

    pm.addPage(null, template)   
    
    equal(pm.pages.length, 1, "Element has one page")
    
    var content = pm.currentPage.box.querySelector('#template')        
    equal(content.style.width, template.style.width, "Template width")
    equal(content.style.height, template.style.height, "Template height")
    equal(content.style.color, template.style.color, "Template color")
    
    // cleanup    
    el.parentNode.removeChild(el)
    delete pm    
})