CSS Pagination Templates - Quick Guide
====

Crash course
-----  
                                                                                       
CSS Pagination Templates enable page-based navigation of HTML content removing the need for scrolling. A page can have custom dimensions or it can be the size of the browser viewport.                                                                                                                     
CSS Pagination Templates enable developers to declare the layout of their HTML using only CSS, without auxiliary HTML markup. 

     
Paged elements
----          

An element becomes paged when it has the <code>overflow-style</code> CSS property set to either <code>paged-x</code> or <code>paged-y</code>.

A paged element means that its content does not fully fit the viewport determined by the element's dimensions. Instead of overflowing the element or triggering scrollbars, the content gets split across multiple pages, or viewports, of that element. Each page has the element's dimension properties. Only one page is visible at any given time.                                                                                                                                                                         

<pre>
article {                   
    width: 900px;
    height: 600px;
    overflow-style: paged-x;
}
</pre>      

The <code>article</code> will be paginated horizontally.  

<pre>
article {                   
    width: 900px;
    height: 600px;
    overflow-style: paged-y;
}
</pre>      

The <code>article</code> will be paginated vertically.

The pages of the element can be laid out according to @template rules defined in a stylesheet. 
Pages are based on templates. A template defines how the content will be laid out in a page. Pages are created as many times as necessary in order to display all the content of the paged element.

Templates
-----

By default a paged element uses a template with a single column. The column is as wide and as tall as the page.  

Templates can be declared in CSS with the <code>@template</code> rule. Each @template rule MUST have one or more <code>@slot</code> rules. Each @slot rule determines a box where the element's content will be rendered. When the content doesn't fit in a @slot it overflows to the next available @slot rule in that template. When the template's @slot rules are full, but there's more content, another page is generated. The new page will use the same template if no other rules are employed. 

<pre>
@template {
    @slot {            
        width: 50%;
        height: 100%;
    }
}   
</pre>   

Anonymous template with one anoynmous slot.  

Named Templates and CSS cascade
-----

Templates and slots can be identified with names. 

<pre>
@template master {
    @slot column1 {            
        width: 50%;
        height: 100%;
    }        
    
    @slot column2 {
        width: 50%;
        height: 100%
    }
}   
</pre> 

Named template with two named slots.

Multiple templates and slots with the same name can be used in the same stylesheet. CSS cascade is applied. The latter defined properties overwrite the former defined ones.

<pre>
@template master {
    @slot column1 {            
        width: 50%;
        height: 100%;
    }        
    
    @slot column2 {
        width: 50%;
        height: 100%
    }
}     

@template master{
    @slot column1 {  
        background: green;          
    }        
}
</pre>  

Cascade of template and slot rules: the 'master' template will have two named slots <code>column1</code> and <code>column2</code>. The <code>column1</code> slot will have 50% of the page's width, 100% of the page's height and a green background.

## Template selection


If there are no declared <code>@template</code> rules, the default, single-column template will be used. It will be reused on as many pages as necessary to fully lay out the content of the paged element.

If there are <code>@template</code> rules defined in the stylesheet but no <code>template-set</code> property on the paged element, the last <code>@template</code> rule in the stylesheet will be used. It will be reused on as many pages as necessary, as stated before.

If there is a <code>template-set</code> property on the paged element, its value narrows down the list of templates that MIGHT be used on pages of that element.

<pre>
article{
    overflow-style: paged-x;
    template-set: master;
}   

@template master{
    @slot {
        width: 100%;
        height: 100%;
    }
}         

@template secondary{
    @slot {
        width: 50%;
        height: 100%;
    }
}
</pre>

The <code>template-set</code> property states that ONLY the <code>master</code> template SHOULD be used in laying out the content of the <code>article</code>.

Multiple templates can be specified in the <code>template-set</code> property value. This only narrows down the template selection. It DOES NOT guarantee that ALL templates will be used.

<pre>
article{
    overflow-style: paged-x;
    template-set: master, secondary;
}   
</pre>                
   

## Named flows and templates


Any <code>@slot</code> rule that DOES NOT have a <code>flow-from</code> property will lay out the content of the paged element.

If a <code>@slot</code> rule DOES have a <code>flow-from</code> property pointing to a valid named flow, it will lay out ONLY content from that named flow. Content of a named flow that does not fit in a slot which it is assigned to, will overflow into the next slot rule of the template that has the same assigned named flow. If there are no more available slots for a named flow in a template, a new page is created with the same template. The process is repeated until the named flow is fully rendered. 

<pre>
article{
    overflow-style: paged-x;
}

#lorem-ipsum{
    flow-into: latin-flow;
}   

@template{
    @slot{
        width: 50%;
        height: 100%;
    }       
    
    @slot latin{       
        flow-from: latin-flow;
        width: 50%;
        height: 100%;
    }
}         
</pre>   

The template is reused on as many pages as necessary until both the paged element's content AND the content of the <code>latin-flow</code> named flow are fully rendered.   

Multiple templates can satisfy the same named-flow. If no other rules are employed, the first template that matches both the named flow and the paged element's content will be reused as many times as necessary to lay out the contents.

<pre>
article{
    overflow-style: paged-x; 
    template-set: master, secondary;
}

#lorem-ipsum{
    flow-into: latin-flow;
}   

@template master{
    @slot{
        width: 50%;
        height: 100%;
    }       
    
    @slot latin{       
        flow-from: latin-flow;
        width: 50%;
        height: 100%;
    }
}      

@template secondary{
    @slot{
        ...
    }
}   
</pre>

## Template selection

                                              
By default, templates specified with the <code>template-set</code> property will be used, in the order declared in the stylesheet, with the priorities following these intrinsic rules:

1. templates satisfying both the paged element's content and the associated named flows;       

2. templates satisfying only the paged element's content;

3. templates satisfying only the associated named flows;

<pre>
article{
    overflow-style: paged-x; 
    template-set: latin, master, both;
}

#lorem-ipsum{
    flow-into: latin-flow;
}   

@template latin{
    @slot latin{       
        flow-from: latin-flow;
        ...
    }
}      

@template master{
    @slot {       
        ...
    }
}  

@template both{
    @slot {       
        ...
    }   
    
    @slot latin{
        flow-from: latin-flow;
    }
}
</pre>
 
The <code>both</code> template will be used first because it satisfies both the paged element's content and the <code>latin-flow</code> named flow content.

The <code>master</code> template will be used next because it satisfies the paged element's content. If there's no more content from the paged element, this template will be dropped.

The <code>latin</code> template will be used last because it satisfies the <code>latin-flow</code> named flow. If there's no more content from the named flow, this template will be dropped.


### Multiple named flows

By default, the template selection algorithm will pick the template that satisfies as many named flows as possible, per page.

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
    @slot {       
        flow-from: latin-flow;
        ...
    }
}      

@template french{
    @slot {      
        flow-from: french-flow;
        ...
    }
}  

@template both{
    @slot french{       
        flow-from: french-flow;
        ...
    }   

    @slot latin{
        flow-from: latin-flow;
    }
}    
</pre>