CSS Regions basic feature testing
=================================
                                                                                                         
This set of unit tests helps determine the level of support for CSS Regions in a browser.

It is not meant to be a full test suite or to have a broad code coverage. For that please refer to the [CSS Regions WebKit Layout Tests](http://trac.webkit.org/browser/trunk/LayoutTests/fast/regions).
    
How to use
----------
Open index.html in your CSS Regions-enabled browser.                        

A passing test means that the feature is supported by the browser.
A failing test means that the feature is not yet supported by the browser.

Uses
----
The feature detect page uses the [QUnit](https://github.com/jquery/qunit) and [-prefix-free](http://leaverou.github.com/prefixfree/) JavaScript frameworks.