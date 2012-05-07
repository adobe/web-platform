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

/*
Real developers learn from source. Welcome!

pagemanager.js
Author: Razvan Caliman (rcaliman@adobe.com, twitter: @razvancaliman)

The PageManager turns an HTML element into a multi-page widget of itself.
It has a small API for adding and removing pages and basic page navigation 

PageManager is meant to be used in conjunction with CSS Pagination Templates code to create
multiple views of the same element with one or more templates.

The output makes sense when also using styles from pagemanager.css
Have fun! ;)
*/

!function(scope){
     
    function Page(source, fragment){
        this.index = 0
        this.box = (source && source.ownerDocument) ? source : document.createElement("div")
        this.box.classList.add("page") 

        if (fragment && fragment.ownerDocument ){
            this.box.appendChild(fragment)
        }

        this.show = function(){
            this.box.setAttribute("data-current","")
            return this 
        }      

        this.hide = function(){
            this.box.removeAttribute("data-current") 
            return this
        }
    }

    function PageManager(element, style){

        // crash and burn if the page container isn't a DOM node
        if (typeof element !== "object" || !element.ownerDocument){
            throw new TypeError("PageManager() Invalid input. Expected DOM Node, got "+ element)
        }

        this.pages = []
        this.isVertical = false
        this.container = document.createElement("div"),
        this.container.setAttribute("data-page-container",'')
        this.currentPage = null

        style = style || {}

        // let the container inherith the paged element's style
        for (var property in style){
            this.container.style[property] = style[property]
        }

        var parentStyle = window.getComputedStyle(element, null)

        this.container.style.height = style.height || parentStyle.height
        this.container.style.width = style.width || parentStyle.width

        element.appendChild(this.container)

        var self = this

        document.addEventListener("keyup", function(e){
            switch(e.keyCode){
                case 37:
                case 38:
                    self.prevPage()
                break

                case 39:
                case 40:
                    self.nextPage()
                break
            }
        })
    }
    
    PageManager.prototype =  {

        /*
            Add a page to the PageManager instance.
            If a source element is provided it will be decorated and used as a page.
            The source element will be removed from its parentNode
            
            @param {Object/DOMElement} sourceElement The element that will be turned into a page
            @param {Object/DOMElement/DOMFragment} content The element that will be injected into the newly created page
            
            @return {Object} a Page instance
        */
        addPage: function(sourceElement, content){

            var page = new Page(sourceElement, content)
            page.index = this.pages.length

            // store the reference for this page
            this.pages.push(page)

            this.container.appendChild(page.box)

            // stack pages with reverese z-index
            this.stackPages()

            // display this page if it is the first one
            if (page.index === 0){
                this.currentPage = page.show()
            }

            return page
        },

        /*
           Reverse-order z-index CSS property for page containers 
           in order to overlap correctly during transitioning
        */
        stackPages: function(){

            var maxZ = this.pages.length
            if (!maxZ){
                return
            }

            this.pages.map(function(page){
                page.box.style['z-index'] = --maxZ;
            })
        }, 

        goToPage: function(index){   
            var page =  this.pages[index]

            if (page){
                this.currentPage.hide()
                this.currentPage = page.show()

                return this.currentPage
            }
        },

        nextPage: function(){
            this.goToPage(this.currentPage.index + 1)
        },

        prevPage: function(){
            this.goToPage(this.currentPage.index - 1)
        },

        /* 
            Get a Page object by its index.

            @return {Object/undefined}
        */
        getPage: function(index){
            return this.pages[index]
        },

        setVerticalDirection: function(flag){
           this.isVertical = flag || false;

           if (this.isVertical){
               this.container.setAttribute("data-orientation","vertical")
           }
           else{
               this.container.setAttribute("data-orientation","horizontal")
           }

           return this.isVertical
        }
    }

    scope = scope || window
    scope["PageManager"] = PageManager

}(window)
