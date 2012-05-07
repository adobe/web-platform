CSS Pagination Templates - Template Weight proposal
==== 
                        
About
----- 
This is not part of the oficial CSS Pagionation Template proposal. It is an exercise in specifying an alternate template selection mechanism based on biasing.

**CAUTION:** Template weights are NOT implemented in the prototype. Don't attempt to use them, you'll save yourself a lot of frustration.

Feedback on this proposal is very welcome!
      

Template weight
-----

The priority of templates can be biased by using the <code>template-weight</code> property. The <code>template-weight</code> property can have a positive integer value. It functions similarly to the <code>z-index</code> property for positioned elements. The higher value gives more imporance to the <code>@template</code> rule.
                                                                                                       
When the template selection algorithm needs to pick a template, it will sort the templates first by the <code>template-weight</code> property, then by the intrinsic rules.

<pre>
article{
    overflow-style: paged-x; 
    template-set: latin, both;
}

#lorem-ipsum{
    flow-into: latin-flow;
}   

@template latin{    
    template-weight: 2;
    
    @slot latin{       
        flow-from: latin-flow;
        ...
    }
}      

@template both{
    template-weight: 1;
    
    @slot {       
        ...
    }   

    @slot latin{
        flow-from: latin-flow;
    }
} 
</pre>
The <code>latin</code> template will be used first because it has the higher template-weight, than the <code>both</code> template.

The <code>both</code> template will be used last because it has the lower template-weight, even though, the intrinsic rules say it should be more important. In this case, the <code>@slot latin</code> will be empty on all page instances used to fully lay out the paged element's content.   

### Biasing between templates serving named flows

Template weights can be used to bias between templates to determine the order in which the content will be laid out.

<pre>
article{
    overflow-style: paged-x; 
    template-set: latin, french, both;
}

#lorem-ipsum{
    flow-into: latin-flow;
} 

#bonjour{
    flow-into: french-flow;
}  

@template latin{    
    template-weight: 1;

    @slot{       
        flow-from: latin;
    }
} 

@template french{
    template: weight: 2;
    
    @slot{
        flow-from: french-flow;
    }
} 

@template both{   
    
    @slot french{
        flow-from: french-flow;
    }  
    
    @slot latin{
        flow-from: latin-flow;
    }
}  
</pre>  

The <code>french</code> template will be used first because it has the highest template-weight. It will be reused as many times as necessary to fully lay out the content of the <code>french-flow</code> named flow.

The <code>latin</code> template will be used next because it has the second highest template-weight. It will be reused as many times as necessary to fully lay out the content of the <code>latin-flow</code> named flow.

The <both>both</both> template will never be used because all the named flows content is exhaused. If intrinsinc rules would have been applied, without <code>template-weight</code>, this template should have been used first and repeated until one of the named flows it serves would have been exhaused.    

The default, single column template will be used last to render any paged element content that's left available.

### Biasing between multiple templates serving multiple named flows 

The <code>template-weight</code> can be used to bias between multiple templates that satisfy multiple named flows.

<pre>
article{
    overflow-style: paged-x; 
    template-set: two-columns, three-columns;
}

#lorem-ipsum{
    flow-into: latin-flow;
} 

#bonjour{
    flow-into: french-flow;
}  

@template two-columns{    
    template-weight: 1;

    @slot latin{       
        flow-from: latin;
        ...
    }  
    
    @slot french{
        flow-flow: french 
        ...
    }
} 

@template three-columns{    
    template-weight: 2;

    @slot latin{       
        flow-from: latin;
        ...
    }  
    
    @slot french{
        flow-flow: french 
        ...
    } 
    
    @slot french{
        flow-from: french
        ...
    }
}
</pre>     

The <code>three-columns</code> template will be used first because it has the highest <code>template-weight</code> value.         

The <code>two-columns</code> template will be used next because it has the second highest <code>template-weight</code> value. 

Even though the <code>two-columns</code> template is declared first in CSS order and it satisfies both flows, it is still picked second because its <code>template-weight</code> is lower.

The default, single column template will be used last to render any paged element content that's left available.

### Biasing between templates satisfying the paged element or paged element + named flows

<pre>
article{
    overflow-style: paged-x; 
    template-set: master, both;
}

#lorem-ipsum{
    flow-into: latin-flow;
} 

@template both{    
    template-weight: 1;
    
    @slot {
        ...
    }

    @slot latin{       
        flow-from: latin;
        ...
    }  
} 

@template master{    
    template-weight: 2;

    @slot {       
        ...
    }  
}        
</pre>

<<<<<<< HEAD
The <code>master</code> template will be picked first because it has the highest <code>template-weight</code> value. It will be used on as many pages as necessary to fully lay out the paged element's content.    
=======
The <code>master</code> template will be picked first because it has the highest <code>template-weight</code> value.     
>>>>>>> alg

The <code>both</code> template will be picked next because it has the second highest <code>template-weight</code> value, even though, following intrinsic rules and CSS order it should have been used first. In this case the <code>@slot</code> rules that should lay out the paged element's content will be empty, because this content is already exhaused by the <code>master</code> template.


<<<<<<< HEAD
### Biasing between templates satisfying both the paged element and named flows
=======
### Biasing between templates satisfying the paged element's content and named flows
>>>>>>> alg

<pre>
article{
    overflow-style: paged-x; 
    template-set: content-latin, latin-content, latin;
}

#lorem-ipsum{
    flow-into: latin-flow;
} 

@template content-latin{    
    template-weight: 1;
    
    @slot {
        ...
    }    
    
    @slot latin{
        flow-from: latin;
        ...
    }
} 

@template latin-content{    
    template-weight: 2;
    
    @slot latin{       
        flow-from: latin;
        ...
    }

    @slot {       
        ...
    }  
}        
</pre> 

The <code>latin-content</code> template will be picked first because it has the highest <code>template-weight</code> value.

The <code>content-latin</code> template will be picked next because it has the second highest <code>template-weight</code> value. This template will repeat in order to satisfy the remaining content not fully laid out, either from the paged element or from the named flow.


## Conclusion

Using the <code>template-weight</code> the developer can easily and predictably bias the template selection algorithm to the use a desired template order.

This property aims to cover the usecases for the <code>required-flow</code> and <code>available-content</code> properties and remove their need, by giving the developer fine control over the order in which content should be laid out. The <code>template-weight</code> property can cover cases for multiple named flows or for biasing between same-level of importance templates. 

This property is an easy toggle when combined with <code>@media</code> rules (media queries), thus reducing maintenance overhead.