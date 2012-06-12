/*!
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
!function(scope){ 

    function CSSRegions(){}

    // basic feature detection 
    CSSRegions.prototype.isSupported = (function(prop){

        var el = document.body,
            style

        if (!el){
            return false
        }   

        style = window.getComputedStyle(el, null)

        if (!style){
            return false
        }

        // intentional bias towards -webkit because the prototype uses 
        // code under prefixed notation that is still being debated in the W3C
        return (style['webkitFlowInto'] && style['webkitFlowFrom'])
    })()
    
    
    CSSRegions.prototype.hasOversetProperty = (function(){
        var test = document.createElement("span"),
            hasOverset,
            flow
            
        test.style['-webkit-flow-into'] = 'testflow'
            
        document.body.appendChild(test) 
        
        flow = document.webkitGetFlowByName('testflow')
        
        // older implementations used to have overflow not overset
        hasOverset = (typeof flow.overset !== 'undefined')
                                               
        // cleanup                                 
        test.style['-webkit-flow-into'] = 'none'
        test.parentNode.removeChild(test)
        flow = null
        
        return hasOverset;
    })()

    var CSSRegions = new CSSRegions()

    scope = scope || window
    scope["CSSRegions"] = CSSRegions  
    
    /*
        Demo Harness

        Adds dashboard information UI to demos.
        The dashboard shows: the current page index, total number of pages, current page template

        Show a warning if CSS Regions is not supported.
    */
    var Harness = function(){ 

        var h = [],
            p = function(){ h.push.apply(h, arguments) },
            arr = function(list){ return Array.prototype.slice.call(list) }
            
        function createToggle(){
            p('<a href="#" class="toggle">toggle info</a>') 

            var template = h.join(" ")

            // reset for further usage
            h = []

            return template
        }
            
        
        function createMeta(){
            p('<ul class="meta">')
                p('<li>Page: <span class="current">1</span> of <span class="total">3</span></li>')
                p('<li>Using template: <span class="template"></span></li>')
                p('<li class="note">Tip: Use the arrow keys to navigate</li>')
            p('</ul">')
             
            var template = h.join(" ")
            
            // reset for further usage
            h = []
                                      
            return template
        }   
        
        function createWarning(){
            p('<p class="warning">')
                p('Your browser does not meet the requirements for this prototype! <br />Please use a <a href="http://nightly.webkit.org">WebKit nightly</a> build.')
            p('</p>')
            
            var template = h.join(" ")
            
            // reset for further usage
            h = []
                                      
            return template
        } 
        
        function createDashboard(host){
            fragment = document.createElement("div")
            fragment.innerHTML = createMeta()
            host.appendChild(fragment) 
            return host
        }
        
        function getCurrentPage(){
            var pages = getAllPages(),
                currPage = {}
            
            pages.forEach(function(page, index){   
                if (page.hasAttribute("data-current")){
                    currPage.element = page
                    currPage.index = index  
                }
            })                
            
            return currPage
        }  
        
        function getAllPages(){    
            // need to requery for the container. 
            // querySelector returns a snapshot of the node, not a LiveNode
            var container = document.querySelector("[data-page-container]") 
            if (!container){
                return []
            }
            return arr(container.querySelectorAll(".page"))     
        }  
        
        function getTemplateName(page){
            var template = page.querySelector("[data-template]") 
            return template.getAttribute("data-template")
        }    
        
        function persist(bool){
            window.localStorage.setItem("CSSPageTemplateInfo", bool)
        }
        
        function isPersistent(){
            var toggle = window.localStorage.getItem("CSSPageTemplateInfo")
            return  toggle === "true" || false
        }
        
        !function(){                              
            var hasMeta = false, 
                el  = document.createElement("div")                
                el.id = "demo-harness"     
                
            if (CSSRegions.isSupported && CSSRegions.hasOversetProperty){
                
                el.innerHTML = createToggle() 
                
                if (isPersistent()){
                    createDashboard(el)
                    hasMeta = true
                    persist(true)   
                }  
                
                // handle toggling the dashboard UI
                el.querySelector(".toggle").addEventListener("click", function(e){     

                    e.preventDefault()

                    var fragment,   
                        style = window.getComputedStyle(el, null)
                    
                    if (!hasMeta){ 
                        createDashboard(el)
                        hasMeta = true  
                        persist(true)   
                        return
                    }                                            
            
                    switch(parseInt(style.top, 10)){
                        case 0:          
                            // hide by moving up by the element's height
                            el.style.top = "-" + style.height;
                            persist(false)
                        break
                
                        default: 
                            el.style.top = "0px"
                            persist(true)   
                    }
                })

            }
            else{
                el.innerHTML = createWarning()
            }
            
            document.body.appendChild(el) 
        }()
        
        return{
            sync: function(){    
                var currentPage = getCurrentPage() 
                if (!currentPage.element){
                    return
                }          
                
                var elCurrent = document.querySelector("#demo-harness .meta .current"),
                    elTotal = document.querySelector("#demo-harness .meta .total"),
                    elTemplate = document.querySelector("#demo-harness .meta .template")
                    
                if (elCurrent){
                    elCurrent.innerHTML =  currentPage.index + 1
                }
                
                if (elTotal){
                    elTotal.innerHTML =  getAllPages().length
                }
                
                if (elTemplate){
                    elTemplate.innerHTML =  getTemplateName(currentPage.element)                    
                }
            }
        }
    } 
    
    var harnes = new Harness()
    
    if (CSSRegions.isSupported && CSSRegions.hasOversetProperty){
        harnes.sync() 
        
        document.addEventListener("DOMSubtreeModified", function(e){    
            harnes.sync()
        })
    }


}(window)   