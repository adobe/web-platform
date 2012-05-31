!function(){  
    
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
    
    var checkSupport = function(){
        
        if (CSSRegions.isSupported && CSSRegions.hasOversetProperty){
            return 
        }
        else{
            var target = document.querySelector('article section') 

            if (target){
                target.innerHTML = createWarning()
            }
        }
    }
    
    var createWarning = function(){
        var h = [],
            p = function(){ h.push.apply(h, arguments) }
            
        p('<p class="error">')
            p('<strong>Warning:</strong> You need to use a <a href="http://nightly.webkit.org/" target="_blank">WebKit nightly</a> browser build to see this example working correctly.')
        p('</p>')
        
        return h.join('')
    }

    document.addEventListener("DOMContentLoaded", checkSupport)
    
}()