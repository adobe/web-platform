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
!function(){ 
    
    function TemplateMachine(){    
        /*
            A mapping of named flows to templates that apply to it.
            This mapping is done when a template is added to the TemplateMachine.
            
            Example:
            this.namedFlows = {  
                                                                                        
                // the key is the NamedFlow identifier
                "flow-name":{    
                  
                    // instance of NamedFlow; used to query its state for 'overflow'
                    flow: document.webkitGetFlowByName("flow-name"),                      
                    
                     // instances of Template objects that can satisfy the named flow
                    templates: [template1, template2, template3]
                }
            }
        */
        this.namedFlows = {} 
                    
        // storage for available templates
        this.templates = []

        /* 
            A mapping of 'required-flow' properties to templates satisfying them.
            This mapping is done when a template is added to the TemplateMachine.
            It serves as an optimization to avoid running through all the available templates on each run.
            
            The key is the NamedFlow's identifier 
            The value is the last instance of Template object satisfying the named flow
            
            Example:
            this.requiredFlows = {
                "flow-name": new Template(cssText)
            }
        */ 
        this.requiredFlows = {}
    }           
    
    /*
        Return the overflow property of a NamedFlow. 
        This is a wrapper to work around pre-layout false negative NamedFlow.overflow values.
        
        @param {string} flow The named flow identifier
        @return {boolean} 
    */                     
    TemplateMachine.prototype.doesFlowOverflow = function(flow){
        /*
            The initial overflow of NamedFlows cannot be determined until after layout. 
            A NamedFlow's intial overflow property is false, until it has been laid out in at least one region.
            
            The template selection algorithm relies on NamedFlow.overflow to pick a template.
            Since a template that isn't yet laid out, lies and says its overflow is 'false', we're mocking the 
            initial overflow value and setting it to 'true'. This is done in order to begin the layout, then decide later, 
            based on the real NamedFlow.overflow value if there's more content to be laid out.
        */                                   
        
        // if the workaround flag is tripped, rely on the real overflow value 
        if (!this.namedFlows[flow].mockOverflow){ 
            // return the real overflow value
            return this.namedFlows[flow].flow.overset
        }    
        else{                       
            // making sure to never check agains the mock again
            this.namedFlows[flow].mockOverflow = false         
            
            // telling the algoritm that the NamedFlow, which hasn't yet been laid out, overflows.
            return true
        }
    }
   
    /*
        Get a template matching a facet name.
        
        A facet template is a @template rule defined by a pseudo-class, like :first
        A facet template inherits from the parent template, but adds its own specialized properties.
        Facets are a way for defining specialized styles for custom usage, like on the first page of an element.
        
        Example: 
        @template article{
            background: white
            
        }
        
        @template article:first{
            background: green
        }     
        
    */
    TemplateMachine.prototype.getTemplateByFacet = function(facet, templateList){
        if (!facet || typeof facet !== "string"){
            return null
        }     
            
        var facetTemplate = null,
            list = templateList || this.templates     
            
        
        // look for templates matching the required facet
        list.forEach(function(t){   
            if (t.facets[facet]){ 
                facetTemplate = t.facets[facet]
            }
        })   
        
        return facetTemplate 
    } 
    
    /*
        Return a template that satisfies all or most of the given flows.
               
        A list of templates that satisfy at least one of the flows is chosen. The templates are scored by 
        how many flows they satisfy at at time. The first template with the highest score is returned. 

        As flows become fully consumed another template will get the highest score for the remaining flows. 
        
        In a pessimistic run, templates will each have only one template. The flows will be satisfied in the 
        alphabetical order of the templates.                     
        
        If no template exists to satisfy the named flow, null is returned.
        
        @param {Array} flows The flows that the template should aim to satisfy
        @return {Object/null} A Template object instance or null 
    */
    TemplateMachine.prototype.getTemplateByNamedFlows = function(flows) {
        // map of templates with scores based on how many named flows they satisfy at the same time                                                 
        var templateOptions =  this.getTemplateOptions(flows),
        
        // the best template's name
            templateName,          
            
        // the score of the best template
            score = 0             
        
        if (!templateOptions){
            return 
        } 
            
        /*  
            pick the template with the highest score
            if there's a template satisfying more flows, its score will be higher. 
            we want it!
        */
        for (var template in templateOptions){
            
            if (templateOptions[template].score > score){       
                
                score = templateOptions[template].score
                templateName = template
            }
        } 
        
        // what if the template chosen doesn't satisfy all overflowing named flows?
        // remember we're using mockOverflow 
        if (flows.length !== templateOptions[templateName].flows){
            
            // pick out the named flows NOT satisfied by this template
            var orphanFlows = flows.filter(function(item){
                return templateOptions[templateName].flows.indexOf(item) < 0
            })     
              
            // un-trip the mockOverflow flag for the unsatisfied flows to make sure 
            // we revisit them on the next run to pick other templates that might suit them
            this.resetMockOverflowToggle(orphanFlows)
        }
             
        
        // return the best Template object instance
        return this.templates.filter( function(t){ return t.name === templateName }).shift()
    };
    
    
    /*
        Return a template that satisfies the NamedFlow determined by flowName 
        by looking fort its 'required-flow' style attribute         
        
        @param {String} flowName  The identifier of the NamedFlow
        @return {Object/null} The Template object instance that satisfies the named flow 
                              or null if no such template exists
    */
    TemplateMachine.prototype.getTemplateByRequiredFlow = function(flowName) {       
        
        // get the specific template. 
        // if not available, let the machine pick the best option
        return this.requiredFlows[flowName] || this.getTemplateByNamedFlows( [flowName] )
    }; 
     
    /*
        Pick the best template to satisfy the given named flows.
        Entry point for the template selection algorithm.
                                     
        @see TemplateMachine.getTemplateByFacet()
        @see TemplateMachine.getTemplateByRequiredFlow()
        @see TemplateMachine.getTemplateByNamedFlows()
        
        @param {Array} flows Array of NamedFlows that are overflowing
        @param {String} facet An aspect of a template to be used, like ":first" 
    */
    TemplateMachine.prototype.pickTemplate = function(flows, facet){     

        var template, reqFlow, index
        
        // There's no templates. Panic!
        if (!this.templates || !this.templates.length){
            throw new Error("TemplateMachine.pickTemplate() No template definitions available.")
        }
        
        if (facet){ 
            template = this.getTemplateByFacet(facet)  
             
            if (template){        
                return template
            }
        } 

        if (!flows || !flows.length){ 
            return          
        } 
        
        // run through the required flows list first
        for (reqFlow in this.requiredFlows){        
                   
            //  first occurence of the requiredFlow in the list of unsatisfied flows
            index = flows.indexOf(reqFlow)
            
            if (index !== -1){  
                
                // get the required flow's associated template
                template = this.getTemplateByRequiredFlow(reqFlow)
                 
                if (template){  
                    
                    // remove the requried named flow form the list of unsatisfied named flows
                    flows.splice(index, 1)                                        

                    // reset the NamedFlow.overflow for the unhandled named flows
                    this.resetMockOverflowToggle(flows)

                    return template    
                }                                    
            }
        }
        
        // pick the best possible template to satisfy all or most flows
        template = this.getTemplateByNamedFlows(flows)     
        
        return template
    } 
    
    TemplateMachine.prototype.resetMockOverflowToggle = function(flows) {
        // un-trip the mockOverflow flag for the unsatisfied flows to make sure 
        // we revisit them on the next run to pick other templates that might suit them
        flows.map(function(item){
            this.namedFlows[item].mockOverflow = true
        }, this)    
    };
    
    
    /*
        Get all the available templates that apply to all or some of the flows.
        
        Returns a map with the template name as key and a score as value.
        The more named flows a template serves, the higher its score.
        
        @param {Array} flows names of flows to be laid out  
        @return {Object/undefined}  
    */
    TemplateMachine.prototype.getTemplateOptions = function(flows){    
        var options = {}
        
        if (!flows || !flows.length){
            return          
        }               
        
        
        // TODO: fix scoring altorihm. Semi-exhausted dual-flow templates should have
        // a smaller score than single-flow templates for the remaining flows.
        flows.map(function(flowName){  
            this.namedFlows[flowName].templates.forEach(function(template){
                                                
                if (!options[template.name]){ 
                    options[template.name] = {}
                    options[template.name].score = 1
                    options[template.name].flows = [flowName]
                }
                else{
                    options[template.name].score++
                    options[template.name].flows.push(flowName)
                }
                
            })         
            
        }, this) 
        
        return options        
    }
    
    /* 
        Get all named flows that are not yet fully rendered 
    */
    TemplateMachine.prototype.getUnsatisfiedFlows = function(){
        var flows = [], key
        
        for (flow in this.namedFlows){ 
            if (this.doesFlowOverflow(flow)){  
                flows.push(flow)
            }
        }             
        
        return flows
    }  
    
    /*
        Add a Template object instance to this paged element's storage.
        This is where the NamedFlow-to-Template mapping is done to help the template selection algorithm later.
        
        The template selection algorithm will go through this storage and pick the appropriate template.      
        
        @param {Object} template A Template object instance
    */
    TemplateMachine.prototype.addTemplate = function(template){
        if (!template || !template instanceof Template){
            throw new TypeError("TemplateMachine.addTemplate() Invalid input. Expected instance of Template, got: " + template)
        }              
        
        // check before inserting a duplicate template
        var isDuplicate = this.templates.some(function(ownTemplate){
            return ownTemplate.name === template.name 
        }) 
        
        if (isDuplicate){
            return 
        }
        
        // new template, let it in!
        this.templates.push(template) 
                                                       
        // check if this template has a required-flow css property
        var requiredFlow = template.rule.style["required-flow"]      
        
        // if this template is required to satisfy a named flow, 
        // pull it to the side for special treatment
        if (requiredFlow && typeof requiredFlow == "string"){
            this.requiredFlows[requiredFlow] = template
        }
        
        // extract named flows and add to the map of flows-to-templates
        template.rule.cssRules.forEach(function(slotRule){ 
                   
            var flowName = slotRule.style['-webkit-flow-from'], 
                flow = document.webkitGetFlowByName(flowName)
                
            if (!flowName || !flow){
                return
            }        
            
            // TODO: make this cleaner!
            if (!this.namedFlows[flowName]){ 
                
                this.namedFlows[flowName] = { 
                    "flow": flow,
                    "mockOverflow": true, // workaround for pre-layout NamedFlow.overflow false negatives
                    "templates": [template]
                }  
            } 
            else{  
                 
                // check if there's already an assignement for this named flow with this template
                var isDuplicate = this.namedFlows[flowName].templates.some(function(collectedTemplate){
                    return collectedTemplate.name === template.name 
                })    
                
                if (!isDuplicate){
                    this.namedFlows[flowName].templates.push(template)
                }
            }
        
        // add the PagedElement context to the array handler     
        }, this)
    }
    
    
    /*
         Template class

         Generates a DocumentFragment from a CSS @template rule
         Stores the template identifier 
         Serves as a container for Template-compilation logic  

         @param {Obect} rule A CSSRule instance. Contains the information required to generate a template and its child slots.

     */
     function Template(rule){
         if (rule.type !== "template"){
             throw new TypeError("Template() Invalid input. Expected CSSRule with type = 'template'")
         }
          
         // storage for the CSS Rule 
         this.rule = rule            
         
         // identifier of the template
         this.name = rule.identifier || "auto"  
         
         // storage for the generated template to inprove reuse performance
         this.cache = null

         // storage for template facets, such as templates with the ":first" pseudo-class
         this.facets = {}
     }  

     /*
         Create and return a DocumentFragment object from the template rule
         The fragment contains DIV elements created and positioned based on 
         the @slot rules in the @template rule

         @return {Object/DocumentFragment}
     */
     Template.prototype.compile = function(){

         // template compilation result not in cache
         // compile the template if it has never been compiled before
         if (!this.cache){     

             var self = this,
                 wrapper,
                 fragment = document.createDocumentFragment()

             // no child slots, return
             if (!this.rule.cssRules || !this.rule.cssRules.length){
                 console.warn("No @slot declarations in @template: ", this.rule)

                 return fragment
             }   

             wrapper = document.createElement("div")
             wrapper.setAttribute("data-template", this.name || "")

             // add style properties to the template wrapper
             for (var key in this.rule.style){
                 wrapper.style[key] = this.rule.style[key]
             }

             // Create DOM nodes out of @slot css rules
             this.rule.cssRules.map(function(slotRule){ 

                 if (slotRule.type !== "slot"){
                     // invalid slot rule
                     // return undefined here, but filtered out later from the expected DOM node list
                     return
                 }  

                 var slot = document.createElement("div") 
                 slot.setAttribute("data-slot", slotRule.identifier || "")

                 for (var key in slotRule.style){
                     slot.style[key] = slotRule.style[key] 

                     // Cheesy, I know! But it's late and I'm tired.
                     if (key === "content" && typeof slotRule.style[key] == "string"){
                         this.handleProperty(key, slotRule.style[key], slot)
                     } 
                 }  

                 return slot 

             }, this).filter(function(slot){ 

                 // return only valid DOM nodes
                 return (slot && slot.tagName) 

             }).forEach(function(slot){

                 // append DOM nodes to template wrapper
                 wrapper.appendChild(slot)
             })                                         

             fragment.appendChild(wrapper)

             this.cache = fragment 
         }

         // return a clone of the DOM node template definition
         // using a clone for easy reuse
         return this.cache.cloneNode(true)
     } 

     Template.prototype.addFacet = function(facet, template){
         this.facets[facet] = template
     }

     /*
         Return a string representation of the compiled template

         @return {String}
     */
     Template.prototype.html = function() {
         return this.compile().innerHTML
     }

     /*
         Generic handler for CSS properties on an element
         This method gets called each time a property is set on a @slot

         @param {String} key The CSS property name
         @param {String/Integer} value The CSS property value
         @param {Object/null} element The generated element where this property applies
     */
     Template.prototype.handleProperty = function(key, value, element){
         if (typeof key !== 'string'){
             return
         }         

         switch (key){ 

             // handler for generated content 
             case "content":  

                 if (!element){
                     return
                 }         

                 var cell = document.createElement("div")
                     cell.textContent = value.substr(1, value.length-2)

                 element.appendChild(cell)   

             break 
         }
     }

    function PagedElement(container, style){
        PageManager.call(this, container, style) 
        
        // the TemplateMachine instance that holds the data and algorithm required to pick the suitable templates
        this.machine = new TemplateMachine
        
        // CSS properties that apply to the paged element
        this.style = {}
    }
    
    PagedElement.prototype = PageManager.prototype
    
    PagedElement.prototype.addTemplate = function(template){
        // delegate to the template machine
        return this.machine.addTemplate(template)
    }
    
    PagedElement.prototype.render = function(){
        
        // the template to be used on the page
        var template = null,
        
            // named flows that are not fully laid out.
            namedFlows = []       
            
        // need to layout the first page ?
        if (!this.pages.length){

            namedFlows = this.machine.getUnsatisfiedFlows() 
                          
            // pick the template that best suites most of the named flows, and that should be applied to the first page 
            template = this.machine.pickTemplate(namedFlows, "first") 
         } 
         else{  
                                                           
             // get all the flows that aren't fully laid out
             namedFlows = this.machine.getUnsatisfiedFlows() 
             

             // pick the template that best suites most of the named flows
             template = this.machine.pickTemplate(namedFlows)    
         }  
         
         if (template){  
             
             // add a new page with the best template 
             this.addPage(null, template.compile())  
             
             // run the algorithm again for the rest of the content
             this.render()
         }  
    }
    
    
    var PageTemplate = function(){
         
        var _parser = new CSSParser,
            _pagedElements = {},
            _templates = [],
            _config = {
                styleType: "text/experimental-css"
            } 
            
            
        function parseStylesheets(){
            var styles = document.querySelectorAll('style[type="'+ _config.styleType +'"]')

            if (!styles || !styles.length){ 
                
                throw new Error("PageTemplate. No stylesheets found. Expected at least one stylesheet with type= "+ _config.styleType)
            }

            styles = Array.prototype.slice.call(styles)
            styles.forEach(function(style){
                _parser.parse(style.textContent)
            })

            _parser.cascade()
        } 

        /*
            Get the css rules that can determine a multi-page element from the parser output 
                
            @param {Array} cssRules CSS Rules objects array to filter
            @return {Array} an array of CSSRule objects
        */
        function getPagedElementRules(cssRules){
            return cssRules.filter(function(rule){
                return rule.style["overflow-style"] && rule.type === "rule"
            })
        }

        /*
            Get the css template rules from the parser output

            @param {Array} cssRules CSS Rules objects array to filter
            @return {Array} an array of CSSRule objects
        */
        function getTemplateRules(cssRules){
            return cssRules.filter(function(rule){
                return rule.type === "template"
            })
        }
        
        /*
            Create PagedElement widget based on rules from a parsed stylesheet 
            
            @see createPagedElement(element, rule)
            
            @param {Array} cssRules Array of CSS Rule objects resulted from parsing a stylesheet
            @return {Object} map of paged elements with the CSS rule selector text as key and the instance as value  
        */
        function getPagedElements(cssRules){
            
            // find elements that need to be paged
            var rules = getPagedElementRules(cssRules),
                pagedElements = {}
            
            if (!rules || !rules.length){
                return pagedElements
            }
            
            // create paged element widgets based on parser output
            rules.forEach(function(rule){   

                // get all elements matched by the selector 
                var elements = document.querySelectorAll(rule.selectorText),
                    selector = rule.selectorText,
                    pagedEl

                if (!elements || !elements.length){
                    return
                } 

                // turn NodeList into a proper Array
                elements = Array.prototype.slice.call(elements)

                // create paged element widgets out of each match
                elements.forEach(function(element){

                    pagedEl = createPagedElement(element, rule)
                    if (!pagedEl){
                        return
                    }    

                    // store the paged element widgets for public reference
                    // using an array - multiple widgets might be created for a generic selector
                    if (!pagedElements[selector]){
                        pagedElements[selector] = []
                    } 

                    pagedElements[selector].push(pagedEl)
                })

            })
            
            return pagedElements
        }

        /*
            Create a multi-page widget from an element following a CSS rule.
            A CSS rule which has, in the 'style' object, the "overflow-style" property set to "paged-x" or 
            "paged-y" determines the element matched by its selector to be a multi-page element (PagedElement)

            @param {Object/DOMElement} element The element to be turned into a multi-page element widget
            @param {Object/CSSRule} rule The CSS Rule object with the definition for a multi-page element

            Example of CSS Rule to turn element into a multi-page widget
            body {
                overflow-style: paged-x
            }  

            @return {Object/PagedElement} a widget with multiple page support and navigation
        */
        function createPagedElement(element, rule){

                if (!element || typeof element !== 'object'){
                    throw new TypeError("createPagedElement(). Invalid input. Expected 'object', got "+ element)
                }
                var pagedEl = new PagedElement(element, rule.style),
                    validMatch = true  

                // set the direction of the pages in the paged element
                switch (rule.style["overflow-style"]){

                    case "paged-y":
                        pagedEl.setVerticalDirection(true)
                    break 

                    case "paged-x":
                        pagedEl.setVerticalDirection(false)
                    break   

                    default:
                        // a valid property value was NOT found: overflow-x || overflow-y
                        validMatch = false
                }

                if (validMatch){  
                    pagedEl.style = rule.style
                }  
                else{  
                    delete pagedEl
                }        

                return pagedEl
        } 

        /* 
            Get Template object instances out of @template CSS rules
            
            If Templates have facets, like :first - specialized styling for the first page,
            cascade their rules and assign them to the according parent template.
            
        */
        function getTemplates(cssRules){

            // find template declarations   
            var templates = getTemplateRules(cssRules)
            
            if (!templates || !templates.length){
                return []
            }         
            
            templates = templates.map(function(rule){ 
                return new Template(rule) 
            })     

            // look for template with pseudo-classes
            templates.forEach(function(t, index){ 

                var parts = t.rule.selectorText.split(":"),
                    parentTemplate

                // parts[0] = template rule and identifier
                // parts[1] = pseudo-class
                if (!parts.length || !parts[1]){
                    
                    // no pseudo-class; bail out!
                    return 
                }  

                // get the parent template that the pseudo-class applies to.
                // required to apply the CSS cascade
                templates.forEach(function(t){  
                    if (t.rule.selectorText === parts[0]){
                        parentTemplate = t
                    }
                })   

                // no parent template for this pseudo class; bail out!
                if (!parentTemplate){
                    return 
                }        

                // new template rule, merging the parent template rule and the pseudo-class template rule
                var rule = _parser.doExtend({}, parentTemplate.rule, t.rule)

                parentTemplate.addFacet(parts[1], new Template(rule))     
            })    

            return templates   
        }
        
        /*
            Decorate PagedElements with corresponding Template objects
            
            @param {Array} templates The list of Template instances to assign
            @param {Object} pagedElements Map of PagedElement instances that need templates 

            @return {undefined}
        */
        function assignTemplates(templates, pagedElements){
            
            if (!templates || !templates.length || !pagedElements){
                return
            }                                                     
            
            var selector, widgets, list

            for (selector in pagedElements){
                widgets = pagedElements[selector]

                if (!widgets || !widgets.length){
                    return
                }                              

                widgets.forEach(function(pagedEl){

                    var templateSet = pagedEl.style['template-set'] 

                    if (templateSet){      
                        templateSet = templateSet.split(",").map(function(name){
                            return name.trim()
                        })
                    }       

                    if (!templateSet || !templateSet.length){
                        
                        // no 'template-set' property defined for this pagedElement
                        // use the last template found 
                        pagedEl.addTemplate(templates[templates.length - 1])        
                    }  
                    else{               
                        
                        // get the templates that match 'template-set' in the order they are defined in css 
                        list = templates.filter(function(template){ 
                             return templateSet.indexOf(template.name) !== -1
                        }) 

                        // no templates from 'template-set' were found. use the last template
                        if (!list.length){                                          
                            
                            pagedEl.addTemplate(templates[templates.length - 1])        
                        }
                        else{
                            
                            list.forEach(function(matchedTemplate){
                                pagedEl.addTemplate(matchedTemplate)        
                            })
                        } 
                    }  
                })   

            }
        } 
        
        /*
            Apply a function to each of the generated PagedElement objects
            The function receives two parameters: a PagedElement and its corresponding selector       
            
            @param {Function} fn A function to be called on each paged element
            
        */
        function withEachPagedElement(fn){
            for (selector in _pagedElements){
                pagedEls = _pagedElements[selector]

                if (!pagedEls || !pagedEls.length){
                    return
                }

                pagedEls.forEach(function(pagedEl){
                    fn.call(this, pagedEl, selector)
                }, this)
            }
        }

        /*
            Render the layout for each paged element

            @return {undefined}
        */
        function doLayout(){       
            
           withEachPagedElement(function(pagedEl){
               pagedEl.render() 
           })       
            
        }

        function init(){
            
            parseStylesheets() 

            if (!_parser.cssRules.length){
                return
            } 

            // create PagedElement widgets
            _pagedElements = getPagedElements(_parser.cssRules)

            // create Template objects
            _templates = getTemplates(_parser.cssRules) 

            if (!_templates.length){
                return
            }  

            // assign template object definitions to paged elements
            assignTemplates(_templates, _pagedElements)

            doLayout()  
        }    
        
        init()
        
        return {
            reset : function(){ 
                          
                // remove all paginated widgets
                withEachPagedElement(function(pagedEl){
                    pagedEl.container.parentNode.removeChild(pagedEl.container)
                })
                
                _pagedElements = {}
                _templates = []
                _parser = new CSSParser()
            },
             
            init: function(){        
                 this.reset.call(this)
                 init.call()
            },
            
            // expose the innards to document for unit tests
            getPagedElements: function(){
                return _pagedElements
            },
                    
            // expose the innards to document for unit tests
            getTemplates: function(){
                return _templates
            }
        }            
    }
    
    // let's get this party started!
    document.CSSPageTemplate = new PageTemplate()
    
    // using debounce from underscore.js by DocumentCloud.com
    function debounce(func, wait) {
     var timeout;
     return function() {
       var context = this, args = arguments;
       var later = function() {
         timeout = null;
         func.apply(context, args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
     };
    };  
      
    // scrap everything and do the layout again
    // there be dragons in 'required-flow' and interlaced pages workflow
    onWindowResize = debounce(function(e){
         document.CSSPageTemplate.init()
    }, 50)  
    
    window.addEventListener("resize", onWindowResize)  
}()
     